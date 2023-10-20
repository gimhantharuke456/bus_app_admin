import AuthService from "../src/services/auth_service";

test("loginUser() should set email and password in localStorage", async () => {
  const authService = AuthService.getInstance();
  const email = "test@example.com";
  const password = "password123";
  await authService.loginUser(email, password);
  expect(localStorage.getItem("email")).toBe(email);
  expect(localStorage.getItem("password")).toBe(password);
});
test("signupUser() should throw an error with invalid email", async () => {
  const authService = AuthService.getInstance();
  const email = "invalidemail";
  const password = "password123";
  await expect(authService.signupUser(email, password)).rejects.toThrow();
});
test("getCurrentUserData() should return null with no user logged in", async () => {
  const authService = AuthService.getInstance();
  auth.currentUser = null;
  const userData = await authService.getCurrentUserData();
  expect(userData).toBeNull();
});
