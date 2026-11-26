import { prisma } from "../lib/prisma.js";

/**
 * Loads the caller's membership for the workspace in `req.params.id`.
 * Sets `req.membership` and `req.workspace` (with its map) when it exists.
 *
 * Every workspace-scoped route must go through this middleware: membership is
 * the durable authorization, the invitation code is only the way in.
 */
export const requireWorkspaceMember = async (req, res, next) => {
  try {
    const workspaceId = Number(req.params.id);

    if (!Number.isInteger(workspaceId) || workspaceId <= 0) {
      return res.status(400).json({ message: "Invalid workspace id." });
    }

    const membership = await prisma.member.findUnique({
      where: {
        userId_workspaceId: {
          userId: req.user.userId,
          workspaceId,
        },
      },
      include: {
        workspace: {
          include: { map: true },
        },
      },
    });

    if (!membership) {
      return res
        .status(403)
        .json({ message: "You do not have access to this workspace." });
    }

    req.membership = membership;
    req.workspace = membership.workspace;

    return next();
  } catch (error) {
    console.error("requireWorkspaceMember failed:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Must run after requireWorkspaceMember.
 * Admins are members with role "admin"; the workspace owner always counts.
 */
export const requireWorkspaceAdmin = (req, res, next) => {
  const isAdmin =
    req.membership?.role === "admin" ||
    req.workspace?.ownerId === req.user.userId;

  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "Only workspace admins can manage workspace keys." });
  }

  return next();
};
