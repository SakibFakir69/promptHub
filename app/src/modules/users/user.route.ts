import { Router } from "express";
import { userController } from "./user.controller";
import { verifyToken } from "../../middleware/verifyToken";



const router = Router();

// create user




/**
 * @openapi
 * /api/v1/user/create-user:
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       404:
 *         description: Not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Server error
 */

router.post('/create-user',userController.createUser )
// delete update
router.delete('/delete-user',verifyToken, userController.deleteUser);
// update user 
router.put('/update-user' , verifyToken, userController.updateUser);



export const userRouter = router;
