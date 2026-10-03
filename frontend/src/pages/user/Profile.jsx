import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

import {
  ArrowLeft,
  BrainCircuit,
  User,
  Mail,
  Phone,
  MapPin,
  Map,
  Building2,
  Home,
  Hash,
  ShieldCheck,
  Edit3,
  CheckCircle2,
} from "lucide-react";

import { motion } from "framer-motion";

function Profile({ navigate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Get currently logged-in Supabase user
      const {
        data: { user },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError || !user) {
        setError("You are not logged in.");
        return;
      }

      // Get profile from your FastAPI backend
      const response = await fetch(
        `http://127.0.0.1:8000/profile?email=${encodeURIComponent(
          user.email
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to load profile");
      }

      const data = await response.json();

      setProfile(data);

      // Keep profile locally available
      localStorage.setItem(
        "civicai_user",
        JSON.stringify(data)
      );
    } catch (err) {
      console.error("Profile error:", err);
      setError("Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-background">
          <div className="profile-glow profile-glow-one" />
          <div className="profile-glow profile-glow-two" />
          <div className="profile-grid" />
        </div>

        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#22d3ee",
          }}
        >
          Loading profile...
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !profile) {
    return (
      <main className="profile-page">
        <div className="profile-background">
          <div className="profile-glow profile-glow-one" />
          <div className="profile-glow profile-glow-two" />
          <div className="profile-grid" />
        </div>

        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            color: "#fff",
          }}
        >
          <ShieldCheck size={30} />

          <h2>Unable to load profile</h2>

          <p>{error}</p>

          <button
            onClick={fetchProfile}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      {/* Background */}
      <div className="profile-background">
        <div className="profile-glow profile-glow-one" />
        <div className="profile-glow profile-glow-two" />
        <div className="profile-grid" />
      </div>

      {/* Header */}
      <motion.header
        className="profile-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          className="profile-back-button"
          onClick={() => navigate("user-dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="profile-brand">
          <div className="profile-brand-logo">
            <BrainCircuit size={21} />
          </div>

          <div>
            <strong>CivicAI</strong>
            <span>COMMUNITY INTELLIGENCE</span>
          </div>
        </div>
      </motion.header>

      {/* Main */}
      <section className="profile-container">

        {/* Heading */}
        <motion.div
          className="profile-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="profile-eyebrow">
            <span className="profile-live-dot" />
            ACCOUNT SETTINGS
          </div>

          <h1>
            My <span>Profile</span>
          </h1>

          <p>
            Manage your personal information and community
            service account details.
          </p>
        </motion.div>

        {/* ==========================================
            PROFILE OVERVIEW
        ========================================== */}

        <motion.section
          className="profile-overview-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.08,
          }}
        >
          <div className="profile-avatar">
            <User size={32} />
          </div>

          <div className="profile-overview-info">
            <h2>{profile.name || "Citizen"}</h2>

            <p>{profile.email}</p>

            <div className="profile-verified">
              <CheckCircle2 size={14} />
              Account Active
            </div>
          </div>

        </motion.section>

        {/* ==========================================
            PERSONAL INFORMATION
        ========================================== */}

        <motion.section
          className="profile-section-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.15,
          }}
        >
          <div className="profile-section-title">
            <div className="profile-section-icon">
              <User size={18} />
            </div>

            <div>
              <h2>Personal Information</h2>
              <p>Your basic account information</p>
            </div>
          </div>

          <div className="profile-fields">

            <div className="profile-field">
              <label>Full Name</label>

              <div className="profile-input">
                <User size={16} />
                <span>
                  {profile.name || "Not provided"}
                </span>
              </div>
            </div>

            <div className="profile-field">
              <label>Email Address</label>

              <div className="profile-input">
                <Mail size={16} />
                <span>
                  {profile.email || "Not provided"}
                </span>
              </div>
            </div>

            <div className="profile-field">
              <label>Phone Number</label>

              <div className="profile-input">
                <Phone size={16} />
                <span>
                  {profile.phone || "Not provided"}
                </span>
              </div>
            </div>

            <div className="profile-field">
              <label>Account Type</label>

              <div className="profile-input">
                <ShieldCheck size={16} />
                <span>Citizen</span>
              </div>
            </div>

          </div>
        </motion.section>

        {/* ==========================================
            LOCATION
        ========================================== */}

        <motion.section
          className="profile-section-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.22,
          }}
        >
          <div className="profile-section-title">
            <div className="profile-section-icon">
              <MapPin size={18} />
            </div>

            <div>
              <h2>Location Information</h2>

              <p>
                Your location helps route complaints to the
                appropriate local authority.
              </p>
            </div>
          </div>

          <div className="profile-fields">

            <div className="profile-field">
              <label>State</label>

              <div className="profile-input">
                <Map size={16} />

                <span>
                  {profile.state || "Not provided"}
                </span>
              </div>
            </div>

            <div className="profile-field">
              <label>District</label>

              <div className="profile-input">
                <Building2 size={16} />

                <span>
                  {profile.district || "Not provided"}
                </span>
              </div>
            </div>

            <div className="profile-field">
              <label>Village / City</label>

              <div className="profile-input">
                <Home size={16} />

                <span>
                  {profile.village ||
                    profile.city ||
                    "Not provided"}
                </span>
              </div>
            </div>

            <div className="profile-field">
              <label>Pincode</label>

              <div className="profile-input">
                <Hash size={16} />

                <span>
                  {profile.pincode || "Not provided"}
                </span>
              </div>
            </div>

          </div>
        </motion.section>

        {/* ==========================================
            SECURITY
        ========================================== */}

        <motion.section
          className="profile-security-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.29,
          }}
        >
          <div className="profile-security-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h3>Privacy & Security</h3>

            <p>
              Your account information is protected and will
              only be used for community service purposes.
            </p>
          </div>

          <span className="profile-secure-badge">
            SECURE
          </span>
        </motion.section>

      </section>
    </main>
  );
}

export default Profile;