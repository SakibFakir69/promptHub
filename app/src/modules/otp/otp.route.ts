import { Router } from "express";
import { otpController } from "./otp.controller";
import { verifyToken } from "../../middleware/verifyToken";



const router = Router();



router.post('/send-otp', verifyToken,otpController.sendOtp);
router.post('/verify-otp', verifyToken, otpController.verifyOtp);



export const  otpRouter = router;