import express from "express";
import type { Router } from "express";
import {
  oauthCallback,
  signupController,
} from "../controllers/auth.controller.ts";
import {
  authenticateGoogle,
  authenticateGoogleCallback,
} from "../middleware/auth.middleware.ts";

const router: Router = express.Router();

router.post("/signup", signupController);
router.get("/google", authenticateGoogle);
router.get("/google/callback", authenticateGoogleCallback, oauthCallback);

export default router;
