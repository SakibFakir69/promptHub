import { Router } from 'express';
import { registerToken, unregisterToken } from './notification.controller';
// import { authMiddleware } from '../../middleware/auth'; // wire up to your existing auth guard

const router = Router();

router.post('/register-token', /* authMiddleware, */ registerToken);
router.post('/unregister-token', /* authMiddleware, */ unregisterToken);

export default router;