import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useAuth } from "../../context/AuthContext";
import { EyeClosed, EyeIcon } from "lucide-react";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [errorFname, setErrorFname] = useState<string | null>(null);
  const [errorLname, setErrorLname] = useState<string | null>(null);
  const [errorOtp, setErrorOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    accepted_terms: false,
  });

  const navigate = useNavigate();
  const { register, sendOtp, verifyOtp } = useAuth();

  // --- ENVOI OTP ---
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorEmail(null);
    setErrorPassword(null);
    setErrorFname(null);
    setErrorLname(null);
    setError(null);

    const { fname, lname, email, password, accepted_terms } = formData;

    // Validation frontend
    if (!fname) setErrorFname("Veuillez renseigner votre prénom.");
    if (!lname) setErrorLname("Veuillez renseigner votre nom.");
    if (!email || !/\S+@\S+\.\S+/.test(email)) setErrorEmail("Email invalide.");
    if (!password || password.length < 6)
      setErrorPassword("Le mot de passe doit contenir au moins 6 caractères.");
    if (!accepted_terms)
      setError("Vous devez accepter les termes et conditions.");

    if (!fname || !lname || !email || !password || !accepted_terms) return;

    try {
  setLoading(true);
  await sendOtp(formData.email); // ✅ envoyer comme objet
  setStep("otp");
  console.log("OTP envoyé à :", formData.email);
} catch (err: any) {
  setError(err.response?.data?.error || "Erreur lors de l’envoi de l’OTP.");
} finally {
  setLoading(false);
}


  };

  // --- VERIFICATION OTP ET CREATION COMPTE ---
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorOtp(null);

    if (!otp || otp.length !== 6) {
      setErrorOtp("Veuillez entrer un code OTP valide (6 chiffres).");
      return;
    }

    try {
      setLoading(true);
      await verifyOtp({ email: formData.email, otp });
      await register({fname: formData.fname, lname: formData.lname, email: formData.email, password: formData.password, accepted_terms: formData.accepted_terms}); // création compte backend
      alert("Compte créé avec succès 🎉");
      navigate("/signin");
    } catch (err: any) {
      setErrorOtp(err.response?.data?.message || "Code OTP invalide.");
    } finally {
      setLoading(false);
    }
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
                <Label>
                  Prénom<span className="text-error-500">*</span>
                </Label>
                <Input
                  name="fname"
                  type="text"
                  value={formData.fname}
                  onChange={(e) => {
                    setFormData({ ...formData, fname: e.target.value });
                    setErrorFname(null);
                  }}
                />
                {errorFname && <p className="text-red-500 mt-2">{errorFname}</p>}
              </div>

              <div>
                <Label>
                  Nom<span className="text-error-500">*</span>
                </Label>
                <Input
                  name="lname"
                  type="text"
                  value={formData.lname}
                  onChange={(e) => {
                    setFormData({ ...formData, lname: e.target.value });
                    setErrorLname(null);
                  }}
                />
                {errorLname && <p className="text-red-500 mt-2">{errorLname}</p>}
              </div>

              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrorEmail(null);
                  }}
                />
                {errorEmail && <p className="text-red-500 mt-2">{errorEmail}</p>}
              </div>

              <div>
                <Label>
                  Mot de passe<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setErrorPassword(null);
                    }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeIcon /> : <EyeClosed />}
                  </span>
                </div>
                {errorPassword && (
                  <p className="text-red-500 mt-2">{errorPassword}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  checked={formData.accepted_terms}
                  onChange={(checked) =>
                    setFormData({ ...formData, accepted_terms: checked })
                  }
                />
                <p className="text-gray-500 dark:text-gray-400">
                  J'accepte les{" "}
                  <span className="text-gray-800 dark:text-white">
                    Termes et Conditions
                  </span>
                </p>
              </div>

              {error && <p className="text-red-500 mt-2">{error}</p>}

              <Button
                className="w-full"
                type="submit"
                disabled={!formData.accepted_terms || loading}
              >
                {loading ? "Envoi en cours..." : "Envoyer le code OTP"}
              </Button>
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
                Un code a été envoyé à <b>{formData.email}</b>. Entrez-le
                ci-dessous.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <Label>Code OTP</Label>
                <Input
                  name="otp"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setErrorOtp(null);
                  }}
                  placeholder="Ex: 123456"
                  type="number"
                  className="w-full"
                />
              </div>

              {errorOtp && <p className="text-red-500 mt-2">{errorOtp}</p>}

              <Button className="w-full" type="submit">
                {loading ? "Vérification en cours..." : "Vérifier et créer mon compte"}
              </Button>
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
