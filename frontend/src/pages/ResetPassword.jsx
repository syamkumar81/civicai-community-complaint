import { useState } from "react";
import { supabase } from "../supabaseClient";
import {
  ArrowLeft,
  BrainCircuit,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ResetPassword({ navigate }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isPasswordValid = password.length >= 8;

  const handleSubmit = async (e) => {
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
        setError(updateError.message || "Failed to reset password.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError("Unable to connect. Please try again.");
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
          {!submitted ? (
            <motion.div
              key="reset-form"
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
                Please enter your new password below. It must be at least 8 characters long.
              </p>

              <form onSubmit={handleSubmit}>
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

              <button
                className="back-button"
                onClick={() => navigate("login")}
              >
                <ArrowLeft size={17} />
                Back to login
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
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

export default ResetPassword;
