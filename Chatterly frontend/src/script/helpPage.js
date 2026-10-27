export const faqs = [
  {
    id: 1,
    category: "Basics",
    title: "Getting started",
    body: "Use the workspace navigation to open chats, contacts, notifications and settings. This build currently uses demo data.",
  },
  {
    id: 2,
    category: "Account",
    title: "How do I edit my profile?",
    body: "Open My profile, update your details and choose Save profile.",
  },
  {
    id: 3,
    category: "Appearance",
    title: "How do I change the theme?",
    body: "Use the theme toggle in the workspace or open Appearance.",
  },
  {
    id: 4,
    category: "Privacy",
    title: "Is my chat data synced?",
    body: "Not yet. Production authentication, persistent storage and realtime messaging still need backend integration.",
  },
];
export function searchFaqs(query) {
  const q = query.trim().toLowerCase();
  return faqs.filter(
    (f) => !q || `${f.title} ${f.category} ${f.body}`.toLowerCase().includes(q),
  );
}
