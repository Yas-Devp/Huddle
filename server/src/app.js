import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import { prisma } from "./lib/prisma.js";
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

app.get("/", async (req, res, next) => {
  try {
    const data = await prisma.member.findMany({
      select: {
        id: true,
        posX: true,
        posY: true,
        role: true,
        workspace: {
          select: {
            nom: true,
            description: true,
            mapId: true,
          },
        },
        user: {
          select: {
            nom: true,
            prenom: true,
            email: true,
          },
        },
      },
    });

    if (data.length === 0) {
      return res.status(404).json({ message: "No members found" });
    }

    res.json({ message: "Express API is running", data });
  } catch (err) {
    next(err);
  }
});

app.use("/api/users", userRoutes);

export default app;
