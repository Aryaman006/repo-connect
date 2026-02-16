import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = { 
    apiKey: "AIzaSyDcZmBpk0aYXlMJs15QuIdEzoiKRYBwIDM", 
    authDomain: "opd-sure.firebaseapp.com", 
    projectId: "opd-sure", 
    storageBucket: "opd-sure.appspot.com", 
    messagingSenderId: "830840011069", 
    appId: "1:830840011069:web:1277fb540e80cc0d16ed54", 
    measurementId: "G-509KCD3EPE"
}; 

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
  
const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      return { user, token };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export { auth, signInWithGoogle };