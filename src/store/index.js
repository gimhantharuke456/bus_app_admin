import { proxy } from "valtio";

const state = proxy({
  travellers: [],
  buses: [],
  users: [],
  drivers: [],
  routes: [],
  busShedules: [],
  isLoading: false,
  selectedItem: null,
  activeIndex: 1,
});

export default state;
