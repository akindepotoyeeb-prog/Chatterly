import { ShieldCheck, LockKeyhole, Database } from "lucide-react";
import WorkspacePage from "./WorkspacePage.jsx";
import { useToast } from "../context/ToastContext.jsx";
export default function PrivacyPage() {
  const toast = useToast();
  function clear() {
    try {
      localStorage.removeItem("chatterly-demo-settings");
      toast.showToast("Local demo preferences cleared.", "success");
    } catch {
      toast.showToast("Browser storage is unavailable.", "error");
    }
  }
  return (
    <WorkspacePage
      title="Privacy and security"
      subtitle="Understand the current demo's data and security status"
    >
      <div className="privacy-notice">
        <ShieldCheck size={23} />
        <div>
          <strong>Frontend demo notice</strong>
          <p>
            These controls are informational. A production app needs server-side
            access controls, secure session handling, data retention rules and
            tested privacy practices.
          </p>
        </div>
      </div>
      <div className="settings-layout">
        <section className="workspace-card settings-section">
          <h2>
            <LockKeyhole size={18} /> Account security
          </h2>
          <p>
            Client-side route guards are not a security boundary. The backend
            must validate identity and authorise protected requests.
          </p>
          <span className="status-pill">Backend integration required</span>
        </section>
        <section className="workspace-card settings-section">
          <h2>
            <Database size={18} /> Data storage
          </h2>
          <p>
            Some preferences are stored in this browser. Demo contacts and
            notifications may reset after refresh.
          </p>
          <button className="secondary-action" onClick={clear}>
            Clear local preferences
          </button>
        </section>
      </div>
    </WorkspacePage>
  );
}
