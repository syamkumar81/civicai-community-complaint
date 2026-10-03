import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  Bell,
  ShieldCheck,
  MapPin,
  Moon,
  Lock,
  LogOut,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../../supabaseClient";

function Settings({ navigate }) {
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Change password states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Privacy panel
  const [showPrivacy, setShowPrivacy] = useState(false);

  // =========================================================
  // LOAD SAVED SETTINGS
  // =========================================================

  useEffect(() => {
    const savedNotifications =
      localStorage.getItem("civicai_notifications");

    const savedLocation =
      localStorage.getItem("civicai_location");

    const savedDarkMode =
      localStorage.getItem("civicai_dark_mode");

    if (savedNotifications !== null) {
      setNotifications(savedNotifications === "true");
    }

    if (savedLocation !== null) {
      setLocation(savedLocation === "true");
    }

    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    }
  }, []);

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const toggleNotifications = () => {
    const newValue = !notifications;

    setNotifications(newValue);

    localStorage.setItem(
      "civicai_notifications",
      String(newValue)
    );
  };

  // =========================================================
  // LOCATION
  // =========================================================

  const toggleLocation = () => {
    const newValue = !location;

    setLocation(newValue);

    localStorage.setItem(
      "civicai_location",
      String(newValue)
    );
  };

  // =========================================================
  // DARK MODE
  // =========================================================

  const toggleDarkMode = () => {
    const newValue = !darkMode;

    setDarkMode(newValue);

    localStorage.setItem(
      "civicai_dark_mode",
      String(newValue)
    );

    // Keep the existing CivicAI dark design by default.
    // If your CSS supports light mode, this class can be used.
    document.body.classList.toggle(
      "light-mode",
      !newValue
    );
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const openPasswordModal = () => {
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("");
    setPasswordError("");
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    if (passwordLoading) return;

    setShowPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("");
    setPasswordError("");
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordMessage("");

    // Validate empty fields
    if (!newPassword || !confirmPassword) {
      setPasswordError(
        "Please enter your new password and confirm password."
      );
      return;
    }

    // Minimum password length
    if (newPassword.length < 6) {
      setPasswordError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    // Confirm password
    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setPasswordLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setPasswordMessage(
        "Password changed successfully."
      );

      setNewPassword("");
      setConfirmPassword("");

      // Close automatically after success
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordMessage("");
      }, 1500);
    } catch (error) {
      console.error("Password update error:", error);

      setPasswordError(
        error.message ||
          "Unable to change password. Please try again."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
      }

      navigate("login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("login");
    }
  };

  return (
    <main className="settings-page">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="settings-background">
        <div className="settings-glow settings-glow-one" />
        <div className="settings-glow settings-glow-two" />
        <div className="settings-grid" />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <motion.header
        className="settings-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          className="settings-back-button"
          onClick={() => navigate("user-dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="settings-brand">
          <div className="settings-brand-logo">
            <BrainCircuit size={21} />
          </div>

          <div>
            <strong>CivicAI</strong>
            <span>COMMUNITY INTELLIGENCE</span>
          </div>
        </div>
      </motion.header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="settings-container">

        {/* ===================================================
            HEADING
        =================================================== */}

        <motion.div
          className="settings-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="settings-eyebrow">
            <span />
            ACCOUNT SETTINGS
          </div>

          <h1>
            Manage your <span>settings.</span>
          </h1>

          <p>
            Customize your CivicAI experience, notifications,
            privacy and location preferences.
          </p>
        </motion.div>

        {/* ===================================================
            PREFERENCES
        =================================================== */}

        <motion.section
          className="settings-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="settings-card-heading">
            <div className="settings-card-icon">
              <Bell size={18} />
            </div>

            <div>
              <h2>Preferences</h2>
              <p>
                Control how CivicAI interacts with you.
              </p>
            </div>
          </div>

          {/* Notifications */}

          <SettingRow
            icon={<Bell size={17} />}
            title="Notifications"
            description="Receive updates about your complaints."
            enabled={notifications}
            onClick={toggleNotifications}
          />

          {/* Location */}

          <SettingRow
            icon={<MapPin size={17} />}
            title="Location Services"
            description="Use your location to improve complaint routing."
            enabled={location}
            onClick={toggleLocation}
          />

          {/* Dark Mode */}

          <SettingRow
            icon={<Moon size={17} />}
            title="Dark Mode"
            description="Use the CivicAI dark interface."
            enabled={darkMode}
            onClick={toggleDarkMode}
          />
        </motion.section>

        {/* ===================================================
            PRIVACY & SECURITY
        =================================================== */}

        <motion.section
          className="settings-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <div className="settings-card-heading">
            <div className="settings-card-icon">
              <ShieldCheck size={18} />
            </div>

            <div>
              <h2>Privacy & Security</h2>
              <p>Manage your account security.</p>
            </div>
          </div>

          {/* =================================================
              CHANGE PASSWORD
          ================================================= */}

          <button
            className="settings-action-row"
            onClick={openPasswordModal}
            type="button"
          >
            <div className="settings-action-left">
              <div className="settings-action-icon">
                <Lock size={17} />
              </div>

              <div>
                <strong>Change Password</strong>
                <span>
                  Update your account password
                </span>
              </div>
            </div>

            <ChevronRight size={17} />
          </button>

          {/* =================================================
              PRIVACY & DATA
          ================================================= */}

          <button
            className="settings-action-row"
            onClick={() => setShowPrivacy(!showPrivacy)}
            type="button"
          >
            <div className="settings-action-left">
              <div className="settings-action-icon">
                <ShieldCheck size={17} />
              </div>

              <div>
                <strong>Privacy & Data</strong>
                <span>
                  Manage how your information is used
                </span>
              </div>
            </div>

            <ChevronRight
              size={17}
              style={{
                transform: showPrivacy
                  ? "rotate(90deg)"
                  : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>

          {/* Privacy Information */}

          {showPrivacy && (
            <div
              style={{
                marginTop: "15px",
                padding: "16px",
                borderRadius: "12px",
                background:
                  "rgba(34, 211, 238, 0.04)",
                border:
                  "1px solid rgba(34, 211, 238, 0.10)",
                color: "#94a3b8",
                fontSize: "12px",
                lineHeight: "1.7",
              }}
            >
              <strong
                style={{
                  display: "block",
                  color: "#e2e8f0",
                  marginBottom: "6px",
                }}
              >
                Your Privacy
              </strong>

              CivicAI uses your account information to
              provide community complaint services,
              identify your complaints, and help route
              reported problems to the appropriate
              authorities.

              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  color: "#22d3ee",
                }}
              >
                <ShieldCheck size={14} />
                Your account is protected by Supabase
                authentication.
              </div>
            </div>
          )}
        </motion.section>

        {/* ===================================================
            ACCOUNT
        =================================================== */}

        <motion.section
          className="settings-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
        >
          <div className="settings-card-heading">
            <div className="settings-card-icon">
              <ShieldCheck size={18} />
            </div>

            <div>
              <h2>Account</h2>
              <p>
                Manage your CivicAI account.
              </p>
            </div>
          </div>

          <button
            className="settings-logout"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={17} />
            <span>Logout from CivicAI</span>
          </button>
        </motion.section>

        <p className="settings-footer">
          CivicAI • Community Intelligence Platform
        </p>
      </section>

      {/* =====================================================
          CHANGE PASSWORD MODAL
      ===================================================== */}

      {showPasswordModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(0, 0, 0, 0.72)",
            backdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            style={{
              width: "100%",
              maxWidth: "430px",
              padding: "28px",
              borderRadius: "18px",
              background: "#0b1320",
              border:
                "1px solid rgba(34, 211, 238, 0.16)",
              boxShadow:
                "0 25px 80px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Modal Header */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "22px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    color: "#22d3ee",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}
                >
                  <Lock size={14} />
                  SECURITY
                </div>

                <h2
                  style={{
                    margin: 0,
                    color: "#f8fafc",
                    fontSize: "22px",
                  }}
                >
                  Change Password
                </h2>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={passwordLoading}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "9px",
                  border:
                    "1px solid rgba(148, 163, 184, 0.15)",
                  background:
                    "rgba(148, 163, 184, 0.06)",
                  color: "#94a3b8",
                  cursor: passwordLoading
                    ? "not-allowed"
                    : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={17} />
              </button>
            </div>

            {/* New Password */}

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "#cbd5e1",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Enter new password"
                disabled={passwordLoading}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 13px",
                  borderRadius: "9px",
                  border:
                    "1px solid rgba(148, 163, 184, 0.18)",
                  background: "#080f1a",
                  color: "#f8fafc",
                  outline: "none",
                  fontSize: "13px",
                }}
              />
            </div>

            {/* Confirm Password */}

            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "#cbd5e1",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
                disabled={passwordLoading}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 13px",
                  borderRadius: "9px",
                  border:
                    "1px solid rgba(148, 163, 184, 0.18)",
                  background: "#080f1a",
                  color: "#f8fafc",
                  outline: "none",
                  fontSize: "13px",
                }}
              />
            </div>

            {/* Error */}

            {passwordError && (
              <div
                style={{
                  marginBottom: "15px",
                  padding: "11px 12px",
                  borderRadius: "9px",
                  background:
                    "rgba(239, 68, 68, 0.08)",
                  border:
                    "1px solid rgba(239, 68, 68, 0.18)",
                  color: "#fca5a5",
                  fontSize: "12px",
                }}
              >
                {passwordError}
              </div>
            )}

            {/* Success */}

            {passwordMessage && (
              <div
                style={{
                  marginBottom: "15px",
                  padding: "11px 12px",
                  borderRadius: "9px",
                  background:
                    "rgba(34, 197, 94, 0.08)",
                  border:
                    "1px solid rgba(34, 197, 94, 0.18)",
                  color: "#86efac",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <Check size={14} />
                {passwordMessage}
              </div>
            )}

            {/* Buttons */}

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={closePasswordModal}
                disabled={passwordLoading}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "9px",
                  border:
                    "1px solid rgba(148, 163, 184, 0.18)",
                  background:
                    "rgba(148, 163, 184, 0.06)",
                  color: "#cbd5e1",
                  cursor: passwordLoading
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={passwordLoading}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "9px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #22d3ee, #38bdf8)",
                  color: "#03131a",
                  cursor: passwordLoading
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "700",
                }}
              >
                {passwordLoading
                  ? "Updating..."
                  : "Update Password"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}

function SettingRow({
  icon,
  title,
  description,
  enabled,
  onClick,
}) {
  return (
    <div className="settings-row">
      <div className="settings-row-icon">
        {icon}
      </div>

      <div className="settings-row-content">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <button
        type="button"
        className={`settings-toggle ${
          enabled ? "enabled" : ""
        }`}
        onClick={onClick}
        aria-label={`Toggle ${title}`}
      >
        <span>
          {enabled && <Check size={11} />}
        </span>
      </button>
    </div>
  );
}

export default Settings;