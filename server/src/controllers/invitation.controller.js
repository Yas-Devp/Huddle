import { prisma } from "../lib/prisma.js";
import { normalizeInviteCode } from "../lib/inviteCode.js";
import { createUniqueInvitation } from "../lib/invitations.js";

// One generic answer for every unusable key: wrong, expired, revoked or used
// up. Telling them apart would let someone probe for valid codes.
const INVALID_INVITE = {
  code: "INVALID_INVITE",
  message: "This key is invalid, expired, or no longer usable.",
};

const SPOTLIGHT = {
  id: true,
  nom: true,
  description: true,
  mapId: true,
};

const INVITATION_FIELDS = {
  id: true,
  code: true,
  maxUses: true,
  usedCount: true,
  isActive: true,
  expiresAt: true,
  createdAt: true,
};

/**
 * POST /workspaces/join  { code }
 *
 * The only way to become a member from outside. The key is looked up,
 * validated, and consumed in the same transaction that creates the Member row,
 * so maxUses cannot be exceeded even by concurrent requests.
 */
export const joinWorkspaceWithCode = async (req, res) => {
  try {
    const userId = req.user.userId;
    const code = normalizeInviteCode(req.body?.code);

    if (code.length < 8) {
      return res.status(400).json(INVALID_INVITE);
    }

    const invitation = await prisma.workspaceInvitation.findUnique({
      where: { code },
      include: { workspace: { select: SPOTLIGHT } },
    });

    if (!invitation || !invitation.isActive) {
      return res.status(400).json(INVALID_INVITE);
    }

    if (invitation.expiresAt && invitation.expiresAt <= new Date()) {
      return res.status(400).json(INVALID_INVITE);
    }

    // Already inside: opening the room again is not an error.
    const existingMembership = await prisma.member.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId: invitation.workspaceId,
        },
      },
    });

    if (existingMembership) {
      return res.status(200).json({
        message: "You are already a member of this workspace.",
        alreadyMember: true,
        workspace: invitation.workspace,
      });
    }

    try {
      const member = await prisma.$transaction(async (tx) => {
        const claim = await tx.workspaceInvitation.updateMany({
          where: {
            id: invitation.id,
            isActive: true,
            ...(invitation.maxUses === null
              ? {}
              : { usedCount: { lt: invitation.maxUses } }),
          },
          data: { usedCount: { increment: 1 } },
        });

        if (claim.count === 0) {
          const error = new Error("INVITE_EXHAUSTED");
          error.httpStatus = 400;
          throw error;
        }

        return tx.member.create({
          data: {
            userId,
            workspaceId: invitation.workspaceId,
            role: "member",
            posX: 400,
            posY: 300,
          },
        });
      });

      return res.status(201).json({
        message: "You have joined the workspace.",
        alreadyMember: false,
        workspace: invitation.workspace,
        member,
      });
    } catch (error) {
      if (error?.httpStatus === 400) {
        return res.status(400).json(INVALID_INVITE);
      }

      // Two codes redeemed at once by the same user: the unique
      // (userId, workspaceId) constraint wins and we just open the room.
      if (error?.code === "P2002") {
        return res.status(200).json({
          message: "You are already a member of this workspace.",
          alreadyMember: true,
          workspace: invitation.workspace,
        });
      }

      throw error;
    }
  } catch (error) {
    console.error("joinWorkspaceWithCode failed:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * POST /workspaces/:id/invitations  (admin)
 * Body: { maxUses?: number, expiresAt?: ISO string }
 * No options = the permanent workshop key.
 */
export const createInvitation = async (req, res) => {
  try {
    const { maxUses, expiresAt } = req.body ?? {};

    if (
      maxUses !== undefined &&
      maxUses !== null &&
      (!Number.isInteger(maxUses) || maxUses <= 0)
    ) {
      return res
        .status(400)
        .json({ message: "maxUses must be a positive integer." });
    }

    let parsedExpiry = null;
    if (expiresAt) {
      parsedExpiry = new Date(expiresAt);
      if (Number.isNaN(parsedExpiry.getTime())) {
        return res
          .status(400)
          .json({ message: "expiresAt is not a valid date." });
      }
    }

    const invitation = await createUniqueInvitation({
      workspaceId: req.workspace.id,
      createdById: req.user.userId,
      maxUses: maxUses ?? null,
      expiresAt: parsedExpiry,
    });

    return res.status(201).json({
      message: "Workspace key created.",
      invitation,
    });
  } catch (error) {
    console.error("createInvitation failed:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * GET /workspaces/:id/invitations  (admin)
 */
export const listInvitations = async (req, res) => {
  try {
    const invitations = await prisma.workspaceInvitation.findMany({
      where: { workspaceId: req.workspace.id },
      orderBy: { createdAt: "desc" },
      select: INVITATION_FIELDS,
    });

    return res.status(200).json({
      count: invitations.length,
      invitations,
    });
  } catch (error) {
    console.error("listInvitations failed:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * PATCH /workspaces/:id/invitations/:invitationId  (admin)
 * Body: { isActive?: boolean, expiresAt?: ISO string | null }
 */
export const updateInvitation = async (req, res) => {
  try {
    const invitationId = Number(req.params.invitationId);

    if (!Number.isInteger(invitationId) || invitationId <= 0) {
      return res.status(400).json({ message: "Invalid invitation id." });
    }

    const { isActive, expiresAt } = req.body ?? {};
    const data = {};

    if (typeof isActive === "boolean") data.isActive = isActive;

    if (expiresAt === null) {
      data.expiresAt = null;
    } else if (expiresAt !== undefined) {
      const parsedExpiry = new Date(expiresAt);
      if (Number.isNaN(parsedExpiry.getTime())) {
        return res
          .status(400)
          .json({ message: "expiresAt is not a valid date." });
      }
      data.expiresAt = parsedExpiry;
    }

    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ message: "Nothing to update: send isActive or expiresAt." });
    }

    const result = await prisma.workspaceInvitation.updateMany({
      where: { id: invitationId, workspaceId: req.workspace.id },
      data,
    });

    if (result.count === 0) {
      return res.status(404).json({ message: "Invitation not found." });
    }

    const invitation = await prisma.workspaceInvitation.findUnique({
      where: { id: invitationId },
      select: INVITATION_FIELDS,
    });

    return res.status(200).json({
      message:
        data.isActive === false
          ? "Workspace key revoked."
          : "Workspace key updated.",
      invitation,
    });
  } catch (error) {
    console.error("updateInvitation failed:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
