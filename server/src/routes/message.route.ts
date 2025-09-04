import express from "express";
import type { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.ts";
import {
  getMessages,
  sendMessage,
  editMessagesController,
  deleteMessageController,
} from "../controllers/messages.controller.ts";

const router: Router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.patch("/:id", protectRoute, editMessagesController);
router.post("/send/:id", protectRoute, sendMessage);
router.delete("/:id", protectRoute, deleteMessageController);

export default router;
