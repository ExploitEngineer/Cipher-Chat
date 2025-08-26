import express from "express";
import type { Router } from "express";
import {
  oauthCallback,
  signinController,
  signupController,
} from "../controllers/auth.controller.ts";
import {
  authenticateGoogle,
  authenticateGoogleCallback,
} from "../middleware/auth.middleware.ts";
import {
  signInValidator,
  signUpValidator,
} from "../middleware/auth.validator.ts";

const router: Router = express.Router();

router.post("/signup", signUpValidator, signupController);
router.get("/google", authenticateGoogle);
router.get("/google/callback", authenticateGoogleCallback, oauthCallback);
router.post("/signin", signInValidator, signinController);

export default router;
