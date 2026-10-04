import { z } from 'zod';

const trimmedName = z
  .string()
  .trim()
  .min(1, 'must not be empty')
  .max(200, 'must be at most 200 characters');

/**
 * `admin` is deliberately absent. There is no public admin signup, and no request
 * body can reach the admin role: `role_requests_role_is_requestable` in migration
 * 0004 blocks it again at the database level.
 */
export const REGISTER_INTENT_ROLES = ['student', 'industry', 'college'] as const;

export const organizationSchema = z
  .object({
    name: trimmedName.optional().nullable(),
    code: z.string().trim().max(32).optional().nullable(),
    website: z.string().trim().max(500).optional().nullable(),
    city: z.string().trim().max(120).optional().nullable(),
    state: z.string().trim().max(120).optional().nullable(),
    industry: z.string().trim().max(120).optional().nullable(),
    about: z.string().trim().max(4000).optional().nullable(),
    logoUrl: z.string().trim().max(1000).optional().nullable(),
  })
  .strict();

export const registerSchema = z
  .object({
    intentRole: z.enum(REGISTER_INTENT_ROLES),
    organization: organizationSchema.optional(),
    displayName: z.string().trim().max(200).optional(),
    phone: z.string().trim().max(32).optional(),
  })
  .strict();

export type RegisterBody = z.infer<typeof registerSchema>;

export const roleRequestSchema = z
  .object({
    requested_role: z.enum(['industry', 'college']),
    organization: organizationSchema,
    reason: z.string().trim().max(2000).optional(),
  })
  .strict();

export type RoleRequestBody = z.infer<typeof roleRequestSchema>;

export const uuidParamSchema = z.object({ id: z.string().uuid('must be a UUID') });

export const listRoleRequestsSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'withdrawn']).default('pending'),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type ListRoleRequestsQuery = z.infer<typeof listRoleRequestsSchema>;

export const approveSchema = z
  .object({
    companyId: z.string().uuid().optional(),
    collegeId: z.string().uuid().optional(),
    decisionNote: z.string().trim().max(2000).optional(),
  })
  .strict();

export type ApproveBody = z.infer<typeof approveSchema>;

export const rejectSchema = z
  .object({
    decisionNote: z.string().trim().max(2000).optional(),
  })
  .strict();

export type RejectBody = z.infer<typeof rejectSchema>;
