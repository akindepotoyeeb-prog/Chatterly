import { USE_MOCK, WS_URL } from "./api.js";

/*
 * Real-time integration point for Django Channels.
 * In mock mode this returns a no-op object with the same shape, so components
 * can subscribe today and keep working once a real connection replaces it.
 * Nothing is delivered in real time until the backend exists.
 */
export function createChatSocket({ onMessage, onStatusChange } = {}) {
  if (USE_MOCK || !WS_URL) {
    return { connect() { onStatusChange?.("mock"); }, disconnect() {}, send() {} };
  }

  let ws;
  return {
    connect() {
      ws = new WebSocket(WS_URL); // PLANNED: final path and auth handshake decided with the backend
      ws.onopen = () => onStatusChange?.("open");
      ws.onclose = () => onStatusChange?.("closed");
      ws.onmessage = (event) => {
        try { onMessage?.(JSON.parse(event.data)); } catch { /* ignore malformed frames */ }
      };
    },
    disconnect() { ws?.close(); },
    send(payload) { if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload)); },
  };
}
