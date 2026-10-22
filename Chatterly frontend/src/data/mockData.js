/*
 * Demo data only. Nothing here comes from a server, and nothing typed in the
 * app is delivered to anyone. Replace with real API responses in a later phase.
 */
export const currentUser = {
  id: "u-me",
  name: "Alex Morgan",
  email: "alex@example.com",
  about: "Building things that matter.",
  avatar: null,
};

export const contacts = [
  { id: "u-1", name: "Maya Chen", status: "Designing the onboarding flow", online: true, lastSeen: null },
  { id: "u-2", name: "Daniel Okafor", status: "At the gym", online: false, lastSeen: "2026-10-17T08:12:00Z" },
  { id: "u-3", name: "Sofia Ramirez", status: "Available", online: true, lastSeen: null },
  { id: "u-4", name: "Liam Novak", status: "Do not disturb", online: false, lastSeen: "2026-10-16T21:40:00Z" },
];

export const conversations = [
  { id: "c-1", type: "direct", title: "Maya Chen", participantIds: ["u-1"], lastMessage: "Sent you the updated mockups.", updatedAt: "2026-10-17T09:41:00Z", unread: 2, pinned: true, muted: false, archived: false },
  { id: "c-2", type: "group", title: "Weekend Hike Crew", participantIds: ["u-2", "u-3", "u-4"], lastMessage: "Daniel: Trail opens at 7.", updatedAt: "2026-10-17T08:15:00Z", unread: 0, pinned: false, muted: true, archived: false },
  { id: "c-3", type: "direct", title: "Sofia Ramirez", participantIds: ["u-3"], lastMessage: "Thanks, that works for me.", updatedAt: "2026-10-16T18:02:00Z", unread: 0, pinned: false, muted: false, archived: false },
  { id: "c-4", type: "direct", title: "Liam Novak", participantIds: ["u-4"], lastMessage: "Let's pick this up Monday.", updatedAt: "2026-10-12T11:20:00Z", unread: 0, pinned: false, muted: false, archived: true },
];

export const messagesByConversation = {
  "c-1": [
    { id: "m-1", senderId: "u-1", text: "Morning! Did you get a chance to look at the layout?", sentAt: "2026-10-17T09:30:00Z", status: "read", starred: false },
    { id: "m-2", senderId: "u-me", text: "Yes, the sidebar spacing feels right now.", sentAt: "2026-10-17T09:35:00Z", status: "read", starred: false },
    { id: "m-3", senderId: "u-1", text: "Sent you the updated mockups.", sentAt: "2026-10-17T09:41:00Z", status: "delivered", starred: true },
  ],
  "c-2": [
    { id: "m-4", senderId: "u-3", text: "Who is bringing water?", sentAt: "2026-10-17T08:05:00Z", status: "read", starred: false },
    { id: "m-5", senderId: "u-2", text: "Trail opens at 7.", sentAt: "2026-10-17T08:15:00Z", status: "read", starred: false },
  ],
  "c-3": [
    { id: "m-6", senderId: "u-me", text: "Can we move the review to Thursday?", sentAt: "2026-10-16T17:58:00Z", status: "read", starred: false },
    { id: "m-7", senderId: "u-3", text: "Thanks, that works for me.", sentAt: "2026-10-16T18:02:00Z", status: "read", starred: false },
  ],
  "c-4": [],
};
