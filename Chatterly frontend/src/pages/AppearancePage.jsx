import { Moon, Sun, Monitor, Palette } from "lucide-react";
import WorkspacePage from "./WorkspacePage.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
export default function AppearancePage() {
  const { theme, setTheme } = useTheme(),
    toast = useToast();
  function choose(v) {
    if (v === "system") {
      toast.showToast(
        "System theme is not supported by the current ThemeContext; choose light or dark.",
        "info",
      );
      return;
    }
    setTheme(v);
    toast.showToast(`${v} theme selected.`, "success");
  }
  return (
    <WorkspacePage
      title="Appearance"
      subtitle="Make Chatterly comfortable to use"
    >
      <section className="workspace-card appearance-section">
        <h2>
          <Palette size={18} /> Theme
        </h2>
        <p>Choose how the workspace looks on this device.</p>
        <div className="theme-choice-grid">
          <button
            className={`theme-choice ${theme === "light" ? "selected" : ""}`}
            onClick={() => choose("light")}
          >
            <div className="theme-preview theme-preview-light">
              <Sun size={23} />
            </div>
            <strong>Light</strong>
            <small>Bright and clear</small>
          </button>
          <button
            className={`theme-choice ${theme === "dark" ? "selected" : ""}`}
            onClick={() => choose("dark")}
          >
            <div className="theme-preview theme-preview-dark">
              <Moon size={23} />
            </div>
            <strong>Dark</strong>
            <small>Easy on the eyes</small>
          </button>
          <button className="theme-choice" onClick={() => choose("system")}>
            <div className="theme-preview theme-preview-system">
              <Monitor size={23} />
            </div>
            <strong>System</strong>
            <small>Not yet supported</small>
          </button>
        </div>
      </section>
    </WorkspacePage>
  );
}
