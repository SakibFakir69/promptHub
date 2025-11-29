import { Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { verifyToken } from "../../middleware/verifyToken";
import passport from "passport";
import { User } from "../users/user.model";





const router = Router();

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get currently logged-in user details
 *     description: Returns the user information of the authenticated user. Authentication is via cookies.
 *     responses:
 *       200:
 *         description: Successfully retrieved user info
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
 *                   example: User login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     photo:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     totalPost:
 *                       type: number
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                     follower:
 *                       type: array
 *                       items:
 *                         type: string
 *                     following:
 *                       type: array
 *                       items:
 *                         type: string
 *                     isBlock:
 *                       type: boolean
 *                     isDelete:
 *                       type: boolean
 *                     isVerify:
 *                       type: boolean
 *                     isLoggedIn:
 *                       type: boolean
 *       401:
 *         description: Not authenticated (cookie missing or invalid)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.get('/me', verifyToken,authController.getMe);


/**
 * @openapi
 * /api/v1/auth/login-user:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a user and set authentication cookies
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
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: MyStrongPassword123
 *     responses:
 *       200:
 *         description: User logged in successfully, cookies set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid credentials or user not found
 *       500:
 *         description: Server error
 */


router.post('/login-user',authController.loginUser);





/**
 * @openapi
 * /api/v1/auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset the password for the authenticated user
 *     description: Allows an authenticated user to reset their password. Authentication is via cookies.
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
 *                 example: MyNewStrongPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *                   example: Password reset successfully
 *       400:
 *         description: Validation failed (invalid password format)
 *       401:
 *         description: Not authenticated (cookie missing or invalid)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */


router.post('/reset-password',verifyToken, authController.ResetPassword);

/**
 * @openapi
 * /api/v1/auth/change-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Change the password for the authenticated user
 *     description: Allows a logged-in user to change their password. Authentication is via cookies.
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
 *                 example: OldPassword123
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 example: NewPassword123
 *                 description: New password to replace the old one
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: Password changed successfully
 *       400:
 *         description: Validation failed (invalid password format)
 *       401:
 *         description: Not authenticated (cookie missing or invalid)
 *       404:
 *         description: User not found
 *       200:
 *         description: Current password does not match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Password not match
 *       500:
 *         description: Server error
 */

router.post('/change-password', verifyToken, authController.changePassword);


/**
 * @openapi
 * /api/v1/auth/refresh-token:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Refresh the access token using a valid refresh token cookie
 *     description: Returns a new access token if the user has a valid refresh token. Authentication is via cookies.
 *     responses:
 *       201:
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Refresh token missing or expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token expired
 *       403:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: You are not allowed to perform this action
 *       500:
 *         description: Server error
 */

router.post('/refresh',authController.refreshToken);




/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log out the authenticated user
 *     description: Clears the authentication cookies (`accessToken` and `refreshToken`) to log out the user. User must be authenticated via cookies.
 *     responses:
 *       200:
 *         description: User logged out successfully
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
 *                   example: User Log Out Successfully
 *       401:
 *         description: Not authenticated (cookie missing or invalid)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not authenticated
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User Not Founded
 *       500:
 *         description: Server error
 */


router.post('/logout',authController.loginUser )
// google


router.get('/google', passport.authenticate('google',{scope:['profile','email']}));
/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles Google OAuth callback.
 *       Redirects to /dashboard on success or / on failure.
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirect to dashboard on success OR redirect to homepage on failure.
 */
router.get('/google/callback', passport.authenticate("google",{
    failureRedirect:"/"
    // if failed to login gave route to redriect
}), (req:Request,res:Response)=>{
     res.redirect('/dashboard');

})

router.get('/dashboard', async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  const user = await User.findById(req.user);
  res.render('dashboard', { user });
});



export const AuthRouter = router;