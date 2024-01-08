// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    onAuthStateChanged,
    User
} from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCduK1f4BrFYfm2P3u2ncw8vtff95lvs0U",
    authDomain: "vidshare-c0530.firebaseapp.com",
    projectId: "vidshare-c0530",
    appId: "1:757522231876:web:3575607fccce2831644211",
    measurementId: "G-MZL60Q8Y8N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

/**
 * Signs the user in with Google
 * @returns {Promise<User>} A promise that resolves to a User object
 */
export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    return res.user;
}

/**
 * Signs the user out
 * @returns {Promise<void>} A promise that resolves to void
 */
export const signOut = async () => {
    await auth.signOut();
}

/**
 * Trigger callback when user auth state changes
 * @returns A function that unsubscribes from the auth state change
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
}