import express from "express";
import type { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.ts";
import { getUsersForSidebar } from "../controllers/user.controller.ts";

const router: Router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);

export default router;
