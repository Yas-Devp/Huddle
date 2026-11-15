import express from "express";
import { register } from "../controller/register.controller.js";
import { login } from "../controller/login.controller.js";
import { logout } from "../controller/logout.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", verifyToken, async (req, res) => {
  const user_req = req.user;

  const user = await prisma.user.findUnique({
    where: { id: user_req.userId },
    select: {
      id: true,
      email: true,
      nom: true,
      prenom: true,
      telephone: true,
      role: true,
    },
  });

  res.status(200).json({
    message: "Vous êtes authentifié !",
    user: user,
  });
});

export default router;
