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
import BusService from "./bus_service";

export const getTickets = async () => {
  let t = [];
  const bueses = await BusService.getInstance().getActiveBuses();
  for (var bus of bueses) {
    const scheduleDoc = doc(db, "schedules", bus.id);
    const schedule = await getDoc(scheduleDoc);
    const q = query(collection(db, "tickets"), where("busId", "==", bus.id));
    let tickets = await getDocs(q);
    for (var data of tickets.docs) {
      t.push({ id: data.id, ...data.data(), ...bus });
    }
    t = t.filter(
      (ticket) => ticket.cretedAt.split(" ")[0] == schedule.data().date
    );
  }
  return t;
};
