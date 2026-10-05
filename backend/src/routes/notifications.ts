import { Router } from 'express';
import type { Pool } from 'pg';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { readQuery, readUuidParam, requestId } from '../lib/http';
import type { AuthMiddleware } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  createNotificationSchema,
  listNotificationsSchema,
  type CreateNotificationBody,
  type ListNotificationsQuery,
} from '../middleware/domainSchemas';
import { insertNotification } from './applications';

/**
 * Server-side notification feed.
 *
 * This is the replacement for `src/lib/syncBridge.ts`'s notification bus. The
 * bus wrote to `localStorage['skillsetu_sync:notifications']` and destructively
 * consumed records after merging, which meant notifications existed only in the
 * browser that created them: a student applying on their laptop never reached
 * the recruiter's phone, and clearing site data deleted the whole feed.
 *
 * Reads are always `recipient_user_id = req.user.userId`. There is no way to
 * list another account's notifications.
 */

export type NotificationRouterDependencies = {
  pool: Pool;
  authMiddleware: AuthMiddleware;
};

export function createNotificationRouter({ pool, authMiddleware }: NotificationRouterDependencies): Router {
  const router = Router();
  const { requireAuth, requireRole } = authMiddleware;

  router.get('/api/notifications', requireAuth, validateQuery(listNotificationsSchema), (req, res, next) => {
    void (async () => {
      const query = readQuery<ListNotificationsQuery>(res);
      const userId = req.user!.userId;

      const result = await pool.query(
        `SELECT id, type, title, message, link, meta, read, created_at
         FROM notifications
         WHERE recipient_user_id = $1
           AND ($2::boolean = false OR read = false)
         ORDER BY created_at DESC
         LIMIT $3 OFFSET $4`,
        [userId, query.unreadOnly, query.limit, query.offset],
      );

      const unread = await pool.query<{ count: string }>(
        'SELECT count(*)::text AS count FROM notifications WHERE recipient_user_id = $1 AND read = false',
        [userId],
      );

      res.status(200).json({
        notifications: result.rows,
        unreadCount: Number(unread.rows[0]?.count ?? 0),
        requestId: requestId(res),
      });
    })().catch(next);
  });

  router.post('/api/notifications/:id/read', requireAuth, (req, res, next) => {
    void (async () => {
      const id = readUuidParam(req.params);
      const userId = req.user!.userId;

      const updated = await pool.query(
        `UPDATE notifications SET read = true WHERE id = $1 AND recipient_user_id = $2 RETURNING id`,
        [id, userId],
      );

      if (!updated.rows[0]) {
        throw AppError.notFound('Notification not found.', 'notification_not_found');
      }

      res.status(200).json({ id, read: true, requestId: requestId(res) });
    })().catch(next);
  });

  router.post('/api/notifications/read-all', requireAuth, (req, res, next) => {
    void (async () => {
      const userId = req.user!.userId;

      const updated = await pool.query(
        'UPDATE notifications SET read = true WHERE recipient_user_id = $1 AND read = false RETURNING id',
        [userId],
      );

      res.status(200).json({ markedRead: updated.rows.length, requestId: requestId(res) });
    })().catch(next);
  });

  /**
   * POST /api/notifications
   *
   * Deliberately restricted. Self-addressed notifications are the one legitimate
   * client-initiated case (a skill verification badge). Anything addressed to
   * somebody else is server-generated, because letting a client address a
   * notification would turn this into a stored message forgery.
   */
  router.post('/api/notifications', requireAuth, validateBody(createNotificationSchema), (req, res, next) => {
    void (async () => {
      const user = req.user!;
      const body = req.body as CreateNotificationBody;

      if (body.recipientUserId !== user.userId) {
        throw AppError.forbidden(
          'You can only create notifications for yourself.',
          'notification_recipient_not_self',
        );
      }

      const inserted = await insertNotification(pool, {
        recipientUserId: user.userId,
        type: body.type,
        title: body.title,
        message: body.message ?? null,
        link: body.link ?? null,
        meta: body.meta,
      });

      logger.info({ userId: user.userId, type: body.type }, 'self notification created');

      res.status(201).json({ created: true, notificationId: inserted, requestId: requestId(res) });
    })().catch(next);
  });

  return router;
}