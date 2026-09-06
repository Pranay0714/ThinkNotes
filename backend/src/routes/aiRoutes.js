import express from "express";
import { enhanceNote } from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/enhance", protect, enhanceNote);

export default router;