/*
 * Single place that decides how the app talks to data.
 *
 * VITE_USE_MOCK defaults to true, so every service answers from src/data/mockData.js.
 * When the Django backend exists, set VITE_USE_MOCK=false and implement the
 * non-mock branch in each service. No real endpoint exists yet; the paths
 * noted in the services are PLANNED, not available.
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
export const WS_URL = import.meta.env.VITE_WS_URL ?? "";

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Simulated network latency for mock mode. */
export const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

/** Thrown by the non-mock branches until the backend is built. */
export function notConnected(operation) {
  return new ApiError(`${operation} is not connected to a backend yet.`, 501);
}

/**
 * Thin fetch wrapper for the future backend. Uses cookies for the session
 * (credentials: "include") so no token is ever stored in JavaScript.
 */
export async function request(path, { method = "GET", body, headers = {} } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Could not reach the server. Check your connection and try again.");
  }
  if (!response.ok) throw new ApiError("The request failed.", response.status);
  return response.status === 204 ? null : response.json();
}
