import { Router } from "express";
import { exploreController } from "./explore.controller";

const router = Router();

router.get('/', exploreController.exploreAllPrompt);

export  const exploreRouter = router;