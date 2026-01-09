import { Router } from "express";
import { feedController } from "./feed.controller";

const router = Router();

router.get('/feed', feedController.feed);


export const feedRouter = router;