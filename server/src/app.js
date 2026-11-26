import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import workspaceRoutes from "./routes/workspace.route.js";
import mapRoutes from "./routes/map.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//auth
app.use("/auth", authRoutes);
//workspace
app.use("/workspaces", workspaceRoutes);
//maps
app.use("/maps", mapRoutes);

app.use("/api/users", userRoutes);

// 404
app.use((req, res) => {
  return res.status(404).json({ message: "Not found." });
});

// Central error handler: never leak stack traces or query details.
app.use((error, req, res, next) => {
  console.error("Unhandled request error:", error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({ message: "Internal server error." });
});

export default app;
