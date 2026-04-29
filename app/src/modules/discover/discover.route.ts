
import { Router } from "express";
import { discoverController } from "./discover.controller";


const router = Router();

router.get('/',  discoverController.discoverPeople);


export const discoverRouter = router;