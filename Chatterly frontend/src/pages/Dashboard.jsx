import { useMemo, useState } from "react";
import {
  Archive, Bell, CheckCheck, ChevronDown, CircleHelp, LogOut, MessageCircle,
  MoreHorizontal, PencilLine, Search, Send, Settings, Smile, Users, Video,
  Paperclip, Phone, X,
} from "lucide-react";
import Avatar from "../components/common/Avatar.jsx";
import Logo from "../components/common/Logo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useChatUI } from "../context/ChatContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useChats } from "../hooks/useChats.js";
import { useMessages } from "../hooks/useMessages.js";
import { sendMessage } from "../services/messageService.js";
import "../styles/dashboard.css";

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const { activeChatId, mobileView, openChat, closeChat } = useChatUI();
  const { chats, setChats, loading: chatsLoading, error: chatsError, reload: reloadChats } = useChats();
  const selectedChat = chats.find((chat) => chat.id === activeChatId) ?? chats[0] ?? null;
  const { messages, setMessages, loading: messagesLoading, error: messagesError, reload: reloadMessages } = useMessages(selectedChat?.id ?? null);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const filteredChats = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return chats;
    return chats.filter((chat) => `${chat.title} ${chat.lastMessage ?? ""}`.toLowerCase().includes(term));
  }, [chats, query]);

  async function handleSend(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !selectedChat || sending) return;
    setSending(true);
    try {
      const message = await sendMessage(selectedChat.id, { text, senderId: "u-me" });
      setMessages((current) => [...current, message]);
      setChats((current) => current.map((chat) => chat.id === selectedChat.id
        ? { ...chat, lastMessage: text, updatedAt: message.sentAt, unread: 0 }
        : chat));
      setDraft("");
    } catch (error) {
      showToast(error.message || "Message could not be sent.", "error");
    } finally {
      setSending(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      showToast("You have signed out.", "success");
    } catch (error) {
      showToast(error.message || "Unable to sign out.", "error");
    }
  }

  function comingSoon(feature) {
    showToast(`${feature} will be connected in a later build.`, "info");
  }

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-rail">
        <div className="dashboard-rail-logo"><Logo showName={false} /></div>
        <button className="rail-button rail-button-active" aria-label="Chats" title="Chats"><MessageCircle size={20} /></button>
        <button className="rail-button" onClick={() => comingSoon("Contacts")} aria-label="Contacts" title="Contacts"><Users size={20} /></button>
        <button className="rail-button" onClick={() => comingSoon("Notifications")} aria-label="Notifications" title="Notifications"><Bell size={20} /></button>
        <div className="dashboard-rail-spacer" />
        <button className="rail-button" onClick={() => comingSoon("Help center")} aria-label="Help" title="Help"><CircleHelp size={20} /></button>
        <button className="rail-button" onClick={() => comingSoon("Settings")} aria-label="Settings" title="Settings"><Settings size={20} /></button>
        <button className="dashboard-rail-avatar" onClick={handleSignOut} title="Sign out" aria-label="Sign out">{initials(user?.name || "Alex Morgan")}</button>
      </aside>

      <section className={`conversation-pane ${mobileView === "chat" ? "conversation-pane-hidden" : ""}`}>
        <header className="conversation-topbar">
          <div><span className="dashboard-eyebrow">YOUR WORKSPACE</span><h1>Messages</h1></div>
          <button className="dashboard-icon-button" onClick={() => comingSoon("New conversation")} aria-label="New conversation"><PencilLine size={18} /></button>
        </header>
        <label className="conversation-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations" aria-label="Search conversations" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button>}</label>
        <div className="conversation-section-label"><span>RECENT CHATS</span><button onClick={() => comingSoon("Archived chats")}><Archive size={14} /> Archive</button></div>

        <div className="conversation-list">
          {chatsLoading && <div className="dashboard-feedback">Loading your conversations…</div>}
          {chatsError && <div className="dashboard-feedback dashboard-feedback-error"><p>{chatsError}</p><button onClick={reloadChats}>Try again</button></div>}
          {!chatsLoading && !chatsError && filteredChats.length === 0 && <div className="dashboard-feedback">No conversations match your search.</div>}
          {filteredChats.map((chat) => (
            <button key={chat.id} className={`conversation-item ${selectedChat?.id === chat.id ? "conversation-item-active" : ""}`} onClick={() => openChat(chat.id)}>
              <Avatar name={chat.title} size="lg" online={chat.type === "direct" ? chat.id === "c-1" || chat.id === "c-3" : undefined} />
              <span className="conversation-copy"><span className="conversation-name-row"><strong>{chat.title}</strong><time>{formatTime(chat.updatedAt)}</time></span><span className="conversation-preview-row"><span>{chat.lastMessage || "Start a conversation"}</span>{chat.unread > 0 && <b className="unread-count">{chat.unread}</b>}</span></span>
            </button>
          ))}
        </div>
        <div className="conversation-pane-footer"><span className="online-indicator" /> All caught up <span>·</span> Demo workspace</div>
      </section>

      <section className={`chat-pane ${mobileView === "list" ? "chat-pane-mobile-hidden" : ""}`}>
        {selectedChat ? <>
          <header className="chat-topbar">
            <button className="mobile-back-button" onClick={closeChat} aria-label="Back to conversations"><ChevronDown size={20} /></button>
            <Avatar name={selectedChat.title} size="md" online={selectedChat.id === "c-1" || selectedChat.id === "c-3"} />
            <div className="chat-person"><strong>{selectedChat.title}</strong><span><i /> {selectedChat.type === "group" ? "Group conversation" : "Active recently"}</span></div>
            <div className="chat-topbar-actions">
              <button className="dashboard-icon-button" onClick={() => comingSoon("Voice calls")} aria-label="Voice call"><Phone size={18} /></button>
              <button className="dashboard-icon-button" onClick={() => comingSoon("Video calls")} aria-label="Video call"><Video size={18} /></button>
              <button className="dashboard-icon-button" onClick={() => comingSoon("Conversation options")} aria-label="More options"><MoreHorizontal size={20} /></button>
            </div>
          </header>

          <div className="chat-context-banner"><span><SparkleMark /> This is your personal demo space.</span><button onClick={() => comingSoon("Conversation details")}>Details <ChevronDown size={14} /></button></div>

          <div className="message-scroll-area">
            <div className="chat-date-divider"><span>CONVERSATION</span></div>
            {messagesLoading && <div className="dashboard-feedback">Loading messages…</div>}
            {messagesError && <div className="dashboard-feedback dashboard-feedback-error"><p>{messagesError}</p><button onClick={reloadMessages}>Try again</button></div>}
            {!messagesLoading && !messagesError && messages.length === 0 && <div className="chat-empty-state"><div><MessageCircle size={26} /></div><strong>Start the conversation</strong><p>Send a message to get things moving.</p></div>}
            {messages.map((message) => {
              const own = message.senderId === "u-me";
              return <div key={message.id} className={`message-row ${own ? "message-row-own" : ""}`}>
                {!own && <Avatar name={selectedChat.title} size="sm" />}
                <div className="message-content"><div className={`message-bubble ${own ? "message-bubble-own" : ""}`}>{message.text}</div><div className="message-meta"><time>{formatTime(message.sentAt)}</time>{own && <CheckCheck size={14} />}</div></div>
              </div>;
            })}
          </div>

          <form className="message-composer" onSubmit={handleSend}>
            <button type="button" className="composer-tool" onClick={() => comingSoon("Attachments")} aria-label="Attach file"><Paperclip size={19} /></button>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message ${selectedChat.title}…`} aria-label="Write a message" />
            <button type="button" className="composer-tool" onClick={() => setDraft((value) => `${value}${value ? " " : ""}😊`)} aria-label="Add emoji"><Smile size={19} /></button>
            <button className="composer-send" type="submit" disabled={!draft.trim() || sending} aria-label="Send message">{sending ? <span className="send-spinner" /> : <Send size={18} />}</button>
          </form>
          <div className="composer-footnote">Demo mode · Messages stay in this browser session only</div>
        </> : <div className="chat-welcome"><div className="chat-welcome-icon"><MessageCircle size={34} /></div><h2>Your conversations, all together.</h2><p>Choose a chat to pick up where you left off.</p></div>}
      </section>

      <aside className="dashboard-right-panel">
        <div className="right-panel-top"><span className="right-panel-dot" /> CHatterly <button onClick={() => comingSoon("Workspace menu")} aria-label="Workspace menu"><MoreHorizontal size={19} /></button></div>
        <div className="profile-summary"><Avatar name={user?.name || "Alex Morgan"} size="xl" online /><h2>{user?.name || "Alex Morgan"}</h2><p>{user?.email || "alex@example.com"}</p><span className="profile-status"><i /> Available</span></div>
        <div className="profile-divider" />
        <div className="workspace-card"><div className="workspace-card-icon"><MessageCircle size={19} /></div><div><strong>Your workspace</strong><p>Stay close to your people.</p></div></div>
        <div className="right-panel-note"><SparkleMark /><div><strong>Small moments matter</strong><p>A thoughtful message can make someone's day. Reach out to someone today.</p></div></div>
        <div className="right-panel-bottom"><ThemeToggle /><button className="dashboard-signout" onClick={handleSignOut}><LogOut size={16} /> Sign out</button></div>
      </aside>
    </main>
  );
}

function SparkleMark() {
  return <span className="sparkle-mark" aria-hidden="true">✦</span>;
}
