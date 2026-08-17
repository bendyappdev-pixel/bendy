import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: 'AIzaSyDPDXpc7uCOGIwqmZbjIMiptS5Jl96WwcQ',
  authDomain: 'bendy-app.firebaseapp.com',
  projectId: 'bendy-app',
  storageBucket: 'bendy-app.firebasestorage.app',
  messagingSenderId: '25360975060',
  appId: '1:25360975060:web:f47b59b44261dec7c96741',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * Point Firestore at a local emulator instead of production.
 *
 * Set VITE_FIRESTORE_EMULATOR=127.0.0.1:8080 and run
 * `npx firebase emulators:start --only firestore` to exercise crowd reports
 * end to end — submitting, the security rules, and the live list updating —
 * without writing anything to the real database. Unset in every real build,
 * so production is untouched.
 */
const emulatorHost = import.meta.env.VITE_FIRESTORE_EMULATOR;
if (emulatorHost) {
  const [host, port] = String(emulatorHost).split(':');
  connectFirestoreEmulator(db, host, Number(port) || 8080);
  console.info(`[firebase] Firestore pointed at emulator ${host}:${port}`);
}

if (typeof window !== 'undefined') {
  // Enable App Check debug token in development
  if (import.meta.env.DEV) {
    // @ts-expect-error Firebase App Check debug token global
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  /**
   * App Check needs a reCAPTCHA site key. Constructing the provider with
   * `undefined` throws and takes the rest of this module's initialisation
   * with it, so skip it when no key is configured (local dev, emulator runs)
   * rather than failing hard. Production sets VITE_RECAPTCHA_SITE_KEY and is
   * unaffected — if that variable ever goes missing in a deployed build,
   * this warning is the thing to look for.
   */
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (recaptchaSiteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } else if (!emulatorHost) {
    console.warn(
      '[firebase] VITE_RECAPTCHA_SITE_KEY is not set — App Check is disabled. ' +
        'If App Check is enforced on this project, crowd reports will be rejected.'
    );
  }
}
