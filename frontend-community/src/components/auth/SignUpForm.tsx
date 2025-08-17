import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // Envoi au backend pour générer un OTP
   /* const res = await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });

    if (res.ok) {
      setStep("otp");
    } else {
      alert("Erreur lors de l'envoi de l'OTP");
    }*/
    setStep("otp"); 
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    // Vérification OTP côté backend
   /* const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, otp }),
    });

    if (res.ok) {
      alert("Compte créé avec succès !");
      navigate("/signin");
    } else {
      alert("Code OTP invalide");
    }*/
    navigate("/signin");
  };

  return (
    <div className="flex flex-col flex-1 w-full lg:w-1/2">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {step === "form" && (
          <>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 dark:text-white/90 text-title-md">
                Créer un compte
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Remplissez le formulaire pour créer votre compte
              </p>
            </div>
            <form onSubmit={handleSubmitForm} className="space-y-5">
              <div>
                <Label>Prénom<span className="text-error-500">*</span></Label>
                <Input value={formData.fname} onChange={e => setFormData({...formData, fname: e.target.value})} />
              </div>
              <div>
                <Label>Nom<span className="text-error-500">*</span></Label>
                <Input value={formData.lname} onChange={e => setFormData({...formData, lname: e.target.value})} />
              </div>
              <div>
                <Label>Email<span className="text-error-500">*</span></Label>
                <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <Label>Mot de passe<span className="text-error-500">*</span></Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <p className="text-gray-500 dark:text-gray-400">
                  J'accepte les <span className="text-gray-800 dark:text-white">Termes et Conditions</span>
                </p>
              </div>
              <Button className="w-full" type="submit">Envoyer le code OTP</Button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="mb-5">
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                Vérification OTP
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Un code a été envoyé à <b>{formData.email}</b>. Entrez-le ci-dessous.
              </p>
            </div>
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <Label>Code OTP</Label>
                <Input value={otp} onChange={e => setOtp(e.target.value)}
                   placeholder="Ex: 123456"
                   type="number"
                   className="w-full"
                   max="6"
                   />
              </div>
              <Button className="w-full" type="submit">Vérifier et créer mon compte</Button>
            </form>
          </>
        )}

        <div className="mt-5 text-sm text-center text-gray-700 dark:text-gray-400">
          J'ai déjà un compte ?{" "}
          <Link to="/signin" className="text-brand-500 hover:text-brand-600">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
