
import { Router } from 'express';
import { registerToken, unregisterToken } from './notification.controller';
import { verifyToken } from "../../middleware/verifyToken";

const router = Router();

router.post('/register-token', verifyToken, registerToken);
router.post('/unregister-token', verifyToken, unregisterToken);

export const notificationRouter= router;