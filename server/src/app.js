import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.js";
import { prisma } from "./lib/prisma.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res, next) => {
  try {
    const data = await prisma.member.findMany({
      select: {
        id: true,
        posX: true,
        posY: true,
        role: true,
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
