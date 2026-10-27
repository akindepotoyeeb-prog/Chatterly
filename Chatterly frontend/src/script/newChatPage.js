import { filterText } from "./workspacePage.js";
export function findChatContacts(items, q) {
  return filterText(items, q, ["name", "email", "status"]);
}
