import api from "../axios";
import { UserProfileDTO, DocumentDTO } from "../dto/UserDTO";

export const userService = {
  getProfile: async (): Promise<UserProfileDTO> => {
    const res = await api.get("/users/me");
    return res.data;
  },

  updateProfile: async (payload: Partial<UserProfileDTO>): Promise<UserProfileDTO> => {
    const res = await api.put("/users/me", payload);
    return res.data;
  },

  uploadDocument: async (file: File, type: string): Promise<DocumentDTO> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const res = await api.post("/users/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  getLogs: async (userId: string) => {
    const res = await api.get(`/users/${userId}/logs`);
    return res.data;
  },
};
