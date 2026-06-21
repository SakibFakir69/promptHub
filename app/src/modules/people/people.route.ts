import { Router } from "express";
import { peopleController } from "./people.controller";




const router = Router();

router.get('/search', peopleController.searchUser);


export const peopleRouter = router;