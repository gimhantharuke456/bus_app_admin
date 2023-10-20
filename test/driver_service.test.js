import DriverService from "../src/services/driver_service";

test("updateDriver() should throw an error with a non-existent driver ID", async () => {
  const driverService = DriverService.getInstance();
  const driverId = "nonexistentid";
  const data = { name: "Jane Doe", age: 30 };
  await expect(driverService.updateDriver(driverId, data)).rejects.toThrow();
});

test("getDrivers() should return an empty array with no drivers in the database", async () => {
  const driverService = DriverService.getInstance();
  const drivers = await driverService.getDrivers();
  expect(drivers).toEqual([]);
});

test("createDriver() should create a new driver and return its ID", async () => {
  const driverService = DriverService.getInstance();
  const data = { name: "John Doe", age: 35 };
  const driverId = await driverService.createDriver(data);
  expect(typeof driverId).toBe("string");
});
