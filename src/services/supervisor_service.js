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

class SupervisorService {
  static instance = null;

  static getInstance() {
    if (!SupervisorService.instance) {
      SupervisorService.instance = new SupervisorService();
    }
    return SupervisorService.instance;
  }

  async createSupervisor(data) {
    try {
      const supervisorsCollection = collection(db, "supervisors");
      const docRef = await addDoc(supervisorsCollection, data);
      return docRef.id; // Return the ID of the newly created supervisor
    } catch (error) {
      throw error;
    }
  }

  async getSupervisors() {
    try {
      const supervisorsCollection = collection(db, "supervisors");
      const querySnapshot = await getDocs(supervisorsCollection);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  }

  async getSupervisorById(supervisorId) {
    try {
      const supervisorDoc = doc(db, "supervisors", supervisorId);
      const supervisorSnapshot = await getDoc(supervisorDoc);
      return supervisorSnapshot.exists()
        ? { id: supervisorId, ...supervisorSnapshot.data() }
        : null;
    } catch (error) {
      throw error;
    }
  }

  async updateSupervisor(supervisorId, data) {
    try {
      const supervisorDoc = doc(db, "supervisors", supervisorId);
      await updateDoc(supervisorDoc, data);
    } catch (error) {
      throw error;
    }
  }

  async deleteSupervisor(supervisorId) {
    try {
      const supervisorDoc = doc(db, "supervisors", supervisorId);
      await deleteDoc(supervisorDoc);
    } catch (error) {
      throw error;
    }
  }
}

export default SupervisorService;
