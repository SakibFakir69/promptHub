"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const verifyToken_1 = require("../../middleware/verifyToken");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /user/create-user:
 *   post:
 *     tags:
 *       - User
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: MyStrongPassword123
 *               googleId:
 *                 type: string
 *                 example: google123id
 *               photo:
 *                 type: string
 *                 example: https://example.com/photo.jpg
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post('/create-user', user_controller_1.userController.createUser);
/**
 * @openapi
 * /user/delete-user:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete logged-in user
 *     description: Deletes the currently authenticated user based on the token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User Deleted Successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
// delete update
router.delete('/delete-user', verifyToken_1.verifyToken, user_controller_1.userController.deleteUser);
/**
 * @openapi
 * /user/update-user:
 *   put:
 *     tags:
 *       - User
 *     summary: Update logged-in user information
 *     description: Updates user data (name, bio, photo, avatar, tags) for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               bio:
 *                 type: string
 *                 example: Web developer and tech enthusiast.
 *               photo:
 *                 type: string
 *                 example: https://example.com/photo.jpg
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar.png
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["developer", "javascript", "mern"]
 *     responses:
 *       200:
 *         description: User Data Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User Data Update Successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Zod Update Validation Error
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server Error
 */
// update user 
router.put('/update-user', verifyToken_1.verifyToken, user_controller_1.userController.updateUser);
exports.userRouter = router;
