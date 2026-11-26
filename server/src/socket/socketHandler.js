import { prisma } from "../lib/prisma.js";

const players = {};

export const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("[*] Client connected:", socket.id);

        // 1. Player joins a workspace
        socket.on("joinWorkspace", async ({ workspaceId, userId, userName }) => {
            socket.join(`workspace_${workspaceId}`);
            
            players[socket.id] = {
                id: socket.id,
                userId: userId,
                userName: userName,
                workspaceId: workspaceId,
                x: 400,
                y: 300,
                anim: "idle-down"
            };

            const roomPlayers = Object.values(players).filter(p => p.workspaceId === workspaceId);
            socket.emit("currentPlayers", roomPlayers);
            socket.to(`workspace_${workspaceId}`).emit("newPlayer", players[socket.id]);
        });

        // 2. Player moves
        socket.on("playerMovement", (movementData) => {
            if (players[socket.id]) {
                players[socket.id].x = movementData.x;
                players[socket.id].y = movementData.y;
                players[socket.id].anim = movementData.anim;

                socket.to(`workspace_${players[socket.id].workspaceId}`).emit("playerMoved", players[socket.id]);
            }
        });

        // 3. Player disconnects
        socket.on("disconnect", async () => {
            console.log("[*] Client disconnected:", socket.id);
            
            if (players[socket.id]) {
                const { userId, workspaceId, x, y } = players[socket.id];
                
                try {
                    await prisma.member.updateMany({
                        where: { userId: userId, workspaceId: workspaceId },
                        data: { posX: x, posY: y }
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