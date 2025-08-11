import React from "react";
import ServiceView from "../ServiceView";

export default function RenouvellementPasseport() {
  return (
    <ServiceView
      overview={{
        documents: [
          "Ancien passeport",
          "Copie de la carte d'identité",
          "Acte de naissance",
          "2 photos d'identité"
        ],
        fees: "250 MAD",
        delay: "12 jours ouvrables"
      }}
      steps={[
        "Vérification identité",
        "Téléversement documents",
        "Paiement",
        "Confirmation"
      ]}
    />
  );
}
