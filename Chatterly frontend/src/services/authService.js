import { USE_MOCK, ApiError, delay, notConnected } from "./api.js";
import { currentUser } from "../data/mockData.js";

// Simulated session: lives in memory and resets on refresh. Not a real login.
let mockSession = null;

export async function getCurrentUser() {
  if (USE_MOCK) { await delay(250); return mockSession; }
  throw notConnected("Loading the current user");
}

export async function signIn({ email, password }) {
  if (USE_MOCK) {
    await delay();
    if (!email || !password) throw new ApiError("Enter your email and password.", 400);
    mockSession = { ...currentUser, email };
    return mockSession;
  }
  throw notConnected("Signing in");
}

export async function signUp({ name, email, password }) {
  if (USE_MOCK) {
    await delay();
    if (!name || !email || !password) throw new ApiError("Fill in every field.", 400);
    mockSession = { ...currentUser, name, email };
    return mockSession;
  }
  throw notConnected("Creating an account");
}

export async function requestPasswordReset({ email }) {
  if (USE_MOCK) { await delay(); return { email }; } // no email is actually sent
  throw notConnected("Password reset");
}

export async function signOut() {
  if (USE_MOCK) { await delay(150); mockSession = null; return; }
  throw notConnected("Signing out");
}
