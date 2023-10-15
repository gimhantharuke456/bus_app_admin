import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

class AuthService {
  static instance = null;

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async loginUser(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
    } catch (error) {
      throw Error(error);
    }
  }

  async signupUser(email, password) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  async createUser(data) {
    const uid = auth.currentUser.uid;
    try {
      if (uid) {
        const ref = doc(db, "users", uid);
        await setDoc(ref, data);
        localStorage.setItem("email", data.email);
      }
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUserData() {
    const uid = auth.currentUser.uid;
    try {
      const docRef = doc(db, "users", uid);
      const d = await getDoc(docRef);
      if (d.exists) {
        return d.data();
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateUser(data) {
    const uid = auth.currentUser.uid;
    try {
      const docRef = doc(db, "users", uid);
      await setDoc(docRef, data);
    } catch (error) {
      throw error;
    }
  }
  async signoutUser() {
    await auth.signOut();
  }
}

export default AuthService;
