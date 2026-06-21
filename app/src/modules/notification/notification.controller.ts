import { Request, Response } from 'express';
import { registerDeviceToken, removeDeviceToken } from './notification.service';

export interface AuthedRequest extends Omit<Request, "user"> {
  user?: { id: string };
}

export async function registerToken(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { token, platform } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (!token || !platform || !['web', 'expo'].includes(platform)) {
    return res.status(400).json({ success: false, message: 'Valid token and platform are required' });
  }

  const saved = await registerDeviceToken(userId, token, platform);
  return res.status(200).json({ success: true, data: saved });
}

export async function unregisterToken(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  const { token } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (!token) {
    return res.status(400).json({ success: false, message: 'token is required' });
  }

  // Scoped to the authenticated user so you can't unregister someone else's token
  await removeDeviceToken(token, userId);
  return res.status(200).json({ success: true });
}