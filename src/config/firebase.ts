import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

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

// if (typeof window !== 'undefined') {
//   // Enable App Check debug token in development
//   if (import.meta.env.DEV) {
//     // @ts-expect-error Firebase App Check debug token global
//     self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
//   }
//
//   initializeAppCheck(app, {
//     provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
//     isTokenAutoRefreshEnabled: true,
//   });
// }
