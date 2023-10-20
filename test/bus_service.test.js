import BusService from "../src/services/bus_service";

test("createBus() should create a new bus and return its ID", async () => {
  const busService = BusService.getInstance();
  const data = { name: "Bus 1", status: "On Road" };
  const busId = await busService.createBus(data);
  expect(typeof busId).toBe("string");
});

test("getBuses() should return an empty array with no buses in the database", async () => {
  const busService = BusService.getInstance();
  const buses = await busService.getBuses();
  expect(buses).toEqual([]);
});

test("deleteBus() should throw an error with a non-existent bus ID", async () => {
  const busService = BusService.getInstance();
  const busId = "nonexistentid";
  await expect(busService.deleteBus(busId)).rejects.toThrow();
});
