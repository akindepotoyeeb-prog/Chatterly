export const sampleNotifications = [
  {
    id: 1,
    title: "Welcome to Chatterly",
    body: "Your workspace is ready to explore.",
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    title: "Complete your profile",
    body: "Add a short bio to help contacts recognise you.",
    time: "Today",
    read: false,
  },
  {
    id: 3,
    title: "Demo workspace",
    body: "Real-time notifications will be connected with the backend.",
    time: "Yesterday",
    read: true,
  },
];
export function filterNotifications(items, unreadOnly) {
  return unreadOnly ? items.filter((n) => !n.read) : items;
}
