import { Router } from "express";
import { promptController, upload } from "./prompt.controller";


const router = Router();


router.post('/create-prompt', upload.single("image"), promptController.promptImageUpload);



export const promptRouter = router;