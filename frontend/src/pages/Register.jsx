import { useState } from "react";
import { supabase } from "../supabaseClient";
import {
  ArrowLeft,
  BrainCircuit,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Building,
  Home,
  Hash,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Login.css";
import "./Register.css";

function Register({ navigate }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [pincode, setPincode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const passwordsMatch =
    password.length > 0 && password === confirmPassword;

  const passwordScore = [
    hasMinLength,
    hasNumber,
    hasUppercase,
  ].filter(Boolean).length;

  const getPasswordLabel = () => {
    if (!password) return "";
    if (passwordScore === 1) return "Weak password";
    if (passwordScore === 2) return "Good password";
    return "Strong password";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !state.trim() ||
      !district.trim() ||
      !village.trim() ||
      !pincode.trim() ||
      !hasMinLength ||
      !hasNumber ||
      !hasUppercase ||
      !passwordsMatch ||
      !acceptedTerms
    ) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: fullName.trim(),
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || "Registration failed.");
        return;
      }

      const response = await fetch(
        "https://civicai-community-complaint.onrender.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullName.trim(),
            email: email.trim(),
            password: "__SUPABASE_AUTH__",
            phone: phone.trim(),
            state: state.trim(),
            district: district.trim(),
            village: village.trim(),
            pincode: pincode.trim(),
          }),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        setError(resData.detail || "Profile creation failed.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="civic-register-page">
      {/* BACKGROUND ATMOSPHERE */}
      <div className="civic-login-bg">
        <div className="civic-bg-gradient-mesh" />
        <div className="civic-bg-cyber-grid" />
        <div className="civic-bg-orb civic-orb-1" />
        <div className="civic-bg-orb civic-orb-2" />
      </div>

      <motion.div
        className="civic-register-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="civic-card-glow-strip" />

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="register-form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {/* HEADER */}
              <div className="civic-reg-header">
                <motion.div
                  className="civic-reg-logo-badge"
                  animate={{
                    boxShadow: [
                      "0 8px 25px rgba(6, 182, 212, 0.35)",
                      "0 8px 35px rgba(59, 130, 246, 0.5)",
                      "0 8px 25px rgba(6, 182, 212, 0.35)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <BrainCircuit size={28} />
                </motion.div>

                <span className="civic-reg-chip">
                  <span className="civic-reg-chip-dot" />
                  Citizen Registration
                </span>

                <h1>Create your CivicAI Account</h1>
                <p>
                  Join the AI-powered municipal community to report local issues, track
                  real-time resolutions, and help build a smarter city.
                </p>
              </div>

              {/* ERROR STATE */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="civic-error-banner"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AlertCircle size={17} className="civic-error-icon" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="civic-reg-form">
                <div className="civic-reg-grid">
                  {/* FULL NAME */}
                  <div className="civic-reg-field">
                    <label htmlFor="reg-name" className="civic-reg-label">
                      Full name
                    </label>
                    <div className="civic-input-box">
                      <User size={17} className="civic-input-icon" />
                      <input
                        id="reg-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="civic-input-control"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="civic-reg-field">
                    <label htmlFor="reg-email" className="civic-reg-label">
                      Email address
                    </label>
                    <div className="civic-input-box">
                      <Mail size={17} className="civic-input-icon" />
                      <input
                        id="reg-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="civic-input-control"
                      />
                    </div>
                  </div>

                  {/* PHONE */}
                  <div className="civic-reg-field">
                    <label htmlFor="reg-phone" className="civic-reg-label">
                      Phone Number
                    </label>
                    <div className="civic-input-box">
                      <Phone size={17} className="civic-input-icon" />
                      <input
                        id="reg-phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="civic-input-control"
                      />
                    </div>
                  </div>

                  {/* STATE */}
                  <div className="civic-reg-field">
                    <label htmlFor="reg-state" className="civic-reg-label">
                      State
                    </label>
                    <div className="civic-input-box">
                      <MapPin size={17} className="civic-input-icon" />
                      <input
                        id="reg-state"
                        type="text"
                        placeholder="Enter your state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        className="civic-input-control"
                      />
                    </div>
                  </div>

                  {/* DISTRICT */}
                  <div className="civic-reg-field">
                    <label htmlFor="reg-district" className="civic-reg-label">
                      District
                    </label>
                    <div className="civic-input-box">
                      <Building size={17} className="civic-input-icon" />
                      <input
                        id="reg-district"
                        type="text"
                        placeholder="Enter your district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        required
                        className="civic-input-control"
                      />
                    </div>
                  </div>

                  {/* VILLAGE / CITY */}
                  <div className="civic-reg-field">
                    <label htmlFor="reg-village" className="civic-reg-label">
                      Village / City
                    </label>
                    <div className="civic-input-box">
                      <Home size={17} className="civic-input-icon" />
                      <input
                        id="reg-village"
                        type="text"
                        placeholder="Enter village or city"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        required
                        className="civic-input-control"
                      />
                    </div>
                  </div>

                  {/* PINCODE */}
                  <div className="civic-reg-field">
                    <label htmlFor="reg-pincode" className="civic-reg-label">
                      Pincode
                    </label>
                    <div className="civic-input-box">
                      <Hash size={17} className="civic-input-icon" />
                      <input
                        id="reg-pincode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="e.g. 500001"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        required
                        className="civic-input-control"
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="civic-reg-field">
                    <label htmlFor="reg-password" className="civic-reg-label">
                      Password
                    </label>
                    <div className="civic-input-box">
                      <Lock size={17} className="civic-input-icon" />
                      <input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="civic-input-control"
                      />
                      <button
                        type="button"
                        className="civic-password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD (Full width or split) */}
                  <div className="civic-reg-field full-width">
                    <label htmlFor="reg-confirm-password" className="civic-reg-label">
                      Confirm Password
                    </label>
                    <div className="civic-input-box">
                      <Lock size={17} className="civic-input-icon" />
                      <input
                        id="reg-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="civic-input-control"
                      />
                      <button
                        type="button"
                        className="civic-password-toggle-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={
                          showConfirmPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>

                    {confirmPassword && (
                      <div
                        className={`civic-match-indicator ${
                          passwordsMatch ? "matched" : "mismatched"
                        }`}
                      >
                        {passwordsMatch ? <Check size={13} /> : <AlertCircle size={13} />}
                        <span>
                          {passwordsMatch
                            ? "Passwords match correctly"
                            : "Passwords do not match"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* PASSWORD STRENGTH & REQUIREMENTS METER */}
                {password && (
                  <div className="civic-password-strength-box">
                    <div className="civic-strength-bars">
                      <span
                        className={`civic-strength-segment ${
                          passwordScore >= 1 ? "active-weak" : ""
                        }`}
                      />
                      <span
                        className={`civic-strength-segment ${
                          passwordScore >= 2 ? "active-medium" : ""
                        }`}
                      />
                      <span
                        className={`civic-strength-segment ${
                          passwordScore >= 3 ? "active-strong" : ""
                        }`}
                      />
                      <span
                        className={`civic-strength-label ${
                          passwordScore === 1
                            ? "weak"
                            : passwordScore === 2
                            ? "medium"
                            : "strong"
                        }`}
                      >
                        {getPasswordLabel()}
                      </span>
                    </div>

                    <div className="civic-requirements-list">
                      <div
                        className={`civic-req-pill ${
                          hasMinLength ? "valid" : "invalid"
                        }`}
                      >
                        {hasMinLength ? <Check size={11} /> : <span>•</span>}
                        <span>Min. 8 characters</span>
                      </div>

                      <div
                        className={`civic-req-pill ${
                          hasNumber ? "valid" : "invalid"
                        }`}
                      >
                        {hasNumber ? <Check size={11} /> : <span>•</span>}
                        <span>At least 1 number</span>
                      </div>

                      <div
                        className={`civic-req-pill ${
                          hasUppercase ? "valid" : "invalid"
                        }`}
                      >
                        {hasUppercase ? <Check size={11} /> : <span>•</span>}
                        <span>At least 1 uppercase letter</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TERMS CHECKBOX */}
                <label className="civic-terms-wrap">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="civic-checkbox-input"
                  />
                  <span>
                    I accept the{" "}
                    <button
                      type="button"
                      className="civic-terms-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      Terms of Service
                    </button>{" "}
                    and acknowledge the{" "}
                    <button
                      type="button"
                      className="civic-terms-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>

                {/* SUBMIT BUTTON */}
                <motion.button
                  type="submit"
                  className="civic-primary-btn"
                  disabled={
                    isLoading ||
                    !acceptedTerms ||
                    !passwordsMatch ||
                    passwordScore < 3
                  }
                  whileHover={isLoading ? {} : { scale: 1.01 }}
                  whileTap={isLoading ? {} : { scale: 0.99 }}
                >
                  {isLoading ? (
                    <>
                      <span className="civic-btn-spinner" />
                      <span>Creating Citizen Account...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={17} />
                      <span>Create Citizen Account</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* FOOTER ACTIONS */}
              <div className="civic-auth-footer-links">
                <span>Already have an account?</span>
                <button
                  type="button"
                  className="civic-create-acc-btn"
                  onClick={() => navigate("login")}
                >
                  Sign in
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="button"
                  className="civic-reg-back-btn"
                  onClick={() => navigate("login")}
                >
                  <ArrowLeft size={15} />
                  Back to login
                </button>
              </div>

              {/* SECURITY NOTE */}
              <div className="civic-security-assurance">
                <ShieldCheck size={16} />
                <span>
                  Your citizen information is encrypted and protected by official CivicAI
                  privacy protocols.
                </span>
              </div>
            </motion.div>
          ) : (
            /* =========================================================
               REGISTRATION SUCCESS VERIFICATION SCREEN
            ========================================================= */
            <motion.div
              key="verification-screen"
              className="civic-reg-success-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="civic-success-pulse-box">
                <span className="civic-success-pulse-ring" />
                <CheckCircle2 size={40} />
              </div>

              <span className="civic-welcome-chip">
                <span className="civic-welcome-chip-dot" />
                Account Created Successfully
              </span>

              <h1>Welcome to CivicAI</h1>
              <p>
                Your citizen account has been registered with{" "}
                <strong>{email}</strong>.
              </p>

              <div className="civic-email-instruction-box">
                Please check your inbox for a confirmation email and click the verification
                link before signing in to access your citizen dashboard.
              </div>

              <motion.button
                type="button"
                className="civic-primary-btn"
                style={{ maxWidth: "280px" }}
                onClick={() => navigate("login")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Proceed to Login</span>
                <ArrowRight size={17} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}

export default Register;