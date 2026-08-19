import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { app, isFirebaseConfigured } from './firebase';
import { savePushToken } from './firestoreUsers';

/**
 * Web push notifications, via Firebase Cloud Messaging.
 *
 * Needs a VAPID key (a real per-project credential, generated once in the
 * Firebase Console under Project Settings -> Cloud Messaging -> Web
 * configuration — not something this code can create for you) set as
 * VITE_FIREBASE_VAPID_KEY. Without it, enablePushNotifications() fails
 * with a clear message instead of a confusing browser-level error.
 */
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

export interface EnablePushResult {
  success: boolean;
  message?: string;
}

export async function enablePushNotifications(uid: string): Promise<EnablePushResult> {
  if (!isFirebaseConfigured || !app) {
    return { success: false, message: 'Push notifications need Firebase to be configured first.' };
  }
  if (!VAPID_KEY) {
    return { success: false, message: 'Push notifications aren\'t set up yet on this deployment.' };
  }
  if (!('serviceWorker' in navigator) || !(await isSupported().catch(() => false))) {
    return { success: false, message: 'This browser doesn\'t support push notifications.' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, message: 'Notification permission was not granted.' };
    }

    // The service worker file is static (public/) and can't read
    // import.meta.env, so the (non-secret) Firebase config is passed as
    // query params on its URL instead — see the comment in the SW itself.
    const swParams = new URLSearchParams({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    });
    const registration = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${swParams.toString()}`);

    const messaging = getMessaging(app);
    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
    if (!token) {
      return { success: false, message: 'Could not get a notification token. Try again.' };
    }

    await savePushToken(uid, token);
    return { success: true };
  } catch (err) {
    console.warn('[Artiva Push] Failed to enable push notifications:', err);
    return { success: false, message: 'Something went wrong turning on notifications.' };
  }
}

/** Foreground messages (app tab open and focused) don't trigger the service
 * worker's background handler — this is the counterpart for that case. */
export function listenForForegroundMessages(onReceived: (title: string, body: string) => void): () => void {
  if (!isFirebaseConfigured || !app) return () => {};

  const messaging = getMessaging(app);
  return onMessage(messaging, (payload) => {
    onReceived(payload.notification?.title || 'Artiva', payload.notification?.body || '');
  });
}
