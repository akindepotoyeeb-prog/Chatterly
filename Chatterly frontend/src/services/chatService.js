import { USE_MOCK, delay, notConnected } from "./api.js";
import { conversations, contacts } from "../data/mockData.js";

export async function getConversations() {
  if (USE_MOCK) { await delay(); return conversations.map((c) => ({ ...c })); }
  throw notConnected("Loading conversations");
}

export async function getContacts() {
  if (USE_MOCK) { await delay(); return contacts.map((c) => ({ ...c })); }
  throw notConnected("Loading contacts");
}

export async function createGroup({ title, participantIds }) {
  if (USE_MOCK) {
    await delay();
    return {
      id: `c-${Date.now()}`, type: "group", title, participantIds,
      lastMessage: "Group created", updatedAt: new Date().toISOString(),
      unread: 0, pinned: false, muted: false, archived: false,
    };
  }
  throw notConnected("Creating a group");
}

export async function addContact({ name }) {
  if (USE_MOCK) {
    await delay();
    return { id: `u-${Date.now()}`, name, status: "Available", online: false, lastSeen: null };
  }
  throw notConnected("Adding a contact");
}
