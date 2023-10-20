import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { usersCollection } from "../constants";
class UserService {
  static instance = null;

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async createUser(data) {
    try {
      const usersCollection = collection(db, "csseBusUsers");
      const docRef = await addDoc(usersCollection, data);
      return docRef.id; // Return the ID of the newly created user
    } catch (error) {
      throw error;
    }
  }

  async getUsers() {
    try {
      const usersCollection = collection(db, "csseBusUsers");
      const querySnapshot = await getDocs(usersCollection);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const userDoc = doc(db, "csseBusUsers", userId);
      const userSnapshot = await getDoc(userDoc);
      return userSnapshot.exists()
        ? { id: userId, ...userSnapshot.data() }
        : null;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, data) {
    try {
      const userDoc = doc(db, "csseBusUsers", userId);
      await updateDoc(userDoc, data);
    } catch (error) {
      throw error;
    }
  }
  async getTravellerById(userId) {
    try {
      const userDoc = doc(db, "csse_ticket_travellers", userId);
      const userSnapshot = await getDoc(userDoc);

      return userSnapshot.exists()
        ? { id: userId, ...userSnapshot.data() }
        : null;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const userDoc = doc(db, "csseBusUsers", userId);
      await deleteDoc(userDoc);
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
