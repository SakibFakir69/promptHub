import { Router } from "express";
import { authController } from "./auth.controller";
import { verifyToken } from "../../middleware/verifyToken";
import passport from "passport";





const router = Router();



router.post('/login-user',authController.loginUser);
router.post('/reset-password',verifyToken, authController.ResetPassword);
router.post('/change-password', verifyToken, authController.changePassword);

// google

router.get('/auth/google', passport.authenticate('google',{scope:['profile']}))


export const AuthRouter = router;