
import { Router } from 'express';
import { registerToken, unregisterToken } from './notification.controller';
import { verifyToken } from "../../middleware/verifyToken";
import { notifyUser } from './notification.service';

const router = Router();

router.post('/register-token', verifyToken, registerToken);
router.post('/unregister-token', verifyToken, unregisterToken);

router.post("/test-push", verifyToken, async (req, res) => {

    if(!req.user.id)
    {
        return res.status(404).json({
            success:false,
            message:"failed to re4ach"
        })
    }

  const userId = req?.user.id;

  await notifyUser(userId, {
    title: "🎉 Test Notification",
    body: "This is a test notification from PromptHub!",
    data: {
      url: "/dashboard",
    },
  });

  res.json({ success: true });
});


export const notificationRouter= router;