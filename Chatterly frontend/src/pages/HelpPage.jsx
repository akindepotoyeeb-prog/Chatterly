import { useMemo, useState } from "react";
import { CircleHelp, Search, Send } from "lucide-react";
import WorkspacePage from "./WorkspacePage.jsx";
import { searchFaqs } from "../script/helpPage.js";
import { useToast } from "../context/ToastContext.jsx";
export default function HelpPage() {
  const [q, setQ] = useState(""),
    [open, setOpen] = useState(1),
    [message, setMessage] = useState("");
  const toast = useToast(),
    faqs = useMemo(() => searchFaqs(q), [q]);
  function submit(e) {
    e.preventDefault();
    toast.showToast(
      "Support request captured in this demo; no email was sent.",
      "info",
    );
    setMessage("");
  }
  return (
    <WorkspacePage
      title="Help centre"
      subtitle="Find answers and learn how to use Chatterly"
      active="/app/help"
    >
      <div className="help-hero">
        <CircleHelp size={27} />
        <div>
          <h2>How can we help?</h2>
          <p>Search common questions or send a demo support request.</p>
        </div>
      </div>
      <label className="workspace-search">
        <Search size={17} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search help articles..."
        />
      </label>
      <section className="workspace-card help-articles">
        <h2>Frequently asked questions</h2>
        {faqs.map((f) => (
          <div className="faq-item" key={f.id}>
            <button
              className="faq-question"
              onClick={() => setOpen(open === f.id ? 0 : f.id)}
            >
              <span>
                <small>{f.category}</small>
                <strong>{f.title}</strong>
              </span>
              <b>{open === f.id ? "−" : "+"}</b>
            </button>
            {open === f.id && <p>{f.body}</p>}
          </div>
        ))}
        {!faqs.length && <p>No matching articles.</p>}
      </section>
      <form className="workspace-card support-form" onSubmit={submit}>
        <h2>Contact support</h2>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the issue..."
          required
        />
        <button className="primary-action">
          <Send size={16} /> Submit request
        </button>
      </form>
    </WorkspacePage>
  );
}
