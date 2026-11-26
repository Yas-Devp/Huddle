import "dotenv/config";
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import { socketHandler } from "./sockets/socketHandler.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

//attach Socket.io to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true //for HttpOnly cookies
  }
});

socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Socket.io is ready for connections`);
});