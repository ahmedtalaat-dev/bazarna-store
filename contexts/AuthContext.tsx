"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getAuthToken,
  getProfile,
  login as loginRequest,
  signup as signupRequest,
  type ApiRecord,
} from "@/lib/api";

interface AuthContextValue {
  user: ApiRecord | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string,
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const responseUserAndToken = (payload: ApiRecord) => {
  const data = (payload.data ?? {}) as ApiRecord;
  const token = typeof payload.token === "string" ? payload.token : "";
  if (!token) throw new Error("The API did not return an authentication token.");
  return { data, token };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getAuthToken()) {
      setUser(null);
      return;
    }
    setUser(await getProfile());
  }, []);

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      if (!getAuthToken()) {
        if (active) setLoading(false);
        return;
      }
      try {
        const profile = await getProfile();
        if (active) setUser(profile);
      } catch (error) {
        console.error("Could not restore the authenticated session.", error);
        window.localStorage.removeItem("token");
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    void initialize();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, token } = responseUserAndToken(
      await loginRequest(email, password),
    );
    window.localStorage.setItem("token", token);
    setUser(data);
  }, []);

  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      passwordConfirm: string,
    ) => {
      const { data, token } = responseUserAndToken(
        await signupRequest(name, email, password, passwordConfirm),
      );
      window.localStorage.setItem("token", token);
      setUser(data);
    },
    [],
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem("token");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      refreshUser,
    }),
    [user, loading, login, signup, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
