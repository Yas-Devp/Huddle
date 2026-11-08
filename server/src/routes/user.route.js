import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "User route is working" });
});

export default router;
