import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDxzs41AVueN2B010cUVg1WSKDr8s9EhI0",
  authDomain: "taskapp-5aac8.firebaseapp.com",
  projectId: "taskapp-5aac8",
  storageBucket: "taskapp-5aac8.firebasestorage.app",
  messagingSenderId: "353385649427",
  appId: "1:353385649427:web:2d2ff7b1025815f6b7f6e6",
  measurementId: "G-Y8FGRZYXSF"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
