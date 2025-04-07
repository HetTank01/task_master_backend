import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { validateLogin, validateRegister } from "../middlewares/validate.js";

const router = Router()

const authController = new AuthController()

router.post("/register", validateRegister, authController.register)
router.post("/login", validateLogin, authController.login)

export default router