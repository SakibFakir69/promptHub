import { verifyToken } from "app/src/middleware/verifyToken";
import { Router } from "express";
import { discoverController } from "./discover.controller";


const router = Router();

router.get('/', verifyToken, discoverController.discoverPeople);


export const discoverRouter = router;