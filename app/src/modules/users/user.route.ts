import { Router } from "express";
import { userController } from "./user.controller";
import { verifyToken } from "../../middleware/verifyToken";
import { authController } from "../auth/auth.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/users:
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
 *               - password
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
router.post("/", userController.createUser);

/**
 * @openapi
 * /api/v1/users/me:
 *   get:
 *     tags:
 *       - User
 *     summary: Get logged-in user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */


/**
 * @openapi
 * /api/v1/users:
 *   put:
 *     tags:
 *       - User
 *     summary: Update logged-in user information
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
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/", verifyToken, userController.updateUser);

/**
 * @openapi
 * /api/v1/users:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/", verifyToken, userController.deleteUser);

export const userRouter = router;