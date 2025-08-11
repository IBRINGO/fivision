import React from "react";
import ServiceView from "../ServiceView";

export default function PasseportMineur() {
  return (
    <ServiceView
      overview={{
        documents: [
          "Acte de naissance du mineur",
          "Autorisation parentale signée",
          "Copie pièce d'identité du parent",
          "2 photos d'identité"
        ],
        fees: "200 MAD",
        delay: "10 jours ouvrables",
        extraInfo: "Présence obligatoire d'un parent lors du dépôt."
      }}
      steps={[
        "Informations du mineur",
        "Téléversement documents",
        "Paiement",
        "Confirmation"
      ]}
    />
  );
}
