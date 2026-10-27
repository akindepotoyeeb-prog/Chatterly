import { useMemo, useState } from "react";
import { Search, UserPlus, MessageCircle, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorkspacePage from "./WorkspacePage.jsx";
import { contacts as sourceContacts } from "../data/mockData.js";
import { findContacts, createContact } from "../script/contactsPage.js";
import { useToast } from "../context/ToastContext.jsx";
export default function ContactsPage() {
  const [items, setItems] = useState(sourceContacts.map((x) => ({ ...x }))),
    [query, setQuery] = useState(""),
    [adding, setAdding] = useState(false),
    [name, setName] = useState(""),
    [email, setEmail] = useState("");
  const toast = useToast(),
    nav = useNavigate(),
    visible = useMemo(() => findContacts(items, query), [items, query]);
  function add(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setItems((p) => [createContact(name, email), ...p]);
    setName("");
    setEmail("");
    setAdding(false);
    toast.showToast("Contact added for this demo.", "success");
  }
  return (
    <WorkspacePage
      title="Contacts"
      subtitle="People you can connect with"
      active="/app/contacts"
      actions={
        <button className="primary-action" onClick={() => setAdding((v) => !v)}>
          <UserPlus size={17} /> Add contact
        </button>
      }
    >
      <label className="workspace-search">
        <Search size={17} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search contacts..."
        />
      </label>
      {adding && (
        <form className="workspace-card add-contact-form" onSubmit={add}>
          <h2>Add a contact</h2>
          <label>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button className="primary-action">Save contact</button>
        </form>
      )}
      <div className="contact-grid">
        {visible.map((c, i) => (
          <article
            className="workspace-card contact-card"
            key={c.id || c.email || i}
          >
            <div className="contact-avatar">
              {(c.name || "?").slice(0, 1).toUpperCase()}
            </div>
            <h2>{c.name}</h2>
            <p>
              <Mail size={14} />
              {c.email || "No email provided"}
            </p>
            <button
              className="secondary-action"
              onClick={() => {
                toast.showToast(
                  "Real chat creation needs backend integration.",
                  "info",
                );
                nav("/app/new-chat");
              }}
            >
              <MessageCircle size={15} /> Message
            </button>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="workspace-card workspace-empty">
          <UserPlus />
          <h2>No contacts found</h2>
          <p>Try another search or add a contact.</p>
        </div>
      )}
    </WorkspacePage>
  );
}
