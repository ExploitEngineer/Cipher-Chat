import express from "express";
import type { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.ts";
import {
  getMessages,
  sendMessage,
} from "../controllers/messages.controller.ts";

const router: Router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
