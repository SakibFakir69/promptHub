import { Router } from "express";
import { authController } from "./auth.controller";
import { verifyToken } from "../../middleware/verifyToken";





const router = Router();



router.post('/login-user',authController.loginUser);
router.post('/reset-password',verifyToken, authController.passwordChange);



export const AuthRouter = router;