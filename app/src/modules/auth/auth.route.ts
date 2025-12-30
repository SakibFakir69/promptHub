import { Router } from "express";
import { authController } from "./auth.controller";
import { verifyToken } from "../../middleware/verifyToken";
import passport from "passport";


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints (login, logout, password management, Google OAuth, user info)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "64f8c123456789abcdef1234"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         photo:
 *           type: string
 *           format: uri
 *           nullable: true
 *         avatar:
 *           type: string
 *           nullable: true
 *         bio:
 *           type: string
 *           nullable: true
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           nullable: true
 *         totalPost:
 *           type: number
 *           example: 42
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         follower:
 *           type: array
 *           items:
 *             type: string
 *         following:
 *           type: array
 *           items:
 *             type: string
 *         isBlock:
 *           type: boolean
 *           example: false
 *         isDelete:
 *           type: boolean
 *           example: false
 *         isVerify:
 *           type: boolean
 *           example: true
 *         isLoggedIn:
 *           type: boolean
 *           example: true
 *     AuthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/User'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current authenticated user details
 *     description: Returns the full profile of the currently logged-in user. Requires valid access token (cookie or bearer).
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/me', verifyToken, authController.getMe);

/**
 * @swagger
 * /api/v1/auth/login-user:
 *   post:
 *     tags: [Auth]
 *     summary: Login user and set authentication cookies
 *     description: Authenticates user with email and password, sets httpOnly cookies (accessToken & refreshToken).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, cookies set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login-user', authController.loginUser);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Change current user's password
 *     description: Allows authenticated user to change their password by providing old and new password.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - newPassword
 *             properties:
 *               password:
 *                 type: string
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: true }
 *                 message: { type: string, example: "Password changed successfully" }
 *       400:
 *         description: Validation failed or current password incorrect
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/change-password', verifyToken, authController.changePassword);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password (for logged-in users)
 *     description: Resets password for the currently authenticated user. Typically used when user forgot password but is already logged in (e.g., via recovery flow).
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid password format
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/reset-password', verifyToken, authController.ResetPassword);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     description: Uses refresh token (from cookie) to generate a new access token.
 *     responses:
 *       201:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Refresh token missing, expired, or invalid
 *       500:
 *         description: Server error
 */
router.post('/refresh', authController.refreshToken);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     description: Clears authentication cookies (accessToken & refreshToken).
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: true }
 *                 message: { type: string, example: "User logged out successfully" }
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.post('/logout', authController.logOutUser); // ← Fixed: was wrongly pointing to loginUser

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Initiate Google OAuth login
 *     description: Redirects to Google for authentication.
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Google OAuth callback
 *     description: Handles Google OAuth response. On success, redirects to dashboard. On failure, redirects to homepage.
 *     responses:
 *       302:
 *         description: Redirect to /dashboard (success) or / (failure)
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  
);

/**
 * @swagger
 * /api/v1/auth/dashboard:
 *   get:
 *     tags: [Auth]
 *     summary: Render dashboard (for testing OAuth flow)
 *     description: Protected route that renders dashboard with user data (development only).
 *     responses:
 *       200:
 *         description: Dashboard rendered
 *       302:
 *         description: Redirect to login if not authenticated
 */


export const AuthRouter = router;