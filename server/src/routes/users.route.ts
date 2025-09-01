import express from "express";
import { userController } from "../controllers/user.controller.ts";
import type { Router } from "express";

const router: Router = express.Router();

router.get("/", userController);

export default router;
