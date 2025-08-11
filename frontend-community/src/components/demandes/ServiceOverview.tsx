import React from "react";
import { FileText, Clock, DollarSign, Info } from "lucide-react";

interface ServiceOverviewProps {
  documents: string[];
  fees: string;
  delay: string;
  extraInfo?: string;
}

export default function ServiceOverview({ documents, fees, delay, extraInfo }: ServiceOverviewProps) {
  return (
    <div className="space-y-4 bg-white dark:bg-slate-800 shadow-md rounded-xl p-6">
      <h2 className="text-lg font-semibold text-brand-600">Aperçu de la démarche</h2>

      <div>
        <h3 className="flex items-center gap-2 font-medium">
          <FileText className="w-4 h-4 text-brand-500" /> Documents à fournir
        </h3>
        <ul className="list-disc pl-6 text-sm mt-1">
          {documents.map((doc, idx) => (
            <li key={idx}>{doc}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="flex items-center gap-2 font-medium">
          <DollarSign className="w-4 h-4 text-brand-500" /> Frais de traitement
        </h3>
        <p className="text-sm">{fees}</p>
      </div>

      <div>
        <h3 className="flex items-center gap-2 font-medium">
          <Clock className="w-4 h-4 text-brand-500" /> Délais estimés
        </h3>
        <p className="text-sm">{delay}</p>
      </div>

      {extraInfo && (
        <div>
          <h3 className="flex items-center gap-2 font-medium">
            <Info className="w-4 h-4 text-brand-500" /> Informations utiles
          </h3>
          <p className="text-sm">{extraInfo}</p>
        </div>
      )}
    </div>
  );
}
