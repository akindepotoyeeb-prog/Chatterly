import { LogOut, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function AuthHome() {
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut();
      showToast("You have signed out.", "success");
      navigate("/sign-in", { replace: true });
    } catch (err) {
      showToast(err.message || "Unable to sign out.", "error");
    }
  }

  return (
    <main className="auth-page auth-home-page">
      <div className="auth-topbar">
        <div className="auth-brand"><Logo /></div>
        <div className="auth-home-actions"><ThemeToggle /><button className="auth-signout" type="button" onClick={handleSignOut}><LogOut size={16} /> Sign out</button></div>
      </div>
      <section className="auth-home-card">
        <div className="auth-home-icon"><MessageCircle size={30} /></div>
        <span className="auth-kicker">YOU'RE SIGNED IN</span>
        <h1>Welcome, {user?.name || "there"}.</h1>
        <p className="auth-subtitle">Your authentication screens are connected. This is the temporary landing page while we build the Chatterly chat dashboard.</p>
        <div className="auth-home-checklist">
          <div><ShieldCheck size={20} /><span><strong>Route protection</strong><small>Signed-out visitors are redirected to sign in.</small></span></div>
          <div><Sparkles size={20} /><span><strong>Form validation</strong><small>Required fields and password confirmation are checked.</small></span></div>
          <div><MessageCircle size={20} /><span><strong>Next milestone</strong><small>Build the real conversation dashboard and message composer.</small></span></div>
        </div>
        <div className="auth-info-note"><strong>Important:</strong> this is a frontend demo. The mock service accepts any non-empty sign-in email and password; no real account, password-reset email, or server session is created.</div>
        <button className="auth-submit" type="button" onClick={() => showToast("The chat dashboard is our next build milestone.", "info")}>Continue building <Sparkles size={18} /></button>
      </section>
      <footer className="auth-footer"><span>© {new Date().getFullYear()} Chatterly</span><span>Made for meaningful connections</span></footer>
    </main>
  );
}
