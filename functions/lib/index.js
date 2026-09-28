"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserSignUp = exports.updateUserRole = exports.registerUserWithRole = void 0;
const functionsV2 = __importStar(require("firebase-functions/v2"));
const https_1 = require("firebase-functions/v2/https");
const functionsV1 = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const ALLOWED_ROLES = ["STUDENT", "INDUSTRY", "COLLEGE"];
exports.registerUserWithRole = (0, https_1.onCall)({ enforceAppCheck: false }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "You must be signed in to register.");
    }
    const { role, displayName, college, location, phone } = request.data;
    if (!role || !ALLOWED_ROLES.includes(role)) {
        throw new https_1.HttpsError("invalid-argument", `Invalid role. Must be one of: ${ALLOWED_ROLES.join(", ")}`);
    }
    if (!displayName) {
        throw new https_1.HttpsError("invalid-argument", "Display name is required.");
    }
    try {
        await admin.auth().setCustomUserClaims(request.auth.uid, {
            role: role,
        });
        const updateData = {
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
            role: role,
            college: college || null,
            location: location || null,
            phone: phone || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            processed: false,
        });
        functionsV2.logger.info(`Role '${role}' assigned to user ${request.auth.uid}`, { uid: request.auth.uid, role });
        return {
            success: true,
            message: `Role '${role}' assigned successfully!`,
            uid: request.auth.uid,
        };
    }
    catch (error) {
        functionsV2.logger.error("Error assigning role:", error);
        throw new https_1.HttpsError("internal", "Failed to assign role to user.");
    }
});
exports.updateUserRole = (0, https_1.onCall)({ enforceAppCheck: false }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "You must be signed in.");
    }
    const caller = await admin
        .auth()
        .getUser(request.auth.uid)
        .then((u) => u.customClaims);
    if (caller?.role !== "INDUSTRY" && caller?.role !== "COLLEGE") {
        throw new https_1.HttpsError("permission-denied", "Only authorized users can assign roles.");
    }
    const { targetUid, role } = request.data;
    if (!targetUid || !ALLOWED_ROLES.includes(role)) {
        throw new https_1.HttpsError("invalid-argument", `Invalid role or target UID. Must be one of: ${ALLOWED_ROLES.join(", ")}`);
    }
    try {
        await admin.auth().setCustomUserClaims(targetUid, {
            role: role,
        });
        return {
            success: true,
            message: `Role '${role}' assigned to user ${targetUid}`,
        };
    }
    catch (error) {
        functionsV2.logger.error("Error updating user role:", error);
        throw new https_1.HttpsError("internal", "Failed to update user role.");
    }
});
exports.onUserSignUp = functionsV1.auth.user().onCreate(async (user) => {
    const claims = user.customClaims || {};
    const role = claims.role;
    if (role && ALLOWED_ROLES.includes(role)) {
        functionsV2.logger.info(`User ${user.uid} signed up with role ${role}`);
        await admin
            .firestore()
            .collection("userRoles")
            .doc(user.uid)
            .set({
            uid: user.uid,
            email: user.email,
            role: role,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
});
//# sourceMappingURL=index.js.map