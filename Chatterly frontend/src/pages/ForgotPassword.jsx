import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import Logo from "../components/common/Logo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import { requestPasswordReset } from "../services/authService.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitted(false);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      await requestPasswordReset({ email: email.trim() });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Password recovery isn't available right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page auth-page-centered">
      <div className="auth-topbar">
        <Link className="auth-brand" to="/sign-in" aria-label="Chatterly home"><Logo /></Link>
        <ThemeToggle />
      </div>
      <section className="auth-recovery-card">
        <div className="auth-recovery-icon">{submitted ? <CheckCircle2 size={27} /> : <Mail size={27} />}</div>
        {submitted ? (
          <>
            <span className="auth-kicker">DEMO REQUEST RECEIVED</span>
            <h2>Check your inbox</h2>
            <p className="auth-subtitle">In a live version, password recovery instructions would be sent to <strong>{email.trim()}</strong>.</p>
            <div className="auth-info-note">This project is currently using mock services, so no email was actually sent.</div>
            <Link className="auth-submit auth-submit-link" to="/sign-in">Back to sign in <ArrowLeft size={18} /></Link>
          </>
        ) : (
          <>
            <span className="auth-kicker">ACCOUNT RECOVERY</span>
            <h2>Forgot your password?</h2>
            <p className="auth-subtitle">Enter the email address associated with your account. We'll show you what happens in demo mode.</p>
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {error && <div className="auth-error" role="alert">{error}</div>}
              <label className="auth-label" htmlFor="recovery-email">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={18} aria-hidden="true" />
                <input id="recovery-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Reset password"} {!submitting && <ArrowLeft className="auth-arrow-forward" size={18} />}</button>
            </form>
            <Link className="auth-back-link" to="/sign-in"><ArrowLeft size={16} /> Back to sign in</Link>
          </>
        )}
      </section>
      <footer className="auth-footer"><span>© {new Date().getFullYear()} Chatterly</span><span>Made for meaningful connections</span></footer>
    </main>
  );
}
