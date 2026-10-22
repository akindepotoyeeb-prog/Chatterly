import { USE_MOCK, delay, notConnected } from "./api.js";

export async function updateProfile(userId, changes) {
  if (USE_MOCK) { await delay(); return { id: userId, ...changes }; } // kept in memory only
  throw notConnected("Saving your profile");
}
