import React from "react";
import ServiceView from "../ServiceView";

export default function DemandePasseport() {
  return (
    <ServiceView
      overview={{
        documents: [
          "Formulaire de demande rempli",
          "Copie de la carte d'identité",
          "Acte de naissance",
          "2 photos d'identité récentes"
        ],
        fees: "300 MAD",
        delay: "15 jours ouvrables",
        extraInfo: "Vérifiez la validité de vos documents avant soumission."
      }}
      steps={[
        "Informations personnelles",
        "Téléversement documents",
        "Paiement",
        "Confirmation"
      ]}
    />
  );
}
