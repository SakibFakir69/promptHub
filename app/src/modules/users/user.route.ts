import { Router } from "express";
import { userController } from "./user.controller";
import { verifyToken } from "../../middleware/verifyToken";


// crud
// update user
// get user
// delete user
const router = Router();

// create user
router.post('/create-user',userController.createUser )
// delete update
router.delete('/delete-user',verifyToken, userController.deleteUser);
// update user 
router.put('/update-user' , verifyToken, userController.updateUser);



export const userRouter = router;
