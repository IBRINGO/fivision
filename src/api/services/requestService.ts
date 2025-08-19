import api from "../axios";
import { RequestDTO, RequestResponseDTO, RequestStatus } from "../dto/RequestDTO";
import { DocumentDTO } from "../dto/UserDTO";


export const requestService = {
  create: async (data: RequestDTO): Promise<RequestResponseDTO> => {
    const formData = new FormData();
    // Champs simples
    Object.entries(data).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        typeof value !== "object" &&
        key !== "documents"
      ) {
        formData.append(key, value as string);
      }
    });

    // Documents
    if (data.documents && data.documents.length > 0) {
      data.documents.forEach((file: DocumentDTO, idx: number) => {
        const fileBlob = new Blob([file.url!], { type: "application/pdf" });
        formData.append(`documents[${idx}]`, fileBlob);
      });
    }

    const res = await api.post<RequestResponseDTO>("/requests", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  /**
   * Lister toutes les demandes
   */
  list: async (): Promise<RequestDTO[]> => {
    const res = await api.get("/requests");
    return res.data;
  },

  /**
   * Récupérer une demande par ID
   */
  getById: async (id: string): Promise<RequestDTO> => {
    const res = await api.get(`/requests/${id}`);
    return res.data;
  },

  /**
   * Mettre à jour le statut d'une demande
   */
  updateStatus: async (id: string, status: RequestStatus): Promise<RequestDTO> => {
    const res = await api.put(`/requests/${id}/status`, { status });
    return res.data;
  },
};
