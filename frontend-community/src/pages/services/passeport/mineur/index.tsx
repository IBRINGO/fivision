import React from "react";
import ServiceView from "../ServiceView";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";

export default function PasseportMineur() {
  return (
    <>
      <PageMeta
        title="Passeport pour Mineur"
        description="Informations et étapes pour la demande de passeport pour mineurs, incluant les documents requis et les frais."
      />
      <PageBreadcrumb pageTitle="Passeport Mineur" />
      <ServiceView
        overview={{
          documents: [
            "Formulaire de demande rempli",
            "Copie de la carte d'identité du parent",
            "Acte de naissance du mineur",
            "2 photos d'identité récentes du mineur"
          ],
          fees: "300 MAD",
          delay: "15 jours ouvrables",
          extraInfo: "Assurez-vous que tous les documents sont à jour."
        }}
        steps={[
          "Informations personnelles du mineur",
          "Téléversement des documents",
          "Paiement des frais",
          "Confirmation de la demande"
        ]}
      />
    </>
  );
}
