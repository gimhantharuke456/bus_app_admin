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

class ReservationService {
  static instance = null;

  static getInstance() {
    if (!ReservationService.instance) {
      ReservationService.instance = new ReservationService();
    }
    return ReservationService.instance;
  }

  async createReservation(data) {
    try {
      const reservationsCollection = collection(db, "reservations");
      const docRef = await addDoc(reservationsCollection, data);
      return docRef.id; // Return the ID of the newly created route
    } catch (error) {
      throw error;
    }
  }

  async getBusReservations() {
    try {
      const reservationsCollection = collection(db, "reservations");
      const querySnapshot = await getDocs(reservationsCollection);
      return querySnapshot.docs.map((doc) => ({
        res_id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw error;
    }
  }
  async getBusReservationsByBusId(id) {
    try {
      const reservationsCollection = collection(db, "reservations");
      const q = query(reservationsCollection, where("busId", "==", id));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        res_id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw error;
    }
  }

  async getReservationById(routeId) {
    try {
      const routeDoc = doc(db, "reservations", routeId);
      const routeSnapshot = await getDoc(routeDoc);
      return routeSnapshot.exists()
        ? { id: routeId, ...routeSnapshot.data() }
        : null;
    } catch (error) {
      throw error;
    }
  }

  async updateReservation(routeId, data) {
    try {
      const routeDoc = doc(db, "reservations", routeId);
      await updateDoc(routeDoc, data);
    } catch (error) {
      throw error;
    }
  }

  async deleteReservation(routeId) {
    try {
      const routeDoc = doc(db, "reservations", routeId);
      await deleteDoc(routeDoc);
    } catch (error) {
      throw error;
    }
  }

  async isReservationNumberUnique(routeNumber) {
    try {
      const reservationsCollection = collection(db, "reservations");
      const q = query(
        reservationsCollection,
        where("routeNumber", "==", routeNumber)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      throw error;
    }
  }
}

export default ReservationService;
