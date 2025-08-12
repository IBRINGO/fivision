import React, { useState, useRef } from "react";
import { Search, Filter, FileDown, Eye, Edit, MessageCircle, Upload, X, FileText, Trash2, Send, Paperclip } from "lucide-react";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import { Modal } from "../../components/ui/modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

type RequestStatus = "EN_COURS" | "VALIDEE" | "REJETEE" | "EN_ATTENTE";

interface Document {
  id: string;
  name: string;
  url: string;
  version: number;
  updatedAt: string;
}

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
  attachment?: { name: string; url: string };
}

interface Request {
  id: string;
  service: string;
  submittedAt: string;
  status: RequestStatus;
  documents: Document[];
  rejectionReason?: string;
  messages: Message[]; // Ajout pour la discussion
}

const mockData: Request[] = [
  {
    id: "REQ-2025-001",
    service: "Renouvellement Passeport",
    submittedAt: "2025-07-30T10:15:00Z",
    status: "EN_COURS",
    documents: [
      { id: "DOC-001", name: "Photo d'identité", url: "/docs/photo.pdf", version: 1, updatedAt: "2025-07-30T10:15:00Z" },
      { id: "DOC-004", name: "Formulaire rempli", url: "/docs/form.pdf", version: 1, updatedAt: "2025-07-30T10:15:00Z" },
    ],
    messages: [
      { id: "MSG-001", sender: "agent", text: "Votre demande est en cours de traitement.", timestamp: "2025-07-30T11:00:00Z" },
      { id: "MSG-002", sender: "user", text: "Merci pour l'information.", timestamp: "2025-07-30T11:30:00Z" },
    ],
  },
  {
    id: "REQ-2025-002",
    service: "Attestation de scolarité",
    submittedAt: "2025-06-14T09:00:00Z",
    status: "REJETEE",
    documents: [
      { id: "DOC-002", name: "Relevé de notes", url: "/docs/releve.pdf", version: 1, updatedAt: "2025-06-14T09:00:00Z" },
      { id: "DOC-005", name: "Certificat de naissance", url: "/docs/certificat.pdf", version: 1, updatedAt: "2025-06-14T09:00:00Z" },
    ],
    rejectionReason: "Document illisible",
    messages: [
      { id: "MSG-003", sender: "agent", text: "Le document est illisible. Veuillez le mettre à jour.", timestamp: "2025-06-15T10:00:00Z" },
    ],
  },
  {
    id: "REQ-2025-003",
    service: "Demande de bourse",
    submittedAt: "2025-07-01T14:20:00Z",
    status: "EN_ATTENTE",
    documents: [
      { id: "DOC-003", name: "Lettre de motivation", url: "/docs/lettre.pdf", version: 1, updatedAt: "2025-07-01T14:20:00Z" },
      { id: "DOC-006", name: "CV", url: "/docs/cv.pdf", version: 1, updatedAt: "2025-07-01T14:20:00Z" },
    ],
    messages: [],
  },
];

const statusBadge = (status: RequestStatus) => {
  switch (status) {
    case "EN_COURS":
      return <Badge variant="outline" color="brand">En cours</Badge>;
    case "VALIDEE":
      return <Badge variant="solid" color="success">Validée</Badge>;
    case "REJETEE":
      return <Badge variant="solid" color="error">Rejetée</Badge>;
    case "EN_ATTENTE":
      return <Badge variant="outline" color="warning">En attente</Badge>;
    default:
      return null;
  }
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

export default function MyRequestsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [requests, setRequests] = useState<Request[]>(mockData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messageAttachment, setMessageAttachment] = useState<File | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const itemsPerPage = 5;
  const filteredData = requests.filter(
    (r) =>
      (r.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.documents.some((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (statusFilter ? r.status === statusFilter : true) &&
      (dateFilter ? new Date(r.submittedAt).toISOString().startsWith(dateFilter) : true)
  );

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const updateDocument = (reqId: string, docId: string, file: File) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              documents: r.documents.map((doc) =>
                doc.id === docId
                  ? {
                      ...doc,
                      name: file.name,
                      url: URL.createObjectURL(file),
                      version: doc.version + 1,
                      updatedAt: new Date().toISOString(),
                    }
                  : doc
              ),
            }
          : r
      )
    );
    toast.success("Document mis à jour avec succès !", { position: "top-right" });
  };

  const deleteDocument = (reqId: string, docId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? { ...r, documents: r.documents.filter((doc) => doc.id !== docId) }
          : r
      )
    );
    toast.success("Document supprimé avec succès !", { position: "top-right" });
  };

  const sendMessage = (reqId: string) => {
    if (!newMessage.trim() && !messageAttachment) return;

    const newMsg: Message = {
      id: `MSG-${Date.now()}`,
      sender: "user",
      text: newMessage,
      timestamp: new Date().toISOString(),
      attachment: messageAttachment ? { name: messageAttachment.name, url: URL.createObjectURL(messageAttachment) } : undefined,
    };

    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? { ...r, messages: [...r.messages, newMsg] }
          : r
      )
    );

    setNewMessage("");
    setMessageAttachment(null);
    toast.success("Message envoyé !", { position: "top-right" });

    // Scroll to bottom
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const handleFileDrop = (e: React.DragEvent, reqId: string, docId: string) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) updateDocument(reqId, docId, file);
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setMessageAttachment(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-800 p-6 space-y-6 font-outfit animate-fade-in">
      {/* Toast Container */}
      <ToastContainer />

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-title-lg font-heading font-bold text-neutral-700 dark:text-neutral-50">
            Gestion des demandes
          </h1>
          <p className="text-theme-sm text-neutral-500 dark:text-neutral-400">
            Visualisez, mettez à jour et gérez vos demandes et documents en temps réel.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="menu-item"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <Filter className="w-4 h-4 mr-2" /> Filtres
        </Button>
      </header>

      {/* Sidebar (Filters) with Animation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-800 p-6 md:relative md:w-1/4 md:min-w-[240px] shadow-lg rounded-radius-lg md:rounded-none md:shadow-none"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-50">Filtres</h2>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-400">Recherche</label>
                <div className="relative mt-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="ID, service ou document..."
                    className="w-full pl-9 pr-4 py-2 border rounded-radius-lg bg-white dark:bg-neutral-700 dark:text-neutral-200 focus:ring-2 focus:ring-brand-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-400">Statut</label>
                <select
                  aria-label="Filtrer par statut"
                  className="w-full mt-1 border rounded-radius-lg px-3 py-2 dark:bg-neutral-700 dark:text-neutral-200 focus:ring-2 focus:ring-brand-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Tous les statuts</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="VALIDEE">Validée</option>
                  <option value="REJETEE">Rejetée</option>
                  <option value="EN_ATTENTE">En attente</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-400">Date de soumission</label>
                <input
                  type="date"
                  className="w-full mt-1 border rounded-radius-lg px-3 py-2 dark:bg-neutral-700 dark:text-neutral-200 focus:ring-2 focus:ring-brand-500"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setDateFilter("");
                  toast.info("Filtres réinitialisés.", { position: "top-right" });
                }}
              >
                Réinitialiser
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1">
        {/* Desktop Table */}
        <div className="hidden md:block bg-white dark:bg-neutral-800 rounded-radius-lg shadow-lg overflow-hidden animate-fade-in">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <thead className="bg-neutral-50 dark:bg-neutral-700">
              <tr className="text-left text-theme-xs font-medium text-neutral-500 uppercase tracking-wider">
                <th className="px-6 py-4">N° Dossier</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {paginatedData.map((r) => (
                <motion.tr
                  key={r.id}
                  onClick={() => setSelectedRequest(r)}
                  className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors duration-200"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-6 py-4 font-medium text-neutral-700 dark:text-neutral-200">{r.id}</td>
                  <td className="px-6 py-4 text-neutral-700 dark:text-neutral-200">{r.service}</td>
                  <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{formatDate(r.submittedAt)}</td>
                  <td className="px-6 py-4">{statusBadge(r.status)}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button size="xs" variant="ghost" className="text-neutral-500 hover:text-brand-500">
                      <FileDown className="w-4 h-4 mr-1" /> Reçu
                    </Button>
                    <Button size="xs" variant="ghost" className="text-neutral-500 hover:text-brand-500">
                      <MessageCircle className="w-4 h-4 mr-1" /> Contacter
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 dark:bg-neutral-700">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Précédent
            </Button>
            <span className="text-theme-sm text-neutral-700 dark:text-neutral-200">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="grid gap-4 md:hidden">
          {paginatedData.map((r) => (
            <motion.div
              key={r.id}
              onClick={() => setSelectedRequest(r)}
              className="bg-white dark:bg-neutral-800 p-4 rounded-radius-lg shadow-lg space-y-3 cursor-pointer animate-scale-up"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">{r.service}</h2>
                {statusBadge(r.status)}
              </div>
              <p className="text-theme-xs text-neutral-500 dark:text-neutral-400">N° {r.id}</p>
              <p className="text-theme-sm text-neutral-600 dark:text-neutral-400">{formatDate(r.submittedAt)}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="ghost" className="flex-1 menu-item">
                  <FileDown className="w-4 h-4 mr-1" /> Reçu
                </Button>
                <Button size="sm" variant="ghost" className="flex-1 menu-item">
                  <MessageCircle className="w-4 h-4 mr-1" /> Contacter
                </Button>
              </div>
            </motion.div>
          ))}
          {/* Pagination */}
          <div className="flex items-center justify-between py-4">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Précédent
            </Button>
            <span className="text-theme-sm text-neutral-700 dark:text-neutral-200">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>

        {/* Modal Détails */}
        <AnimatePresence>
          {selectedRequest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Modal
                isOpen={true}
                onClose={() => setSelectedRequest(null)}
                className="max-w-4xl p-6 rounded-radius-lg bg-white dark:bg-neutral-800 shadow-xl animate-scale-up"
              >
                <h2 className="text-title-md font-heading font-bold text-neutral-700 dark:text-neutral-50 mb-2">
                  {selectedRequest.service}
                </h2>
                <p className="text-theme-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  Soumise le {formatDate(selectedRequest.submittedAt)}
                </p>
                <div className="mb-4">{statusBadge(selectedRequest.status)}</div>
                {selectedRequest.status === "REJETEE" && (
                  <div className="bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300 p-4 rounded-radius-lg mb-4">
                    <span className="font-medium">Motif du rejet :</span> {selectedRequest.rejectionReason}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200 mb-2">Documents soumis</h3>
                <ul className="space-y-3 mb-6">
                  {selectedRequest.documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-radius-sm"
                    >
                      <div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-600 hover:underline text-theme-sm"
                        >
                          {doc.name} (v{doc.version})
                        </a>
                        <p className="text-theme-xs text-neutral-500 dark:text-neutral-400">
                          Mis à jour le {formatDate(doc.updatedAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => setPreviewDoc(doc)}
                          className="text-neutral-500 hover:text-brand-500"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {(selectedRequest.status === "EN_ATTENTE" || selectedRequest.status === "REJETEE") && (
                          <>
                            <label className="cursor-pointer text-brand-500 hover:text-brand-700">
                              <Upload className="w-4 h-4" />
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => e.target.files && updateDocument(selectedRequest.id, doc.id, e.target.files[0])}
                              />
                            </label>
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => deleteDocument(selectedRequest.id, doc.id)}
                              className="text-error-500 hover:text-error-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200 mb-2">Discussion avec l'agent</h3>
                <div
                  ref={chatRef}
                  className="h-64 overflow-y-auto space-y-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-radius-sm bg-neutral-100 dark:bg-neutral-700"
                >
                  {selectedRequest.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col gap-1 p-3 rounded-radius-sm shadow-sm ${
                        msg.sender === "user" ? "bg-brand-50 dark:bg-brand-900/20 ml-auto" : "bg-neutral-50 dark:bg-neutral-900/20"
                      }`}
                    >
                      <div className="flex justify-between text-theme-xs text-neutral-500 dark:text-neutral-400">
                        <span>{msg.sender === "user" ? "Vous" : "Agent"}</span>
                        <span>{formatDate(msg.timestamp)}</span>
                      </div>
                      <p className="text-theme-sm text-neutral-700 dark:text-neutral-200">{msg.text}</p>
                      {msg.attachment && (
                        <a
                          href={msg.attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-600 hover:underline text-theme-xs flex items-center gap-1"
                        >
                          <Paperclip className="w-3 h-3" /> {msg.attachment.name}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    placeholder="Tapez votre message..."
                    className="flex-1 p-3 border rounded-radius-sm focus:ring-2 focus:ring-brand-500 dark:bg-neutral-700 dark:text-neutral-200"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <label className="cursor-pointer p-3 border rounded-radius-sm flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-600">
                    <Paperclip className="w-5 h-5 text-neutral-500" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleAttachmentChange}
                    />
                  </label>
                  <Button
                    size="sm"
                    variant="primary"
                    className="px-4"
                    onClick={() => sendMessage(selectedRequest.id)}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </Modal>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Document Preview */}
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Modal
              isOpen={true}
              onClose={() => setPreviewDoc(null)}
              className="max-w-4xl p-6 rounded-radius-lg bg-white dark:bg-neutral-800 shadow-xl animate-scale-up"
            >
              <h2 className="text-title-md font-heading font-bold text-neutral-700 dark:text-neutral-50 mb-4">
                Prévisualisation : {previewDoc.name}
              </h2>
              <div className="relative h-[60vh] bg-neutral-100 dark:bg-neutral-700 rounded-radius-sm">
                <iframe
                  src={previewDoc.url}
                  title={previewDoc.name}
                  className="w-full h-full border-none"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(previewDoc.url, "_blank")}
                  className="menu-item"
                >
                  <FileDown className="w-4 h-4 mr-1" /> Télécharger
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPreviewDoc(null)}
                  className="menu-item"
                >
                  Fermer
                </Button>
              </div>
            </Modal>
          </motion.div>
        )}
      </div>
    </div>
  );
}