import { UserProfileDTO } from "./UserDTO";

// Requête connexion
export interface LoginRequest {
  email: string;
  password: string;
}

// Réponse connexion
export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: UserProfileDTO;
}

// Requête inscription
export interface RegisterRequest {
  fname: string;           // correspond à ton backend
  lname: string;           // correspond à ton backend
  email: string;
  password: string;
  accepted_terms: boolean;
}

// OTP
export interface OtpRequest {
  email: string;           // adapté à ton backend
}

// Vérification OTP
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}
