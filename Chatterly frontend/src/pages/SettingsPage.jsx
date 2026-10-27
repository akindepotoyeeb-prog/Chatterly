import { useState } from "react";
import { Bell, MessageSquare, Globe, Save, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorkspacePage from "./WorkspacePage.jsx";
import { loadSettings, saveSettings } from "../script/settingsPage.js";
import { useToast } from "../context/ToastContext.jsx";
function Toggle({ title, desc, checked, onChange }) {
  return (
    <label className="preference-row">
      <span>
        <strong>{title}</strong>
        <small>{desc}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
export default function SettingsPage() {
  const [s, setS] = useState(loadSettings),
    toast = useToast(),
    nav = useNavigate(),
    change = (k, v) => setS((p) => ({ ...p, [k]: v }));
  function save() {
    toast.showToast(
      saveSettings(s)
        ? "Preferences saved on this device."
        : "Could not save browser preferences.",
      "success",
    );
  }
  return (
    <WorkspacePage
      title="Settings"
      subtitle="Manage your workspace preferences"
      active="/app/settings"
      actions={
        <button className="primary-action" onClick={save}>
          <Save size={16} /> Save changes
        </button>
      }
    >
      <div className="settings-layout">
        <section className="workspace-card settings-section">
          <h2>
            <Bell size={18} /> Notifications
          </h2>
          <Toggle
            title="Desktop notifications"
            desc="Allow browser notifications when supported."
            checked={s.desktopNotifications}
            onChange={(v) => change("desktopNotifications", v)}
          />
          <Toggle
            title="Message previews"
            desc="Show message text in previews."
            checked={s.messagePreview}
            onChange={(v) => change("messagePreview", v)}
          />
          <Toggle
            title="Notification sounds"
            desc="Play a sound for new activity."
            checked={s.sound}
            onChange={(v) => change("sound", v)}
          />
        </section>
        <section className="workspace-card settings-section">
          <h2>
            <MessageSquare size={18} /> Messaging
          </h2>
          <Toggle
            title="Enter to send"
            desc="Use Enter to send messages."
            checked={s.enterToSend}
            onChange={(v) => change("enterToSend", v)}
          />
        </section>
        <section className="workspace-card settings-section">
          <h2>
            <Globe size={18} /> Language
          </h2>
          <label>
            Interface language
            <select
              value={s.language}
              onChange={(e) => change("language", e.target.value)}
            >
              <option>English</option>
              <option>Arabic</option>
              <option>French</option>
              <option>Yoruba</option>
            </select>
          </label>
        </section>
        <section className="workspace-card settings-section">
          <h2>
            <ShieldCheck size={18} /> Account and privacy
          </h2>
          <p>
            Review how this frontend demo handles local preferences and backend
            integration.
          </p>
          <button
            className="secondary-action"
            onClick={() => nav("/app/privacy")}
          >
            Privacy settings
          </button>
        </section>
      </div>
      <p className="demo-note">
        These preferences are stored in this browser only, not synced to a
        server.
      </p>
    </WorkspacePage>
  );
}
