import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDJce1jOka9nlJQVjbEtkg8KXt9QlaGqQ8",
    authDomain: "profit-b34ac.firebaseapp.com",
    projectId: "profit-b34ac",
    storageBucket: "profit-b34ac.firebasestorage.app",
    messagingSenderId: "104225179790",
    appId: "1:104225179790:android:c6bde62ae9df006d7ae1df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth };
