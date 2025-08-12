import React from "react";
import ServiceView from "../ServiceView";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";

export default function RenouvellementPasseport() {
  return (
    <>
      <PageMeta
          title="Renouvellement de Passeport"
          description="Page pour le renouvellement de passeport, incluant les documents requis, les frais et les étapes du processus."
        />
      <PageBreadcrumb pageTitle="Renouvellement de Passeport" />
      <ServiceView
        overview={{
          documents: [
            "Formulaire de renouvellement rempli",
            "Copie du passeport actuel",
            "2 photos d'identité récentes",
            "Justificatif de domicile"
          ],
          fees: "400 MAD",
          delay: "10 jours ouvrables",
          extraInfo: "Assurez-vous que votre passeport actuel est valide pour le renouvellement."
        }}
        steps={[
          "Vérification des documents",
          "Téléversement des fichiers",
          "Paiement des frais",
          "Confirmation de la demande"
        ]}
      />
    </>
  );
}
