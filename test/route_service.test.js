import RouteService from "../src/services/route_service";

test("isRouteNumberUnique() should return false with a non-unique route number", async () => {
  const routeService = RouteService.getInstance();
  const routeNumber = "101";
  const data = { routeNumber, busId: "bus1" };
  await routeService.createRoute(data);
  const isUnique = await routeService.isRouteNumberUnique(routeNumber);
  expect(isUnique).toBe(false);
});
test("getBusRoutes() should return an empty array with no routes in the database", async () => {
  const routeService = RouteService.getInstance();
  const routes = await routeService.getBusRoutes();
  expect(routes).toEqual([]);
});
test("createRoute() should create a new route and return its ID", async () => {
  const routeService = RouteService.getInstance();
  const data = { routeNumber: "101", busId: "bus1" };
  const routeId = await routeService.createRoute(data);
  expect(typeof routeId).toBe("string");
});
