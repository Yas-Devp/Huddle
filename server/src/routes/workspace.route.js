import express from "express";
import {
  createWorkspace,
  getWorkspaceById,
  getWorkspaces,
} from "../controllers/workspace.controller.js";
import {
  createInvitation,
  joinWorkspaceWithCode,
  listInvitations,
  updateInvitation,
} from "../controllers/invitation.controller.js";
import { verifyToken } from "../middleware/auth.js";
import {
  requireWorkspaceAdmin,
  requireWorkspaceMember,
} from "../middleware/workspaceAccess.js";

const router = express.Router();

router.get("/", verifyToken, getWorkspaces);
router.post("/create", verifyToken, createWorkspace);
router.post("/join", verifyToken, joinWorkspaceWithCode);

// Keep these below /create and /join: literal paths must not be read as :id.
router.get("/:id", verifyToken, requireWorkspaceMember, getWorkspaceById);
router.get(
  "/:id/invitations",
  verifyToken,
  requireWorkspaceMember,
  requireWorkspaceAdmin,
  listInvitations,
);
router.post(
  "/:id/invitations",
  verifyToken,
  requireWorkspaceMember,
  requireWorkspaceAdmin,
  createInvitation,
);
router.patch(
  "/:id/invitations/:invitationId",
  verifyToken,
  requireWorkspaceMember,
  requireWorkspaceAdmin,
  updateInvitation,
);

export default router;
