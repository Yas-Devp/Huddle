import { prisma } from "../lib/prisma.js";
import { createUniqueInvitation } from "../lib/invitations.js";

const MEMBER_PUBLIC_FIELDS = {
  id: true,
  role: true,
  posX: true,
  posY: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      nom: true,
      prenom: true,
    },
  },
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

export const getWorkspaces = async (req, res) => {
  try {
    const userId = req.user.userId;

    const memberships = await prisma.member.findMany({
      where: { userId: userId },
      include: {
        workspace: {
          include: {
            map: true,
          },
        },
      },
    });

    const workspaces = memberships.map((m) => m.workspace);

    return res.status(200).json({
      count: workspaces.length,
      workspaces,
    });
  } catch (error) {
    console.error("An error occurred while fetching workspaces:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const createWorkspace = async (req, res) => {
  try {
    const { nom, description, mapId } = req.body;
    const userId = req.user.userId;

    if (!nom || !mapId) {
      return res.status(400).json({ message: "Name and mapId are required." });
    }

    const mapExists = await prisma.workspaceMap.findUnique({
      where: { id: parseInt(mapId) },
    });
    if (!mapExists) {
      return res
        .status(404)
        .json({ message: "The specified map does not exist." });
    }

    // The workspace, its admin membership and its first key are one unit:
    // a workspace without a key would be unreachable by anyone else.
    const { workspace, invitation } = await prisma.$transaction(async (tx) => {
      const createdWorkspace = await tx.workspace.create({
        data: {
          nom: nom,
          description: description,
          ownerId: userId,
          mapId: parseInt(mapId),
          members: {
            create: {
              userId: userId,
              role: "admin",
              posX: 400,
              posY: 300,
            },
          },
        },
      });

      const createdInvitation = await createUniqueInvitation(
        {
          workspaceId: createdWorkspace.id,
          createdById: userId,
        },
        tx,
      );

      return { workspace: createdWorkspace, invitation: createdInvitation };
    });

    return res.status(201).json({
      message: "Workspace created successfully.",
      workspace,
      invitation,
    });
  } catch (error) {
    console.error("Error occurred while creating the workspace:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * GET /workspaces/:id  (member only)
 *
 * Everything the workspace screen needs in one call. The key is only included
 * for admins: regular members can enter without being able to hand it out.
 */
export const getWorkspaceById = async (req, res) => {
  try {
    const { workspace, membership } = req;
    const isAdmin =
      membership.role === "admin" || workspace.ownerId === req.user.userId;

    const [members, invitation] = await Promise.all([
      prisma.member.findMany({
        where: { workspaceId: workspace.id },
        orderBy: [{ role: "asc" }, { createdAt: "asc" }],
        select: MEMBER_PUBLIC_FIELDS,
      }),
      isAdmin
        ? prisma.workspaceInvitation.findFirst({
            where: { workspaceId: workspace.id, isActive: true },
            orderBy: { createdAt: "desc" },
            select: INVITATION_FIELDS,
          })
        : Promise.resolve(null),
    ]);

    return res.status(200).json({
      workspace: {
        id: workspace.id,
        nom: workspace.nom,
        description: workspace.description,
        ownerId: workspace.ownerId,
        mapId: workspace.mapId,
        createdAt: workspace.createdAt,
        map: workspace.map,
      },
      membership: {
        id: membership.id,
        role: membership.role,
        posX: membership.posX,
        posY: membership.posY,
      },
      members,
      invitation,
    });
  } catch (error) {
    console.error("Error occurred while fetching the workspace:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
