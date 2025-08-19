import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfileDTO } from "../api/dto/UserDTO";
import { authService } from "../api/services/authService";


interface AuthContextType {
  user: UserProfileDTO | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  sendOtp: (emailOrPhone: string) => Promise<void>;
  verifyOtp: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger le user au démarrage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authService
        .getProfile()
        .then((profile) => setUser(profile))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    localStorage.setItem("token", res.token);
    const profile = await authService.getProfile();
    setUser(profile);
  };

  const register = async (data: any) => {
    await authService.register(data);
  };

  const sendOtp = async (emailOrPhone: string) => {
    await authService.sendOtp({ emailOrPhone });
  };

  const verifyOtp = async (data: any) => {
    await authService.verifyOtp(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, sendOtp, verifyOtp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
