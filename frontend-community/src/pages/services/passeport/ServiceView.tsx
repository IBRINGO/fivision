import React from "react";
import ServiceOverview from "../../../components/demandes/ServiceOverview";
import ServiceForm from "../../../components/demandes/ServiceForm";

interface ServiceViewProps {
  overview: {
    documents: string[];
    fees: string;
    delay: string;
    extraInfo?: string;
  };
  steps: string[];
}

export default function ServiceView({ overview, steps }: ServiceViewProps) {
  return (
    <div className="space-y-6">
      <ServiceOverview {...overview} />
      <ServiceForm steps={steps}
       onSubmit={(data) => console.log("Soumission :", data)} 
        overview={overview}
       />
    </div>
  );
}
