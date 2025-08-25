import express from "express";
import { signupController } from "../controllers/signup.controller";
import type { Router } from "express";

const router: Router = express.Router();

router.post("/signup", signupController);

export default router;
