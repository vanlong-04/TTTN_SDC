import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import authService from "../services/authService";
import { getToken, removeToken, setToken } from "../utils/storage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        setUser(await authService.getProfile());
      } catch {
        removeToken();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const clearUnauthorizedSession = () => setUser(null);
    window.addEventListener("auth:unauthorized", clearUnauthorizedSession);
    return () => window.removeEventListener("auth:unauthorized", clearUnauthorizedSession);
  }, []);

  const completeAuthentication = useCallback(({ token, user: authUser }) => {
    setToken(token);
    setUser(authUser);
    return authUser;
  }, []);

  const login = useCallback(
    async (credentials) =>
      completeAuthentication(await authService.login(credentials)),
    [completeAuthentication]
  );

  const register = useCallback(
    async (data) => completeAuthentication(await authService.register(data)),
    [completeAuthentication]
  );

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authLoading: loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [loading, login, logout, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
