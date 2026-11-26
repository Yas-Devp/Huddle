import { prisma } from "../lib/prisma.js";

export const getMaps = async (req, res) => {
  try {
    const maps = await prisma.workspaceMap.findMany();
    return res.status(200).json({
      count: maps.length,
      maps,
    });
  } catch (error) {
    console.error("An error occurred while fetching maps:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
