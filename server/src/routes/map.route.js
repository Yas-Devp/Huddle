import express from "express";
import { getMaps } from "../controllers/map.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.get("/", verifyToken, getMaps);

export default router;
