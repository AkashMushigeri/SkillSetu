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

    if (!role || !ALLOWED_ROLES.includes(role as UserRole)) {
      throw new HttpsError(
        "invalid-argument",
        `Invalid role. Must be one of: ${ALLOWED_ROLES.join(", ")}`
      );
    }

    if (!displayName) {
      throw new HttpsError(
        "invalid-argument",
        "Display name is required."
      );
    }

    try {
      await admin.auth().setCustomUserClaims(request.auth.uid, {
        role: role as UserRole,
      });

      const updateData: admin.auth.UpdateRequest = {
        displayName,
      };
      if (request.data.photoUrl) {
        updateData.photoURL = request.data.photoUrl;
      }

      await admin.auth().updateUser(request.auth.uid, updateData);

      await admin
        .firestore()
        .collection("pendingRegistrations")
        .doc(request.auth.uid)
        .set({
          uid: request.auth.uid,
          email: request.auth.token.email,
          displayName,
          role: role as UserRole,
          college: college || null,
          location: location || null,
          phone: phone || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          processed: false,
        });

      functionsV2.logger.info(
        `Role '${role}' assigned to user ${request.auth.uid}`,
        { uid: request.auth.uid, role }
      );

      return {
        success: true,
        message: `Role '${role}' assigned successfully!`,
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

    const caller = await admin
      .auth()
      .getUser(request.auth.uid)
      .then((u) => u.customClaims);

    if (caller?.role !== "INDUSTRY" && caller?.role !== "COLLEGE") {
      throw new HttpsError(
        "permission-denied",
        "Only authorized users can assign roles."
      );
    }

    const { targetUid, role } = request.data as UpdateRoleData;

    if (!targetUid || !ALLOWED_ROLES.includes(role as UserRole)) {
      throw new HttpsError(
        "invalid-argument",
        `Invalid role or target UID. Must be one of: ${ALLOWED_ROLES.join(", ")}`
      );
    }

    try {
      await admin.auth().setCustomUserClaims(targetUid, {
        role: role as UserRole,
      });

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
