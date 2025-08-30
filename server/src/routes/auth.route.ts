import express from "express";
import type { Router } from "express";
import {
  forgotPasswordController,
  oauthCallback,
  signinController,
  signupController,
  resetPasswordController,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.ts";
import {
  authenticateGoogle,
  authenticateGoogleCallback,
  protectRoute,
} from "../middleware/auth.middleware.ts";
import {
  forgotPasswordValidator,
  resetPasswordValidator,
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
router.post("/reset-password", resetPasswordValidator, resetPasswordController);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;
