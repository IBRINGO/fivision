import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI, setAuthToken } from "../lib/api";
import type { StudentProfile } from "../lib/types";

type AuthState = {
  user?: StudentProfile | null;
  token?: string | null;
  loading: boolean;
  refreshMe: () => Promise<void>;
  setSession: (token: string | null, user?: StudentProfile | null) => void;
};

const Ctx = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setSession = (t: string | null, u?: StudentProfile | null) => {
    setToken(t);
    setAuthToken(t);
    if (u !== undefined) setUser(u);
    if (t) localStorage.setItem("auth_token", t);
    else localStorage.removeItem("auth_token");
  };

  const refreshMe = async () => {
    if (!token) { setLoading(false); return; }
    const r = await AuthAPI.me();
    if (r.ok && r.data) setUser(r.data);
    setLoading(false);
  };

  useEffect(() => {
    const t = localStorage.getItem("auth_token");
    if (t) {
      setSession(t);
      AuthAPI.me().then(r => {
        if (r.ok) setUser(r.data!);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Ctx.Provider value={{ user, token, loading, refreshMe, setSession }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
