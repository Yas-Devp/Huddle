import jwt from "jsonwebtoken";
import { parseCookie } from "cookie";


export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    //401: Unauthorized: the caller is not authenticated
    //403: Forbidden: the caller is authenticated but not allowed to access the resource
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const socketAuth = (io) => {
  io.use((socket, next) => {
    try {
      const cookies = parseCookie(socket.handshake.headers.cookie ?? "");
      const token = cookies.access_token;
      if (!token) return next(new Error("UNAUTHORIZED"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.userId = decoded.userId;
      socket.data.role = decoded.role;
      next();
    } catch {
      next(new Error("UNAUTHORIZED"));
    }
  });
};
