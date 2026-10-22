import { useState } from "react";
import { Info, MessageSquareOff, Check, CheckCheck, BellRing } from "lucide-react";
import Logo from "../components/common/Logo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import Avatar from "../components/common/Avatar.jsx";
import SearchInput from "../components/common/SearchInput.jsx";
import Modal from "../components/common/Modal.jsx";
import LoadingSkeleton from "../components/common/LoadingSkeleton.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { contacts } from "../data/mockData.js";

/** Temporary Phase 1 page: proves tokens, themes, and shared components work. */
export default function DesignSystem() {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();

  const matches = contacts.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <main className="page">
      <header className="page-head">
        <Logo />
        <ThemeToggle />
      </header>

      <div className="page-intro">
        <h1>Design system</h1>
        <p className="muted">The building blocks every CloudChat screen will reuse.</p>
        <div className="notice">
          <Info size={18} aria-hidden="true" />
          <span>All people and messages on this page are demo data. Nothing is sent to anyone.</span>
        </div>
      </div>

      <section className="section card">
        <header><h2>Buttons and inputs</h2></header>
        <div className="row">
          <button className="btn btn-primary">Send message</button>
          <button className="btn btn-ghost">Cancel</button>
          <button className="btn btn-danger">Delete chat</button>
          <button className="btn btn-primary" disabled>Disabled</button>
        </div>
        <div className="field">
          <label htmlFor="demo-email">Email address</label>
          <input id="demo-email" className="input" type="email" placeholder="you@example.com" />
        </div>
        <div className="field">
          <label htmlFor="demo-bad">Password</label>
          <input id="demo-bad" className="input" type="password" aria-invalid="true" aria-describedby="demo-bad-err" />
          <span id="demo-bad-err" className="field-error">Use at least 8 characters.</span>
        </div>
      </section>

      <section className="section card">
        <header><h2>Avatars and search</h2></header>
        <div className="row">
          {contacts.map((c) => (
            <Avatar key={c.id} name={c.name} online={c.online} size="lg" />
          ))}
        </div>
        <SearchInput value={query} onChange={setQuery} placeholder="Search contacts" label="Search contacts" />
        {matches.length === 0 ? (
          <EmptyState icon={<MessageSquareOff size={26} />} title="No contacts found" message="Try a different name." />
        ) : (
          <ul className="stack">
            {matches.map((c) => (
              <li key={c.id} className="row">
                <Avatar name={c.name} online={c.online} />
                <div>
                  <strong>{c.name}</strong>
                  <p className="muted" style={{ fontSize: "var(--text-sm)" }}>{c.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="section card">
        <header><h2>Message bubbles</h2></header>
        <div className="bubbles">
          <div className="bubble bubble-in">Sent you the updated mockups.</div>
          <div className="bubble bubble-out">
            Looks great, thank you.
            <span className="bubble-meta">09:42 <CheckCheck size={14} aria-label="Read" /></span>
          </div>
          <div className="bubble bubble-out">
            Simulated message.
            <span className="bubble-meta">09:43 <Check size={14} aria-label="Sent" /></span>
          </div>
        </div>
      </section>

      <section className="section card">
        <header><h2>Loading, empty, and error states</h2></header>
        <LoadingSkeleton rows={2} />
        <ErrorState message="We couldn't load your conversations. Check your connection and try again." onRetry={() => showToast("Retry simulated", "info")} />
      </section>

      <section className="section card">
        <header><h2>Feedback</h2></header>
        <div className="row">
          <button className="btn btn-ghost" onClick={() => showToast("Profile saved", "success")}>Success toast</button>
          <button className="btn btn-ghost" onClick={() => showToast("Couldn't send message", "error")}>Error toast</button>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}><BellRing size={16} /> Open dialog</button>
        </div>
      </section>

      <Modal
        open={modalOpen}
        title="Create group"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => { setModalOpen(false); showToast("Group created (demo)", "success"); }}>
              Create group
            </button>
          </>
        }
      >
        <div className="field">
          <label htmlFor="group-name">Group name</label>
          <input id="group-name" className="input" placeholder="Weekend Hike Crew" />
        </div>
        <p className="muted" style={{ fontSize: "var(--text-sm)" }}>Press Escape or tap outside to close.</p>
      </Modal>
    </main>
  );
}
