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

class RouteService {
  static instance = null;

  static getInstance() {
    if (!RouteService.instance) {
      RouteService.instance = new RouteService();
    }
    return RouteService.instance;
  }

  async createRoute(data) {
    try {
      const routesCollection = collection(db, "routes");
      const docRef = await addDoc(routesCollection, data);
      return docRef.id; // Return the ID of the newly created route
    } catch (error) {
      throw error;
    }
  }

  async getBusRoutes() {
    try {
      const routesCollection = collection(db, "routes");
      const querySnapshot = await getDocs(routesCollection);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  }
  async getBusRoutesByBusId(id) {
    try {
      const routesCollection = collection(db, "routes");
      const q = query(routesCollection, where("busId", "==", id));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  }

  async getRouteById(routeId) {
    try {
      const routeDoc = doc(db, "routes", routeId);
      const routeSnapshot = await getDoc(routeDoc);
      return routeSnapshot.exists()
        ? { id: routeId, ...routeSnapshot.data() }
        : null;
    } catch (error) {
      throw error;
    }
  }

  async updateRoute(routeId, data) {
    try {
      const routeDoc = doc(db, "routes", routeId);
      await updateDoc(routeDoc, data);
    } catch (error) {
      throw error;
    }
  }

  async deleteRoute(routeId) {
    try {
      const routeDoc = doc(db, "routes", routeId);
      await deleteDoc(routeDoc);
    } catch (error) {
      throw error;
    }
  }

  async isRouteNumberUnique(routeNumber) {
    try {
      const routesCollection = collection(db, "routes");
      const q = query(
        routesCollection,
        where("routeNumber", "==", routeNumber)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      throw error;
    }
  }
}

export default RouteService;
