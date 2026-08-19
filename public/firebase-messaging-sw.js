/**
 * Firebase Cloud Messaging background service worker.
 *
 * Handles push notifications when the app isn't the focused tab (foreground
 * messages are handled directly in src/lib/push.ts instead). Vite doesn't
 * bundle this file — it's served as-is from the public/ root, so it can't
 * read import.meta.env like the rest of the app. The Firebase config values
 * here aren't secrets (they're the same ones already visible in the app's
 * built JS bundle), so lib/push.ts passes them as query params when
 * registering this worker, and this file reads them back from its own URL.
 */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const params = new URLSearchParams(self.location.search);

firebase.initializeApp({
  apiKey: params.get('apiKey'),
  authDomain: params.get('authDomain'),
  projectId: params.get('projectId'),
  storageBucket: params.get('storageBucket'),
  messagingSenderId: params.get('messagingSenderId'),
  appId: params.get('appId'),
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Artiva';
  const body = payload.notification?.body || '';
  self.registration.showNotification(title, { body });
});
