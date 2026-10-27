import { filterText } from "./workspacePage.js";
export function findContacts(items, query) {
  return filterText(items, query, ["name", "email", "status", "phone"]);
}
export function createContact(name, email) {
  return {
    id: `local-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    status: "New contact",
  };
}
