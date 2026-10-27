import { useNavigate } from "react-router-dom";
import {
  Archive,
  Bell,
  CircleHelp,
  ContactRound,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import Logo from "../components/common/Logo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
const links = [
  ["Chats", "/app", LayoutDashboard],
  ["Contacts", "/app/contacts", ContactRound],
  ["Notifications", "/app/notifications", Bell],
  ["Archived", "/app/archived", Archive],
  ["Settings", "/app/settings", Settings],
  ["Help centre", "/app/help", CircleHelp],
];
export default function WorkspacePage({
  title,
  subtitle,
  active,
  children,
  actions,
}) {
  const nav = useNavigate(),
    auth = useAuth(),
    toast = useToast(),
    user = auth.user;
  async function signOut() {
    try {
      await auth.signOut();
      nav("/sign-in");
    } catch (e) {
      toast.showToast(e.message || "Could not sign out.", "error");
    }
  }
  return (
    <div className="workspace-page">
      <aside className="workspace-sidebar">
        <button className="workspace-brand" onClick={() => nav("/app")}>
          <Logo showName />
        </button>
        <div className="workspace-sidebar-label">WORKSPACE</div>
        <nav className="workspace-nav">
          {links.map(([label, path, Icon]) => (
            <button
              key={path}
              className={`workspace-nav-item ${active === path ? "is-active" : ""}`}
              onClick={() => nav(path)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="workspace-sidebar-bottom">
          <button
            className="workspace-nav-item"
            onClick={() => nav("/app/profile")}
          >
            <UserRound size={18} />
            <span>My profile</span>
          </button>
          <button
            className="workspace-nav-item"
            onClick={() => nav("/app/appearance")}
          >
            <Palette size={18} />
            <span>Appearance</span>
          </button>
          <button
            className="workspace-nav-item"
            onClick={() => nav("/app/privacy")}
          >
            <ShieldCheck size={18} />
            <span>Privacy</span>
          </button>
          <div className="workspace-user">
            <div className="workspace-user-avatar">
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </div>
            <div className="workspace-user-copy">
              <strong>{user?.name || "Your account"}</strong>
              <span>{user?.email || "Demo workspace"}</span>
            </div>
            <ThemeToggle />
          </div>
          <button className="workspace-nav-item" onClick={signOut}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      <main className="workspace-main">
        <header className="workspace-header">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="workspace-header-actions">{actions}</div>
        </header>
        <div className="workspace-content">{children}</div>
      </main>
    </div>
  );
}
