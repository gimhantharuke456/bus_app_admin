import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

class BusService {
  static instance = null;

  static getInstance() {
    if (!BusService.instance) {
      BusService.instance = new BusService();
    }
    return BusService.instance;
  }

  async createBus(data) {
    try {
      const busesCollection = collection(db, "buses");
      const docRef = await addDoc(busesCollection, data);
      return docRef.id; // Return the ID of the newly created bus
    } catch (error) {
      throw error;
    }
  }

  async getBuses() {
    try {
      const busesCollection = collection(db, "buses");
      const querySnapshot = await getDocs(busesCollection);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  }

  async getActiveBuses() {
    try {
      const busesCollection = collection(db, "buses");
      const q = query(busesCollection, where("status", "==", "On Road"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  }

  async getBusById(busId) {
    try {
      const busDoc = doc(db, "buses", busId);
      const busSnapshot = await getDoc(busDoc);
      return busSnapshot.exists() ? { id: busId, ...busSnapshot.data() } : null;
    } catch (error) {
      throw error;
    }
  }

  async updateBus(busId, data) {
    try {
      const busDoc = doc(db, "buses", busId);
      await updateDoc(busDoc, data);
    } catch (error) {
      throw error;
    }
  }

  async deleteBus(busId) {
    try {
      const busDoc = doc(db, "buses", busId);
      await deleteDoc(busDoc);
    } catch (error) {
      throw error;
    }
  }
}

export default BusService;
