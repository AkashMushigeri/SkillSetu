import * as functionsV2 from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as functionsV1 from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

const ALLOWED_ROLES = ["STUDENT", "INDUSTRY", "COLLEGE"] as const;
type UserRole = (typeof ALLOWED_ROLES)[number];

interface RegisterData {
  role: string;
  displayName: string;
  photoUrl?: string;
  college?: string;
  location?: string;
  phone?: string;
}

interface UpdateRoleData {
  targetUid: string;
  role: string;
}

async function setUserRoleClaims(uid: string, role: UserRole) {
  const user = await admin.auth().getUser(uid);
  await admin.auth().setCustomUserClaims(uid, {
    ...(user.customClaims || {}),
    role,
    userRole: role,
  });
}

export const registerUserWithRole = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be signed in to register."
      );
    }

    const { role, displayName, college, location, phone } =
      request.data as RegisterData;

    if (typeof role !== "string" || !ALLOWED_ROLES.includes(role as UserRole)) {
      throw new HttpsError(
        "invalid-argument",
        `Invalid role. Must be one of: ${ALLOWED_ROLES.join(", ")}`
      );
    }

    if (typeof displayName !== "string" || !displayName.trim() || displayName.length > 120) {
      throw new HttpsError(
        "invalid-argument",
        "Display name must be between 1 and 120 characters."
      );
    }

    const optionalFields: Array<[string, unknown, number]> = [
      ["photoUrl", request.data.photoUrl, 2048],
      ["college", college, 160],
      ["location", location, 160],
      ["phone", phone, 32],
    ];
    for (const [field, value, maxLength] of optionalFields) {
      if (value !== undefined && (typeof value !== "string" || value.length > maxLength)) {
        throw new HttpsError("invalid-argument", `${field} must be a string of at most ${maxLength} characters.`);
      }
    }

    try {
      const updateData: admin.auth.UpdateRequest = {
        displayName: displayName.trim(),
      };
      if (request.data.photoUrl) {
        updateData.photoURL = request.data.photoUrl;
      }

      const requestedRole = role as UserRole;
      const currentUser = await admin.auth().getUser(request.auth.uid);
      const approvedRole = currentUser.customClaims?.userRole;
      if (requestedRole !== "STUDENT" && approvedRole !== requestedRole) {
        await admin
          .firestore()
          .collection("pendingRegistrations")
          .doc(request.auth.uid)
          .set({
            uid: request.auth.uid,
            email: request.auth.token.email || null,
            displayName: displayName.trim(),
            role: requestedRole,
            college: college || null,
            location: location || null,
            phone: phone || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            processed: false,
          });

        await admin.auth().updateUser(request.auth.uid, updateData);
        return {
          success: true,
          pendingApproval: true,
          message: "Your organization role request is pending approval.",
          uid: request.auth.uid,
        };
      }

      await setUserRoleClaims(request.auth.uid, requestedRole);
      await admin.auth().updateUser(request.auth.uid, updateData);

      await admin
        .firestore()
        .collection("userRoles")
        .doc(request.auth.uid)
        .set({
          uid: request.auth.uid,
          email: request.auth.token.email || null,
          role: requestedRole,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      functionsV2.logger.info(
        `Role '${requestedRole}' assigned to user ${request.auth.uid}`,
        { uid: request.auth.uid, role: requestedRole }
      );

      return {
        success: true,
        message: `Role '${requestedRole}' assigned successfully!`,
        uid: request.auth.uid,
      };
    } catch (error) {
      functionsV2.logger.error("Error assigning role:", error);
      throw new HttpsError(
        "internal",
        "Failed to assign role to user."
      );
    }
  }
);

export const updateUserRole = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be signed in."
      );
    }

    if (request.auth.token.admin !== true) {
      throw new HttpsError(
        "permission-denied",
        "Only administrators can assign roles."
      );
    }

    const { targetUid, role } = request.data as UpdateRoleData;

    if (typeof targetUid !== "string" || !targetUid || targetUid.length > 128 ||
      typeof role !== "string" || !ALLOWED_ROLES.includes(role as UserRole)) {
      throw new HttpsError(
        "invalid-argument",
        `Invalid role or target UID. Must be one of: ${ALLOWED_ROLES.join(", ")}`
      );
    }

    try {
      await setUserRoleClaims(targetUid, role as UserRole);
      await admin
        .firestore()
        .collection("userRoles")
        .doc(targetUid)
        .set({
          uid: targetUid,
          role: role as UserRole,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

      return {
        success: true,
        message: `Role '${role}' assigned to user ${targetUid}`,
      };
    } catch (error) {
      functionsV2.logger.error("Error updating user role:", error);
      throw new HttpsError(
        "internal",
        "Failed to update user role."
      );
    }
  }
);

export const onUserSignUp = functionsV1.auth.user().onCreate(async (user) => {
  const claims = user.customClaims || {};
  const role = claims.role;

  if (role && ALLOWED_ROLES.includes(role as UserRole)) {
    functionsV2.logger.info(
      `User ${user.uid} signed up with role ${role}`
    );

    await admin
      .firestore()
      .collection("userRoles")
      .doc(user.uid)
      .set({
        uid: user.uid,
        email: user.email,
        role: role as UserRole,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  }
});
