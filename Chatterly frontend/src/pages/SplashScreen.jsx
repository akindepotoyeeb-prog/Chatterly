import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Sparkles } from "lucide-react";
import Logo from "../components/common/Logo.jsx";
import "../styles/splash.css";

/** Brief branded entry screen; then sends the visitor to sign in. */
export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate("/sign-in", { replace: true });
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <main className="splash-screen" aria-label="Chatterly is starting">
      <div className="splash-orb splash-orb-one" aria-hidden="true" />
      <div className="splash-orb splash-orb-two" aria-hidden="true" />
      <div className="splash-content">
        <div className="splash-logo-wrap"><Logo /></div>
        <div className="splash-icon" aria-hidden="true">
          <MessageCircle size={38} strokeWidth={1.8} />
          <Sparkles className="splash-sparkle" size={17} />
        </div>
        <h1>Every conversation,<br /><span>closer.</span></h1>
        <p>Your space for meaningful connections.</p>
        <div className="splash-loader" role="status" aria-label="Loading Chatterly"><span /></div>
      </div>
      <div className="splash-bottom">A little closer, every day.</div>
    </main>
  );
}
