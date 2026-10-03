import { useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
  User,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CivicCommunityHero from "../components/CivicCommunityHero";
import "./Login.css";

function Login({ navigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeRole, setActiveRole] = useState("citizen");
  const [shakeKey, setShakeKey] = useState(0);

  const handleRoleChange = (role) => {
    if (role === "admin") {
      setActiveRole("admin");
      navigate("admin-login");
    } else {
      setActiveRole("citizen");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (authError) {
        setShakeKey((prev) => prev + 1);
        if (
          authError.message?.toLowerCase().includes("email not confirmed")
        ) {
          setError(
            "Please verify your email address before logging in. Check your inbox for the confirmation email."
          );
        } else {
          setError(
            authError.message || "Invalid email or password."
          );
        }
        return;
      }

      const profileResponse = await fetch(
        `http://127.0.0.1:8000/profile?email=${encodeURIComponent(email.trim())}`
      );

      if (!profileResponse.ok) {
        setShakeKey((prev) => prev + 1);
        const profileData = await profileResponse.json();
        setError(profileData.detail || "Failed to retrieve user profile.");
        return;
      }

      const profile = await profileResponse.json();

      localStorage.setItem(
        "civicai_user",
        JSON.stringify(profile)
      );

      localStorage.setItem(
        "civicai_logged_in",
        "true"
      );

      navigate("user-dashboard");
    } catch (err) {
      setShakeKey((prev) => prev + 1);
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="civic-login-page">
      {/* BACKGROUND ATMOSPHERE */}
      <div className="civic-login-bg">
        <div className="civic-bg-gradient-mesh" />
        <div className="civic-bg-cyber-grid" />
        <div className="civic-bg-orb civic-orb-1" />
        <div className="civic-bg-orb civic-orb-2" />
      </div>

      <div className="civic-login-container">
        {/* =========================================================
            LEFT SIDE: CIVICAI BRANDING & AI CIVIC VISUAL
        ========================================================= */}
        <section className="civic-brand-showcase">
          <motion.div
            className="civic-brand-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="civic-status-pill">
              <span className="civic-status-dot-pulse">
                <span className="civic-dot-core"></span>
                <span className="civic-dot-ring"></span>
              </span>
              <span className="civic-status-text">
                Neural Civic Engine Online 
              </span>
            </div>

            <div className="civic-brand-identity">
              <motion.div
                className="civic-brand-logo-badge"
                animate={{
                  boxShadow: [
                    "0 10px 25px rgba(6, 182, 212, 0.35)",
                    "0 10px 35px rgba(59, 130, 246, 0.5)",
                    "0 10px 25px rgba(6, 182, 212, 0.35)",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <BrainCircuit size={30} />
              </motion.div>

              <div className="civic-brand-titles">
                <h1>CivicAI</h1>
                <p>Smart Civic Services, Powered by AI</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="civic-brand-statement"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            <h2>
              Next-Gen Civic Services,{" "}
              <span className="civic-gradient-text">Powered by AI.</span>
            </h2>
            <p>
              CivicAI allows citizens to submit, track, and manage civic complaints
              with automated neural routing, real-time telemetry, and complete
              municipal transparency.
            </p>
          </motion.div>

          {/* UNIFIED SMART COMMUNITY & CIVIC SERVICES HERO VISUAL */}
          <motion.div
            className="civic-visual-stage"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          >
            <CivicCommunityHero />
          </motion.div>
        </section>

        {/* =========================================================
            RIGHT SIDE: GLASS-STYLE AUTHENTICATION CARD
        ========================================================= */}
        <section className="civic-auth-section">
          {/* MOBILE BRAND BANNER */}
          <div className="civic-mobile-brand">
            <div className="civic-brand-logo-badge">
              <BrainCircuit size={22} />
            </div>
            <div>
              <h2>CivicAI</h2>
              <p>Smart Civic Services Portal</p>
            </div>
          </div>

          <motion.div
            key={shakeKey}
            className="civic-glass-card"
            initial={{ opacity: 0, y: 30 }}
            animate={
              shakeKey > 0
                ? {
                    x: [0, -8, 8, -6, 6, -3, 3, 0],
                    opacity: 1,
                    y: 0,
                  }
                : { opacity: 1, y: 0 }
            }
            transition={{
              type: "spring",
              damping: 24,
              stiffness: 280,
              duration: 0.6,
            }}
          >
            {/* Top radiant edge line */}
            <div className="civic-card-glow-strip" />

            {/* Card Header */}
            <div className="civic-card-header">
              <div className="civic-card-badge-row">
                <div className="civic-card-brand-pill">
                  <div className="civic-card-logo-mini">
                    <BrainCircuit size={15} />
                  </div>
                  <span>CivicAI</span>
                </div>

                <span className="civic-welcome-chip">
                  <span className="civic-welcome-chip-dot" />
                  Welcome back
                </span>
              </div>

              <h2>Sign in</h2>
              <p>Sign in to continue to CivicAI</p>
            </div>

            {/* ROLE SELECTOR: CITIZEN vs ADMINISTRATOR */}
            <div className="civic-role-selector-wrap">
              <label className="civic-role-selector-label">Account Role</label>
              <div className="civic-role-segmented-box">
                <button
                  type="button"
                  className={`civic-role-tab ${
                    activeRole === "citizen" ? "active" : ""
                  }`}
                  onClick={() => handleRoleChange("citizen")}
                  aria-pressed={activeRole === "citizen"}
                >
                  <User size={15} />
                  <span>Citizen</span>
                </button>

                <button
                  type="button"
                  className={`civic-role-tab ${
                    activeRole === "admin" ? "active" : ""
                  }`}
                  onClick={() => handleRoleChange("admin")}
                  aria-pressed={activeRole === "admin"}
                >
                  <ShieldCheck size={15} />
                  <span>Administrator</span>
                </button>
              </div>
            </div>

            {/* ERROR STATE */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="civic-error-banner"
                  initial={{ opacity: 0, y: -10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                >
                  <AlertCircle size={17} className="civic-error-icon" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LOGIN FORM */}
            <form onSubmit={handleLogin} className="civic-auth-form" noValidate={false}>
              {/* EMAIL */}
              <div className="civic-input-field">
                <label htmlFor="civic-email" className="civic-input-label">
                  Email address
                </label>

                <div className="civic-input-box">
                  <Mail size={18} className="civic-input-icon" />
                  <input
                    id="civic-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="civic-input-control"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="civic-input-field">
                <div className="civic-input-label-row">
                  <label htmlFor="civic-password" className="civic-input-label">
                    Password
                  </label>

                  <button
                    type="button"
                    className="civic-forgot-btn"
                    onClick={() => navigate("forgot")}
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="civic-input-box">
                  <Lock size={18} className="civic-input-icon" />
                  <input
                    id="civic-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="civic-input-control"
                  />

                  <button
                    type="button"
                    className="civic-password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME */}
              <div className="civic-options-row">
                <label className="civic-checkbox-label">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="civic-checkbox-input"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <motion.button
                type="submit"
                className="civic-primary-btn"
                disabled={isLoading}
                whileHover={isLoading ? {} : { scale: 1.015 }}
                whileTap={isLoading ? {} : { scale: 0.985 }}
              >
                {isLoading ? (
                  <>
                    <span className="civic-btn-spinner" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </motion.button>
            </form>

            {/* CREATE ACCOUNT LINK */}
            <div className="civic-auth-footer-links">
              <span>Don't have an account?</span>
              <button
                type="button"
                className="civic-create-acc-btn"
                onClick={() => navigate("register")}
              >
                Create account
              </button>
            </div>

            {/* SECURITY ASSURANCE */}
            <div className="civic-security-assurance">
              <ShieldCheck size={16} />
              <span>
                Protected by 256-bit SSL encryption & privacy-first municipal protocol.
              </span>
            </div>
          </motion.div>

          {/* COPYRIGHT */}
          <div className="civic-copyright-text">
            © 2026 CIVICAI · Community Service Platform
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;