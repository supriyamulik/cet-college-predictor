import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyDNYHDJUJ9Agvp7iXnsoLfu2u0gmyrxNro",
    authDomain: "cet-insights.firebaseapp.com",
    projectId: "cet-insights",
    storageBucket: "cet-insights.firebasestorage.app",
    messagingSenderId: "1034272895377",
    appId: "1:1034272895377:web:030782a92850ae70fb6a30",
    measurementId: "G-32NESGF1XT"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
