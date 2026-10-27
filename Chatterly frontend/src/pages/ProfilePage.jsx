import { useEffect, useState } from "react";
import { Save, UserRound } from "lucide-react";
import WorkspacePage from "./WorkspacePage.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { updateProfile } from "../services/profileService.js";
import { profileName, profilePayload } from "../script/profilePage.js";
export default function ProfilePage() {
  const { user, setUser } = useAuth(),
    toast = useToast(),
    [form, setForm] = useState({ name: "", email: "", about: "" }),
    [saving, setSaving] = useState(false);
  useEffect(
    () =>
      setForm({
        name: profileName(user),
        email: user?.email || "",
        about: user?.about || user?.bio || "",
      }),
    [user],
  );
  const change = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  async function save(e) {
    e.preventDefault();
    const payload = profilePayload(form);
    if (!payload.name || !payload.email) {
      toast.showToast("Name and email are required.", "error");
      return;
    }
    setSaving(true);
    try {
      const updated = user?.id
        ? await updateProfile(user.id, payload)
        : { ...user, ...payload };
      setUser({ ...user, ...updated, ...payload });
      toast.showToast("Profile updated for this demo.", "success");
    } catch (err) {
      toast.showToast(err.message || "Could not update profile.", "error");
    } finally {
      setSaving(false);
    }
  }
  return (
    <WorkspacePage
      title="My profile"
      subtitle="Manage the information shown to your contacts"
    >
      <div className="profile-layout">
        <section className="workspace-card profile-preview">
          <div className="profile-avatar-large">
            {(form.name || "U").slice(0, 1).toUpperCase()}
          </div>
          <h2>{form.name || "Your name"}</h2>
          <p>{form.email || "your@email.com"}</p>
          <span className="profile-demo-badge">
            <UserRound size={14} /> Personal account
          </span>
          <p>{form.about || "Add a short introduction about yourself."}</p>
        </section>
        <form className="workspace-card profile-form" onSubmit={save}>
          <h2>Profile information</h2>
          <label>
            Display name
            <input
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
              required
              maxLength={70}
            />
          </label>
          <label>
            Email address
            <input
              type="email"
              value={form.email}
              onChange={(e) => change("email", e.target.value)}
              required
            />
          </label>
          <label>
            About
            <textarea
              rows={4}
              value={form.about}
              onChange={(e) => change("about", e.target.value)}
              maxLength={240}
              placeholder="A little about you..."
            />
          </label>
          <button className="primary-action" disabled={saving}>
            <Save size={16} />
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </WorkspacePage>
  );
}
