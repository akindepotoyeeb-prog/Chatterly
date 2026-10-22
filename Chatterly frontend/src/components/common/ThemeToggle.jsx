import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "light" ? "dark" : "light";
  return (
    <button className="btn btn-ghost" onClick={toggleTheme} aria-label={`Switch to ${next} theme`}>
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      <span>{next === "dark" ? "Dark" : "Light"} theme</span>
    </button>
  );
}
