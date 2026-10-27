import { useMemo, useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { contacts } from "../data/mockData.js";
import { useToast } from "../context/ToastContext.jsx";
import WorkspacePage from "./WorkspacePage.jsx";
import { findChatContacts } from "../script/newChatPage.js";
export default function NewChatPage() {
  const [q, setQ] = useState(""),
    nav = useNavigate(),
    toast = useToast(),
    items = useMemo(() => findChatContacts(contacts, q), [q]);
  return (
    <WorkspacePage
      title="New conversation"
      subtitle="Choose a contact to start chatting"
    >
      <label className="workspace-search">
        <Search size={17} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email..."
        />
      </label>
      <div className="workspace-card new-chat-list">
        {items.map((c, i) => (
          <button
            className="new-chat-contact"
            key={c.id || c.email || i}
            onClick={() => {
              toast.showToast(
                `Selected ${c.name}. Real chat creation needs backend integration.`,
                "info",
              );
              nav("/app");
            }}
          >
            <div className="contact-avatar">
              {(c.name || "?").slice(0, 1).toUpperCase()}
            </div>
            <span>
              <strong>{c.name}</strong>
              <small>{c.email || c.status || "Contact"}</small>
            </span>
            <MessageCircle size={18} />
          </button>
        ))}
        {!items.length && <p>No contacts found. Add a contact first.</p>}
      </div>
    </WorkspacePage>
  );
}
