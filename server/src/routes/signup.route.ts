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
import { signUpValidator } from "../middleware/auth.validator.ts";

const router: Router = express.Router();

router.post("/signup", signUpValidator, signupController);
router.get("/google", authenticateGoogle);
router.get("/google/callback", authenticateGoogleCallback, oauthCallback);

export default router;
