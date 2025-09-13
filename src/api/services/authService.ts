import api from "../axios";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  OtpRequest,
  VerifyOtpRequest,
} from "../dto/AuthDTO";
import { UserProfileDTO } from "../dto/UserDTO";

export const authService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    console.log("🔐 Tentative de login avec :", payload);
    
    const { data } = await api.post<LoginResponse>("/users/login", payload);
    return data;
  },

  getProfile: async (): Promise<UserProfileDTO> => {
    const { data } = await api.get<UserProfileDTO>("/users/profile");
    return data;
  },

  register: async (payload: RegisterRequest): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>("/users/register", payload);
    return data;
  },

  sendOtp: async (payload: OtpRequest): Promise<{ message: string }> => {
    console.log("📩 Envoi OTP à :", payload);
    const { data } = await api.post<{ message: string }>("/users/send-otp",payload);
    console.log("✅ OTP envoyé à :", data);
    return data;
  },

  verifyOtp: async (payload: VerifyOtpRequest): Promise<{ message: string }> => {
    console.log("🔍 Vérification OTP pour :", payload);
    
    const { data } = await api.post<{ message: string }>("/users/verify-otp", payload);
    console.log("✅ OTP vérifié :", data);
    
    return data;
  },

  logout: async (): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>("/auth/logout");
    return data;
  },
};
