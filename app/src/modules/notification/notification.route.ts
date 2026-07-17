
import { Router } from 'express';
import { registerToken, unregisterToken } from './notification.controller';
import { verifyToken } from "../../middleware/verifyToken";
import { notifyUser } from './notification.service';


const router = Router();


router.post('/register-token', verifyToken, registerToken);
router.post('/unregister-token', verifyToken, unregisterToken);

router.post("/test-push", verifyToken, async (req, res) => {
    
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  await notifyUser(req.user.id, {
    title: "🎉 Test Notification",
    body: "This is a test notification from PromptHub!",
    data: {
      url: "/dashboard",
    },
  });

  return res.json({ success: true });
});


export const notificationRouter= router;