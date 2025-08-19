import { useState, useCallback } from "react";
import { requestService } from "../api/services/requestService";
import { RequestDTO, RequestResponseDTO } from "../api/dto/RequestDTO";

export function useRequests() {
  const [requests, setRequests] = useState<RequestResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Créer une nouvelle demande */
  const createRequest = useCallback(async (data: RequestDTO) => {
    try {
      setLoading(true);
      setError(null);
      const res = await requestService.create(data);
      // Mettre à jour la liste locale
      setRequests((prev) => [...prev, res]);
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la création");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Lister toutes les demandes */
  const listRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await requestService.list();
      setRequests(res);
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors du chargement");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Récupérer une demande par ID */
  const getRequestById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await requestService.getById(id);
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la récupération");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    requests,
    loading,
    error,
    createRequest,
    listRequests,
    getRequestById,
  };
}
