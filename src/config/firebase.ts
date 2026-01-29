import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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
