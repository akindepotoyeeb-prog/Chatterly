import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService.js";

/*
 * Auth state lives in memory only. Passwords and tokens are never written to
 * localStorage. With the future Django backend, the session should travel in an
 * HttpOnly cookie that the browser manages, so this file never touches a token.
 * Today the sign-in is a simulation: no real account or session exists.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    authService
      .getCurrentUser()
      .then((u) => !cancelled && setUser(u))
      .catch(() => !cancelled && setUser(null))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const signIn = useCallback(async (credentials) => {
    const u = await authService.signIn(credentials);
    setUser(u);
    return u;
  }, []);

  const signUp = useCallback(async (details) => {
    const u = await authService.signUp(details);
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, setUser, loading, isAuthenticated: Boolean(user), signIn, signUp, signOut }),
    [user, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Context modules intentionally export both their provider and matching hook.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
