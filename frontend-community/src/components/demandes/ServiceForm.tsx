import React, { useState } from "react";
import StepIndicator from "./StepIndicator";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Label from "../form/Label";
import Textarea from "../form/input/TextArea";
import DatePicker from "../form/date-picker";

interface ServiceFormProps {
  steps: string[];
  onSubmit: (data: any) => void;
  overview: {
    documents: string[];
    fees: string;
    delay: string;
  };
}

export default function ServiceForm({ steps, onSubmit, overview }: ServiceFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  // Contenu de chaque étape
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Informations personnelles
        return (
          <div className="space-y-4">
            <Label>Nom complet</Label>
            <Input
              placeholder="Entrez votre nom complet"
              value={formData.nom || ""}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            />
            <div>
              <DatePicker
                id="date-picker"
                label="Date de naissance"
                placeholder="Sélectionnez une date"
                onChange={( currentDateString) => {
                  setFormData({ ...formData, dateNaissance: currentDateString });
                }}
              />
            </div>
            <Label>Nationalité</Label>
            <Select
              options={[
                { value: "", label: "Sélectionner" },
                { value: "mali", label: "Mali" },
                { value: "autre", label: "Autre" },
              ]}
              defaultValue={formData.nationalite || ""}
              onChange={(value) => setFormData({ ...formData, nationalite: value })}
            />
          </div>
        );

      case 1: // Téléversement documents
        return (
          <div className="space-y-4">
            {overview.documents.map((doc, idx) => (
              <div key={idx}>
                <label className="text-sm font-medium">{doc}</label>
                <input
                  type="file"
                  className="mt-1 block w-full text-sm border rounded-md p-2"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`doc_${idx}`]: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>
            ))}
          </div>
        );

      case 2: // Paiement
        return (
          <div className="space-y-4">
            <p className="text-sm">
              Frais de traitement : <strong>{overview.fees}</strong>
            </p>
            <Label>Méthode de paiement</Label>
            <Select
              options={[
                { value: "", label: "Sélectionner" },
                { value: "carte", label: "Carte bancaire" },
                { value: "espece", label: "Paiement en espèces" },
              ]}
              defaultValue={formData.paiement || ""}
              onChange={(value) => setFormData({ ...formData, paiement: value })}
            />
          </div>
        );

      case 3: // Confirmation
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Veuillez vérifier vos informations avant soumission. Le délai estimé pour ce service est de <strong>{overview.delay}</strong>.
            </p>
            <Label>Commentaires supplémentaires</Label>
            <Textarea
              placeholder="Ajoutez des précisions..."
              value={formData.commentaire || ""}
              onChange={(value) => setFormData({ ...formData, commentaire: value })}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 space-y-4">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="mt-4">{renderStepContent()}</div>

      <div className="flex justify-between mt-6">
        <Button onClick={handlePrev} variant="outline" disabled={currentStep === 0}>
          Précédent
        </Button>
        <Button onClick={handleNext}>
          {currentStep < steps.length - 1 ? "Suivant" : "Soumettre"}
        </Button>
      </div>
    </div>
  );
}
