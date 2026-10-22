import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Logo from "../components/common/Logo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email address and password.");
      return;
    }

    setSubmitting(true);
    try {
      await signIn({ email: email.trim(), password });
      showToast("Signed in to the Chatterly demo.", "success");
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message || "We couldn't sign you in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-topbar">
        <Link className="auth-brand" to="/sign-in" aria-label="Chatterly home"><Logo /></Link>
        <ThemeToggle />
      </div>

      <section className="auth-layout">
        <aside className="auth-story">
          <div className="auth-story-glow" aria-hidden="true" />
          <span className="auth-eyebrow"><span className="auth-status-dot" /> YOUR SPACE TO CONNECT</span>
          <h1>Good conversations<br /><span>change everything.</span></h1>
          <p>Bring your people and your conversations together in one thoughtful space.</p>
          <div className="auth-preview" aria-label="Illustrative message preview">
            <div className="auth-preview-head">
              <div className="auth-mini-avatar auth-avatar-purple">M</div>
              <div><strong>Maya Chen</strong><small>Online now</small></div>
              <span className="auth-preview-time">09:41</span>
            </div>
            <div className="auth-preview-message">Hey! I just shared the new ideas with you ✨</div>
            <div className="auth-preview-reply">These look great. Let's talk through them!</div>
            <div className="auth-preview-foot"><span /> A little closer, every day.</div>
          </div>
          <div className="auth-story-footer">Thoughtful conversations start here.</div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-form-wrap">
            <div className="auth-mobile-brand"><Logo /></div>
            <span className="auth-kicker">WELCOME BACK</span>
            <h2>Sign in to Chatterly</h2>
            <p className="auth-subtitle">Pick up right where your conversations left off.</p>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {error && <div className="auth-error" role="alert">{error}</div>}

              <label className="auth-label" htmlFor="signin-email">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={18} aria-hidden="true" />
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="auth-label-row">
                <label className="auth-label" htmlFor="signin-password">Password</label>
                <Link className="auth-text-link" to="/forgot-password">Forgot password?</Link>
              </div>
              <div className="auth-input-wrap">
                <LockKeyhole size={18} aria-hidden="true" />
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button className="auth-input-action" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button className="auth-submit" type="submit" disabled={submitting}>
                {submitting ? "Signing in…" : "Sign in"}
                {!submitting && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="auth-switch">New to Chatterly? <Link to="/sign-up">Create an account</Link></p>
            <p className="auth-demo-note"><span /> Demo mode: no real account is created and no message is sent.</p>
          </div>
        </section>
      </section>
      <footer className="auth-footer"><span>© {new Date().getFullYear()} Chatterly</span><span>Made for meaningful connections</span></footer>
    </main>
  );
}
