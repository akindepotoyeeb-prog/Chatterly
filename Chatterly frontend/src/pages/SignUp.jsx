import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import Logo from "../components/common/Logo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Complete all fields to continue.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signUp({ name: name.trim(), email: email.trim(), password });
      showToast("Your Chatterly demo account is ready.", "success");
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message || "We couldn't create your account. Please try again.");
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

      <section className="auth-layout auth-layout-signup">
        <aside className="auth-story">
          <div className="auth-story-glow" aria-hidden="true" />
          <span className="auth-eyebrow"><span className="auth-status-dot" /> YOUR PEOPLE, ONE PLACE</span>
          <h1>Make room for<br /><span>more connection.</span></h1>
          <p>Create your space, bring your people closer, and make every conversation count.</p>
          <div className="auth-benefits">
            <div><span className="auth-benefit-icon">01</span><div><strong>Simple by design</strong><small>Less clutter, more conversation.</small></div></div>
            <div><span className="auth-benefit-icon">02</span><div><strong>Your space, your style</strong><small>Switch between light and dark themes.</small></div></div>
            <div><span className="auth-benefit-icon">03</span><div><strong>Built to grow</strong><small>A messaging experience in progress.</small></div></div>
          </div>
          <div className="auth-story-footer">A better space for everyday conversations.</div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-form-wrap">
            <div className="auth-mobile-brand"><Logo /></div>
            <span className="auth-kicker">GET STARTED — IT'S FREE</span>
            <h2>Create your account</h2>
            <p className="auth-subtitle">A few details and you're ready to go.</p>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {error && <div className="auth-error" role="alert">{error}</div>}

              <label className="auth-label" htmlFor="signup-name">Full name</label>
              <div className="auth-input-wrap">
                <UserRound size={18} aria-hidden="true" />
                <input id="signup-name" type="text" autoComplete="name" placeholder="Your full name" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>

              <label className="auth-label" htmlFor="signup-email">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={18} aria-hidden="true" />
                <input id="signup-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>

              <label className="auth-label" htmlFor="signup-password">Password <span className="auth-label-hint">At least 8 characters</span></label>
              <div className="auth-input-wrap">
                <LockKeyhole size={18} aria-hidden="true" />
                <input id="signup-password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Create a password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                <button className="auth-input-action" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <label className="auth-label" htmlFor="signup-confirm-password">Confirm password</label>
              <div className="auth-input-wrap">
                <LockKeyhole size={18} aria-hidden="true" />
                <input id="signup-confirm-password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Enter your password again" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
              </div>

              <button className="auth-submit" type="submit" disabled={submitting}>
                {submitting ? "Creating account…" : "Create account"}
                {!submitting && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="auth-switch">Already have an account? <Link to="/sign-in">Sign in</Link></p>
            <p className="auth-demo-note"><span /> Demo mode: account details are not saved to a server.</p>
          </div>
        </section>
      </section>
      <footer className="auth-footer"><span>© {new Date().getFullYear()} Chatterly</span><span>Made for meaningful connections</span></footer>
    </main>
  );
}
