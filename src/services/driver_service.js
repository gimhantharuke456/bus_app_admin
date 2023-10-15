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

class DriverService {
  static instance = null;

  static getInstance() {
    if (!DriverService.instance) {
      DriverService.instance = new DriverService();
    }
    return DriverService.instance;
  }

  async createDriver(data) {
    try {
      const supervisorsCollection = collection(db, "drivers");
      const docRef = await addDoc(supervisorsCollection, data);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async getDrivers() {
    try {
      const supervisorsCollection = collection(db, "drivers");
      const querySnapshot = await getDocs(supervisorsCollection);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  }

  async getDriverById(supervisorId) {
    try {
      const supervisorDoc = doc(db, "drivers", supervisorId);
      const supervisorSnapshot = await getDoc(supervisorDoc);
      return supervisorSnapshot.exists()
        ? { id: supervisorId, ...supervisorSnapshot.data() }
        : null;
    } catch (error) {
      throw error;
    }
  }

  async updateDriver(supervisorId, data) {
    try {
      const supervisorDoc = doc(db, "drivers", supervisorId);
      await updateDoc(supervisorDoc, data);
    } catch (error) {
      throw error;
    }
  }

  async deleteDriver(supervisorId) {
    try {
      const supervisorDoc = doc(db, "drivers", supervisorId);
      await deleteDoc(supervisorDoc);
    } catch (error) {
      throw error;
    }
  }
}

export default DriverService;
