import { fcmMessaging } from '../../config/firebase/firebase';
import { DeviceToken, Platform } from './notification.model';

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

// Codes that mean "this token is permanently dead, prune it"
const FCM_DEAD_TOKEN_CODES = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
]);

export async function registerDeviceToken(userId: string, token: string, platform: Platform) {
  return DeviceToken.findOneAndUpdate(
    { token },
    { user: userId, token, platform },
    { upsert: true, new: true }
  );
}

export async function removeDeviceToken(token: string, userId?: string) {
  const filter = userId ? { token, user: userId } : { token };
  return DeviceToken.deleteOne(filter);
}
// BEFORE SEND NOTIFICATION DECTED PLATFROM

async function sendExpoPush(token: string, payload: NotificationPayload) {
  const res = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: token,
      title: payload.title,
      body: payload.body,
      data: payload.data,
    }),
  });
  return res.json();
}

// just use send web push , token
// but which token need  , json token, or other - here confusion


async function sendWebPush(token: string, payload: NotificationPayload) {
  return fcmMessaging.send({
    token,
    notification: { title: payload.title, body: payload.body },
    data: payload.data,
  });
}

/**
 * Sends a notification to every device registered for a user, across both
 * platforms, and prunes tokens that are confirmed dead by either service.
 */
export async function notifyUser(userId: string, payload: NotificationPayload) {
  const tokens = await DeviceToken.find({ user: userId });
  if (tokens.length === 0) return [];

  const results = await Promise.allSettled(
    tokens.map((t) =>
      t.platform === 'expo' ? sendExpoPush(t.token, payload) : sendWebPush(t.token, payload)
    )
  );

  await Promise.all(
    results.map(async (result, i) => {
      const tokenDoc = tokens[i];

      if (result.status === 'rejected') {
        console.error(`Push failed for token ${tokenDoc.token}:`, result.reason);
        const errorCode = (result.reason as any)?.errorInfo?.code;
        if (errorCode && FCM_DEAD_TOKEN_CODES.has(errorCode)) {
          await DeviceToken.deleteOne({ _id: tokenDoc._id });
        }
        return;
      }

      if (tokenDoc.platform === 'expo') {
        const data = (result.value as any)?.data;
        const errorType = data?.details?.error;

        if (errorType === 'DeviceNotRegistered') {
          await DeviceToken.deleteOne({ _id: tokenDoc._id });
        } else if (data?.status === 'error') {
          // Not a dead token — rate limit, oversized payload, bad credentials.
          // Log distinctly so these don't get silently swallowed as "delivered".
          console.warn(`Expo push error (not pruned) for token ${tokenDoc.token}:`, errorType);
        }
        // NOTE: this is the ticket response, not a delivery receipt. Expo can still
        // report DeviceNotRegistered later via the receipts API. Fine for current
        // volume; revisit with /--/api/v2/push/getReceipts if dead tokens start
        // lingering.
      }
    })
  );

  return results;
}

export async function notifyMany(userIds: string[], payload: NotificationPayload) {
  // Fine at current scale. If this starts going out to hundreds of users at once,
  // switch the FCM side to messaging.sendEachForMulticast (500/batch) and run
  // this through a queue (BullMQ) instead of firing inline from a request handler.
  return Promise.allSettled(userIds.map((id) => notifyUser(id, payload)));
}