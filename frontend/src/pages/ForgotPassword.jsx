import { useState } from "react";
import { supabase } from "../supabaseClient";
import {
  ArrowLeft,
  BrainCircuit,
  Mail,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ForgotPassword({ navigate }) {
  const [step, setStep] = useState("email"); // "email", "otp", "password", "success"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isPasswordValid = password.length >= 8;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError("");
    setIsLoading(true);

    try {
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(
        email.trim()
      );

      if (supabaseError) {
        // If it's a specific validation/network error, show it
        if (supabaseError.status && supabaseError.status >= 500) {
          setError("Server error. Please try again later.");
          return;
        }
      }

      // Always proceed to OTP entry to protect user registration status
      setStep("otp");
    } catch (err) {
      setError("Unable to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setError("");
    setIsLoading(true);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: "recovery",
      });

      if (verifyError) {
        setError(verifyError.message || "Invalid or expired verification code.");
        return;
      }

      setStep("password");
    } catch (err) {
      setError("Unable to verify code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message || "Failed to update password.");
        return;
      }

      setStep("success");
    } catch (err) {
      setError("Unable to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="simple-auth-page">
      <motion.div
        className="simple-auth-card"
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.div
              key="forgot-email"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
            >
              <div className="simple-logo">
                <BrainCircuit size={25} />
              </div>

              <span className="welcome-badge">
                <Mail size={13} />
                PASSWORD RECOVERY
              </span>

              <h1>Forgot password?</h1>

              <p>
                Enter your registered email address and we'll send you a secure password reset code.
              </p>

              <form onSubmit={handleSendOtp}>
                <div className="input-group">
                  <label htmlFor="reset-email">Email address</label>
                  <div className="input-wrapper">
                    <Mail size={19} />
                    <input
                      id="reset-email"
                      type="email"
                      name="civicai-reset-email"
                      autoComplete="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    className="login-error"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="login-error-icon">!</span>
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send reset code"}
                  <Mail size={17} />
                </button>
              </form>

              <button
                className="back-button"
                onClick={() => navigate("login")}
              >
                <ArrowLeft size={17} />
                Back to login
              </button>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="forgot-otp"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
            >
              <div className="simple-logo">
                <BrainCircuit size={25} />
              </div>

              <span className="welcome-badge">
                <ShieldCheck size={13} />
                VERIFY CODE
              </span>

              <h1>Enter verification code</h1>

              <p>
                We've sent a 6-digit verification code to <strong>{email}</strong>.
              </p>

              <form onSubmit={handleVerifyOtp}>
                <div className="input-group">
                  <label htmlFor="otp-code">Verification Code</label>
                  <div className="input-wrapper">
                    <ShieldCheck size={19} />
                    <input
                      id="otp-code"
                      type="text"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-digit code"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    className="login-error"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="login-error-icon">!</span>
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify code"}
                  <ShieldCheck size={17} />
                </button>
              </form>

              <button
                className="back-button"
                onClick={() => setStep("email")}
              >
                <ArrowLeft size={17} />
                Back to email input
              </button>
            </motion.div>
          )}

          {step === "password" && (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
            >
              <div className="simple-logo">
                <BrainCircuit size={25} />
              </div>

              <span className="welcome-badge">
                <Lock size={13} />
                RESET PASSWORD
              </span>

              <h1>Set new password</h1>

              <p>
                Your code is verified! Please enter your new password below.
              </p>

              <form onSubmit={handleUpdatePassword}>
                {/* NEW PASSWORD */}
                <div className="input-group">
                  <label htmlFor="new-password">New Password</label>
                  <div className="input-wrapper">
                    <Lock size={19} />
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      style={{ background: "none", border: "none", cursor: "pointer", position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="input-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div className="input-wrapper">
                    <Lock size={19} />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      style={{ background: "none", border: "none", cursor: "pointer", position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center" }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    className="login-error"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="login-error-icon">!</span>
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Update password"}
                  <Lock size={17} />
                </button>
              </form>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="forgot-success"
              className="reset-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="success-icon">
                <CheckCircle2 size={34} />
              </div>

              <span className="welcome-badge">
                SUCCESS
              </span>

              <h1>Password updated</h1>

              <p>
                Your password has been successfully updated. You can now use your new password to log in.
              </p>

              <button
                className="back-button"
                onClick={() => navigate("login")}
              >
                <ArrowLeft size={17} />
                Go to login
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}

export default ForgotPassword;