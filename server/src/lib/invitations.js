import { prisma } from "./prisma.js";
import { generateInviteCode } from "./inviteCode.js";

/**
 * Creates an invitation, retrying on the (very unlikely) unique-code
 * collision. Pass a transaction client to make it atomic with its caller.
 */
export async function createUniqueInvitation(
  { workspaceId, createdById, maxUses = null, expiresAt = null },
  client = prisma,
) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await client.workspaceInvitation.create({
        data: {
          code: generateInviteCode(),
          workspaceId,
          createdById,
          maxUses,
          expiresAt,
        },
      });
    } catch (error) {
      if (error?.code === "P2002") continue;
      throw error;
    }
  }

  throw new Error("Could not generate a unique invitation code.");
}
