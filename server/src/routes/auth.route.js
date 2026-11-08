import express from "express";
import { register } from "../controller/register.controller.js";
import { login } from "../controller/login.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Vous êtes authentifié !",
    user: req.user,
  });
});

export default router;
