import { Router } from "express";
import { peopleController } from "./people.controller";
import { verifyToken } from "./../../middleware/verifyToken";

const router = Router();

router.get('/search', peopleController.searchUser);
router.post('/follow',verifyToken ,peopleController.followUser); // Add this

export const peopleRouter = router;