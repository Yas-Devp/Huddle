import { prisma } from "../lib/prisma.js";

const players = {};

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("[*] Client connected:", socket.id);

    //player joins a workspace
    socket.on("joinWorkspace", async ({ workspaceId }) => {
      const id = Number(workspaceId);

      const membership = await prisma.member.findUnique({
        where: {
          userId_workspaceId: { userId: socket.data.userId, workspaceId: id },
        },
        include: { user: true },
      });

      if (!membership) {
        socket.emit("joinError", { code: "FORBIDDEN" });
        return;
      }

      socket.join(`workspace_${id}`);

      players[socket.id] = {
        id: socket.id,
        userId: membership.userId,
        userName: `${membership.user.nom} ${membership.user.prenom}`,
        workspaceId: id,
        x: membership.posX,
        y: membership.posY,
        anim: "idle-down",
      };

      const roomPlayers = Object.values(players).filter(
        (p) => p.workspaceId === id,
      );

      socket.emit("currentPlayers", roomPlayers);
      socket.to(`workspace_${id}`).emit("newPlayer", players[socket.id]);
    });

    //player moves
    socket.on("playerMovement", (movementData) => {
      if (players[socket.id]) {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        players[socket.id].anim = movementData.anim;

        socket
          .to(`workspace_${players[socket.id].workspaceId}`)
          .emit("playerMoved", players[socket.id]);
      }
    });

    //player disconnects
    socket.on("disconnect", async () => {
      console.log("[*] Client disconnected:", socket.id);

      if (players[socket.id]) {
        const { userId, workspaceId, x, y } = players[socket.id];

        try {
          await prisma.member.updateMany({
            where: { userId: userId, workspaceId: workspaceId },
            data: { posX: x, posY: y },
          });
        } catch (error) {
          console.error("Failed to save player position:", error);
        }

        delete players[socket.id];
        io.to(`workspace_${workspaceId}`).emit("playerDisconnected", socket.id);
      }
    });
  });
};
