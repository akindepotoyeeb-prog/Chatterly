import { USE_MOCK, delay, notConnected } from "./api.js";
import { messagesByConversation } from "../data/mockData.js";

export async function getMessages(conversationId) {
  if (USE_MOCK) {
    await delay(350);
    return (messagesByConversation[conversationId] ?? []).map((m) => ({ ...m }));
  }
  throw notConnected("Loading messages");
}

/** In mock mode the message stays on this device. It is never delivered to anyone. */
export async function sendMessage(conversationId, { text, senderId }) {
  if (USE_MOCK) {
    await delay(200);
    return { id: `m-${Date.now()}`, senderId, text, sentAt: new Date().toISOString(), status: "sent", starred: false };
  }
  throw notConnected("Sending a message");
}

export async function markAsRead(conversationId) {
  if (USE_MOCK) { await delay(100); return { conversationId }; }
  throw notConnected("Updating read receipts");
}

export async function uploadAttachment(conversationId, file) {
  if (USE_MOCK) { await delay(600); return { name: file.name, size: file.size, url: null }; } // nothing is stored
  throw notConnected("Uploading attachments");
}
