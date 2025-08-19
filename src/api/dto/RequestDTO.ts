import { DocumentDTO } from "./UserDTO";

export type RequestStatus = "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "REJECTED";

export interface RequestDTO {
  id: string;
  type: string; // ex: "Acte de naissance", "Visa", etc.
  applicantId: string; // User ID
  documents: DocumentDTO[];
  status: RequestStatus;
  formInfo: RequestFormInfo;
  payment: RequestPaymentDTO;
  submittedAt: string;
  updatedAt: string;
}

export interface RequestFormInfo{
  nom?: string;
  dateNaissance?: string;
  nationalite?: string;
  commentaire?: string;
  mobileNumber?: string;
}

export interface RequestPaymentDTO {
  paymentMethod?: string;
  cardNumber?: string;
  cardHolder?: string;
  cardExpiry?: string;
  cardCvv?: string;
  amount?: number;
}

export interface RequestResponseDTO {
  id: string;
  type: string;
  applicantId: string;
  documents: DocumentDTO[];
  status: RequestStatus;
  submittedAt: string;
  updatedAt: string;
}

export interface RequestUpdateDTO {
  id: string;
  status: RequestStatus;
}

export interface RequestListDTO {
  id: string;
  type: string;
  applicantId: string;
  documents: DocumentDTO[];
  status: RequestStatus;
  submittedAt: string;
  updatedAt: string;
}

