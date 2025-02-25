import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.get("/one-time-string", AuthController.generateOneTimeString);
authRouter.post("/", AuthController.auth);
