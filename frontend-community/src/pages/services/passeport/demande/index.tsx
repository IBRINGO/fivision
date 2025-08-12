import React from "react";
import ServiceView from "../ServiceView";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";

export default function DemandePasseport() {
  return (
    <>
      <PageMeta
          title="Demande de Passeport"
          description="Page pour la demande de passeport, incluant les documents requis, les frais et les étapes du processus."
        />
      <PageBreadcrumb pageTitle="Profile" />
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

    </>
  );
}
