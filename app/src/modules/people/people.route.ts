import { Router } from "express";
import { peopleController } from "./people.controller";




const router = Router();

router.get('/', peopleController.searchUser);


export const peopleRouter = router;