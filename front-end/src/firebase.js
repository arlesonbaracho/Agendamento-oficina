// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Se for usar autenticação
import { getFirestore } from 'firebase/firestore'; // Se for usar Firestore
import { getStorage } from 'firebase/storage'; // Se for usar Storage

const firebaseConfig = {
  apiKey: "AIzaSyCiQBm8l20jUl-AFyfs9E03ewyM2XBKvUs",
  authDomain: "oficina-ad.firebaseapp.com",
  projectId: "oficina-ad",
  storageBucket: "oficina-ad.firebasestorage.app",
  messagingSenderId: "168468335166",
  appId: "1:168468335166:web:5a362b771161522f391f6f",
  measurementId: "G-Z136HE6V7J"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporte os serviços que for usar
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default auth;