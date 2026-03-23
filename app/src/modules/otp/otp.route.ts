import { Router } from 'express';
import { otpController } from './otp.controller';
import { verifyToken } from '../../middleware/verifyToken';

const router = Router();

/**
 * @openapi
 * /otp/send-otp:
 *   post:
 *     tags:
 *       - OTP
 *     summary: Send an OTP to the authenticated user's email
 *     description: The user must be authenticated via cookies.
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     user_name:
 *                       type: string
 *                     otp:
 *                       type: string
 *                     time:
 *                       type: number
 *       400:
 *         description: Email or username missing
 *       429:
 *         description: OTP already sent, wait before requesting another
 *       401:
 *         description: Not authenticated (cookie missing or invalid)
 *       500:
 *         description: Server error
 */
router.post('/send-otp', verifyToken, otpController.sendOtp);



/**
 * @openapi
 * /otp/verify-otp:
 *   post:
 *     tags:
 *       - OTP
 *     summary: Verify OTP sent to the authenticated user's email
 *     description: The user must be authenticated via cookies.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation failed or invalid/expired OTP
 *       401:
 *         description: Not authenticated (cookie missing or invalid)
 *       500:
 *         description: Server error
 */

router.post('/verify-otp', verifyToken, otpController.verifyOtp);

router.post('/user-verify',verifyToken, otpController.isVerifyUser);
router.post('/resend-otp', verifyToken,otpController.resendOtp);

export const otpRouter = router;
