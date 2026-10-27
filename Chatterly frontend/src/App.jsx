import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ContactsPage from "./pages/ContactsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import HelpPage from "./pages/HelpPage.jsx";
import ArchivedPage from "./pages/ArchivedPage.jsx";
import NewChatPage from "./pages/NewChatPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import AppearancePage from "./pages/AppearancePage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import SplashScreen from "./pages/SplashScreen.jsx";
import "./styles/auth.css";
import "./styles/workspace-pages.css";

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
      <Route path="/app/contacts" element={<ProtectedOnly><ContactsPage /></ProtectedOnly>} />
      <Route path="/app/notifications" element={<ProtectedOnly><NotificationsPage /></ProtectedOnly>} />
      <Route path="/app/settings" element={<ProtectedOnly><SettingsPage /></ProtectedOnly>} />
      <Route path="/app/profile" element={<ProtectedOnly><ProfilePage /></ProtectedOnly>} />
      <Route path="/app/help" element={<ProtectedOnly><HelpPage /></ProtectedOnly>} />
      <Route path="/app/archived" element={<ProtectedOnly><ArchivedPage /></ProtectedOnly>} />
      <Route path="/app/new-chat" element={<ProtectedOnly><NewChatPage /></ProtectedOnly>} />
      <Route path="/app/privacy" element={<ProtectedOnly><PrivacyPage /></ProtectedOnly>} />
      <Route path="/app/appearance" element={<ProtectedOnly><AppearancePage /></ProtectedOnly>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

