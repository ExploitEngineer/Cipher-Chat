import express from "express";
import type { Router } from "express";
import {
  forgotPasswordController,
  oauthCallback,
  signinController,
  signupController,
} from "../controllers/auth.controller.ts";
import {
  authenticateGoogle,
  authenticateGoogleCallback,
} from "../middleware/auth.middleware.ts";
import {
  forgotPasswordValidator,
  signInValidator,
  signUpValidator,
} from "../middleware/auth.validator.ts";

const router: Router = express.Router();

router.post("/signup", signUpValidator, signupController);
router.get("/google", authenticateGoogle);
router.get("/google/callback", authenticateGoogleCallback, oauthCallback);
router.post("/signin", signInValidator, signinController);
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  forgotPasswordController,
);

export default router;
