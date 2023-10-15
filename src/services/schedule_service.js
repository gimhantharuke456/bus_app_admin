// ScheduleService.js

import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

class ScheduleService {
  static instance = null;

  static getInstance() {
    if (!ScheduleService.instance) {
      ScheduleService.instance = new ScheduleService();
    }
    return ScheduleService.instance;
  }

  async createSchedule(data) {
    try {
      const schedulesCollection = doc(db, "schedules", data.busId);
      const docRef = await setDoc(schedulesCollection, data);
    } catch (error) {
      throw error;
    }
  }

  async getSchedules() {
    try {
      const schedulesCollection = collection(db, "schedules");
      const querySnapshot = await getDocs(schedulesCollection);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  }

  async getScheduleById(scheduleId) {
    try {
      const scheduleDoc = doc(db, "schedules", scheduleId);
      const scheduleSnapshot = await getDoc(scheduleDoc);
      return scheduleSnapshot.exists()
        ? { id: scheduleId, ...scheduleSnapshot.data() }
        : null;
    } catch (error) {
      throw error;
    }
  }

  async updateSchedule(scheduleId, data) {
    try {
      const scheduleDoc = doc(db, "schedules", scheduleId);
      await updateDoc(scheduleDoc, data);
    } catch (error) {
      throw error;
    }
  }

  async deleteSchedule(scheduleId) {
    try {
      const scheduleDoc = doc(db, "schedules", scheduleId);
      await deleteDoc(scheduleDoc);
    } catch (error) {
      throw error;
    }
  }
}

export default ScheduleService;
