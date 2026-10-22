import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import SplashScreen from "./pages/SplashScreen.jsx";
import "./styles/auth.css";

/**
 * PublicOnly keeps signed-in users out of the authentication screens.
 * ProtectedOnly prevents signed-out users from opening /app.
 *
 * These are frontend route guards, not backend security. Django must enforce
 * authentication and permissions when the backend is connected.
 */
function PublicOnly({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="auth-loading">Preparing Chatterly…</div>;
  return isAuthenticated ? <Navigate to="/app" replace /> : children;
}

function ProtectedOnly({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="auth-loading">Preparing Chatterly…</div>;
  return isAuthenticated ? children : <Navigate to="/sign-in" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/sign-in" element={<PublicOnly><SignIn /></PublicOnly>} />
      <Route path="/sign-up" element={<PublicOnly><SignUp /></PublicOnly>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/app" element={<ProtectedOnly><Dashboard /></ProtectedOnly>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

