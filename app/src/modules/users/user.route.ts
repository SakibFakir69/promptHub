import { Router } from "express";
import { userController } from "./user.controller";


// crud
// update user
// get user
// delete user
const router = Router();


router.post('/create-user',userController.createUser )
// delete update


export const userRouter = router;
