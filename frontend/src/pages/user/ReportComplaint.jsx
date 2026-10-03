import {
  ArrowLeft,
  BrainCircuit,
  Camera,
  CheckCircle2,
  FileText,
  MapPin,
  Send,
  Upload,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "../../supabaseClient";

const API_URL = "http://127.0.0.1:8000/complaints/";

function ReportComplaint({ navigate }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",

    state: "",
    district: "",
    village: "",
    pincode: "",
    address: "",

    location_type: "",
    emergency: "",
    severity_score: "",
    safety_risk_score: "",
    affected_people: "",
    estimated_cost_inr: "",

    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      // ==========================================
      // GET AUTHENTICATED USER
      // ==========================================

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw new Error("Unable to verify your login session.");
      }

      if (!user) {
        throw new Error(
          "You must be logged in to submit a complaint."
        );
      }

      const userId = user.id;

      // ==========================================
      // VALIDATE VALUES
      // ==========================================

      const severityScore = Number(formData.severity_score);
      const safetyRiskScore = Number(
        formData.safety_risk_score
      );
      const affectedPeople = Number(
        formData.affected_people
      );
      const estimatedCost = Number(
        formData.estimated_cost_inr
      );

      if (
        !Number.isFinite(severityScore) ||
        !Number.isFinite(safetyRiskScore) ||
        !Number.isFinite(affectedPeople) ||
        !Number.isFinite(estimatedCost)
      ) {
        throw new Error(
          "Please provide valid values for all problem assessment fields."
        );
      }

      if (affectedPeople < 1) {
        throw new Error(
          "Number of affected people must be at least 1."
        );
      }

      if (severityScore < 1 || severityScore > 10) {
        throw new Error(
          "Severity score must be between 1 and 10."
        );
      }

      if (safetyRiskScore < 1 || safetyRiskScore > 10) {
        throw new Error(
          "Safety risk score must be between 1 and 10."
        );
      }

      // ==========================================
      // PAYLOAD
      // ==========================================

      const payload = {
        user_id: userId,

        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,

        state: formData.state,
        district: formData.district.trim(),
        village: formData.village.trim(),
        pincode: formData.pincode.trim(),

        location_type: formData.location_type,
        emergency: formData.emergency,

        affected_people: affectedPeople,
        severity_score: severityScore,
        safety_risk_score: safetyRiskScore,

        repeat_complaints: 0,

        estimated_cost_inr: estimatedCost,

        submission_channel: "Web",
      };

      console.log("Submitting complaint:", payload);

      // ==========================================
      // API REQUEST
      // ==========================================

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            `Complaint submission failed (${response.status}).`
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message || "Complaint submission failed."
        );
      }

      if (!data?.complaint) {
        throw new Error(
          "Complaint was submitted but no complaint data was returned."
        );
      }

      setSubmittedComplaint(data);
      setSubmitted(true);
    } catch (err) {
      console.error("Complaint submission error:", err);

      setError(
        err?.message ||
          "Unable to submit complaint. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =====================================================
  // SUCCESS SCREEN
  // =====================================================

  if (submitted) {
    const complaint =
      submittedComplaint?.complaint || {};

    const complaintId =
      complaint?.complaint_id || "—";

    const predictedPriority =
      submittedComplaint?.predicted_priority ||
      complaint?.priority ||
      "Medium";

    return (
      <main className="report-page">
        <div className="report-background">
          <div className="report-grid" />
          <div className="report-glow report-glow-one" />
          <div className="report-glow report-glow-two" />
        </div>

        <header className="report-header">
          <button
            className="report-back-button"
            onClick={() =>
              navigate("user-dashboard")
            }
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>

          <div className="report-brand">
            <div className="report-brand-logo">
              <BrainCircuit size={23} />
            </div>

            <div className="report-brand-text">
              <strong>CivicAI</strong>
              <span>COMMUNITY INTELLIGENCE</span>
            </div>
          </div>
        </header>

        <section className="report-success-wrapper">
          <motion.div
            className="report-success-card"
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{ duration: 0.45 }}
          >
            <div className="success-icon-wrap">
              <CheckCircle2 size={42} />
            </div>

            <div className="success-label">
              <BrainCircuit size={15} />
              CIVICAI COMPLAINT SYSTEM
            </div>

            <h1>
              Complaint <span>Submitted.</span>
            </h1>

            <p>
              Your complaint has been successfully
              submitted. CivicAI AI has analyzed your
              complaint and determined its priority.
            </p>

            <div className="success-info-grid">
              <div className="success-info-box">
                <span>Complaint ID</span>
                <strong>{complaintId}</strong>
              </div>

              <div className="success-info-box">
                <span>AI Predicted Priority</span>
                <strong>{predictedPriority}</strong>
              </div>
            </div>

            <div className="success-message">
              <ShieldCheck size={17} />
              Your complaint has been securely recorded.
            </div>

            <button
              className="report-primary-button"
              onClick={() =>
                navigate("user-dashboard")
              }
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          </motion.div>
        </section>
      </main>
    );
  }

  // =====================================================
  // FORM
  // =====================================================

  return (
    <main className="report-page">
      <div className="report-background">
        <div className="report-grid" />
        <div className="report-glow report-glow-one" />
        <div className="report-glow report-glow-two" />
      </div>

      {/* HEADER */}

      <motion.header
        className="report-header"
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{ duration: 0.4 }}
      >
        <button
          className="report-back-button"
          onClick={() =>
            navigate("user-dashboard")
          }
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </button>

        <div className="report-brand">
          <div className="report-brand-logo">
            <BrainCircuit size={23} />
          </div>

          <div className="report-brand-text">
            <strong>CivicAI</strong>
            <span>COMMUNITY INTELLIGENCE</span>
          </div>
        </div>
      </motion.header>

      <section className="report-container">

        {/* PAGE HEADING */}

        <motion.div
          className="report-heading"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 0.45 }}
        >
          <div className="report-eyebrow">
            <span className="report-live-dot" />
            COMMUNITY SERVICE PORTAL
          </div>

          <h1>
            Report a <span>Problem.</span>
          </h1>

          <p>
            Help improve your community by reporting
            a local problem. Provide accurate details
            so authorities can respond faster.
          </p>
        </motion.div>

        {/* ERROR */}

        {error && (
          <motion.div
            className="report-error"
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <span>
              <AlertIcon />
            </span>

            <div>
              <strong>Unable to submit complaint</strong>
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        {/* FORM */}

        <motion.form
          className="report-form-card"
          onSubmit={handleSubmit}
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
        >

          {/* =====================================
              COMPLAINT DETAILS
          ====================================== */}

          <div className="report-section">
            <SectionHeader
              icon={<FileText size={18} />}
              title="Complaint Details"
              description="Tell us about the problem"
            />

            <div className="report-field">
              <label>
                Complaint Title <Required />
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Street light not working"
                required
              />
            </div>

            <div className="report-field">
              <label>
                Complaint Category <Required />
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select a category
                </option>

                <option value="Roads">
                  Roads & Infrastructure
                </option>

                <option value="Water">
                  Water Supply
                </option>

                <option value="Electricity">
                  Electricity
                </option>

                <option value="Waste">
                  Waste Management
                </option>

                <option value="Drainage">
                  Drainage & Sewage
                </option>

                <option value="Streetlight">
                  Street Lights
                </option>

                <option value="Public Safety">
                  Public Safety
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="report-field">
              <label>
                Description <Required />
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the problem in detail..."
                rows={6}
                required
              />
            </div>
          </div>

          {/* =====================================
              LOCATION
          ====================================== */}

          <div className="report-section">
            <SectionHeader
              icon={<MapPin size={18} />}
              title="Location"
              description="Where is the problem located?"
            />

            <div className="report-two-column">

              <div className="report-field">
                <label>
                  State <Required />
                </label>

                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select state
                  </option>

                  <option value="Andhra Pradesh">
                    Andhra Pradesh
                  </option>

                  <option value="Telangana">
                    Telangana
                  </option>

                  <option value="Tamil Nadu">
                    Tamil Nadu
                  </option>

                  <option value="Karnataka">
                    Karnataka
                  </option>

                  <option value="Kerala">
                    Kerala
                  </option>

                  <option value="Maharashtra">
                    Maharashtra
                  </option>

                  <option value="Delhi">
                    Delhi
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="report-field">
                <label>
                  District <Required />
                </label>

                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Enter district"
                  required
                />
              </div>

              <div className="report-field">
                <label>
                  Village / City <Required />
                </label>

                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="Enter village or city"
                  required
                />
              </div>

              <div className="report-field">
                <label>
                  Pincode <Required />
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
              </div>

            </div>

            <div className="report-field">
              <label>
                Full Address <Required />
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter the complete address or nearby landmark..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* =====================================
              AI ASSESSMENT
          ====================================== */}

          <div className="report-section">
            <SectionHeader
              icon={<BrainCircuit size={18} />}
              title="Problem Assessment"
              description="Help CivicAI understand the severity of the problem"
            />

            <div className="report-field">
              <label>
                Location Type <Required />
              </label>

              <select
                name="location_type"
                value={formData.location_type}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select location type
                </option>

                <option value="Urban">
                  Urban
                </option>

                <option value="Rural">
                  Rural
                </option>
              </select>
            </div>

            <div className="report-field">
              <label>
                Is this an emergency? <Required />
              </label>

              <select
                name="emergency"
                value={formData.emergency}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select option
                </option>

                <option value="Yes">
                  Yes — Immediate attention needed
                </option>

                <option value="No">
                  No — Normal complaint
                </option>
              </select>
            </div>

            <div className="report-two-column">

              <div className="report-field">
                <label>
                  Problem Severity{" "}
                  <Required />
                  <span className="label-hint">
                    (1–10)
                  </span>
                </label>

                <select
                  name="severity_score"
                  value={formData.severity_score}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select severity
                  </option>

                  {Array.from(
                    { length: 10 },
                    (_, i) => i + 1
                  ).map((value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="report-field">
                <label>
                  Safety Risk{" "}
                  <Required />
                  <span className="label-hint">
                    (1–10)
                  </span>
                </label>

                <select
                  name="safety_risk_score"
                  value={formData.safety_risk_score}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select safety risk
                  </option>

                  {Array.from(
                    { length: 10 },
                    (_, i) => i + 1
                  ).map((value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="report-two-column">

              <div className="report-field">
                <label>
                  Number of People Affected{" "}
                  <Required />
                </label>

                <input
                  type="number"
                  name="affected_people"
                  value={formData.affected_people}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  placeholder="Example: 20"
                  required
                />
              </div>

              <div className="report-field">
                <label>
                  Estimated Cost of Damage (₹){" "}
                  <Required />
                </label>

                <input
                  type="number"
                  name="estimated_cost_inr"
                  value={formData.estimated_cost_inr}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  placeholder="Example: 50000"
                  required
                />
              </div>

            </div>

            <div className="report-ai-note">
              <div className="report-ai-note-icon">
                <BrainCircuit size={17} />
              </div>

              <div>
                <strong>AI Priority Analysis</strong>

                <p>
                  CivicAI uses these details along
                  with your complaint information to
                  automatically predict the complaint
                  priority.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================
              PHOTO / EVIDENCE
          ====================================== */}

          <div className="report-section">
            <SectionHeader
              icon={<Camera size={18} />}
              title="Photo / Evidence"
              description="Upload an image of the problem"
            />

            <label className="report-upload">

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                hidden
              />

              <div className="report-upload-icon">
                <Upload size={24} />
              </div>

              <div className="report-upload-content">
                <strong>
                  {formData.image
                    ? formData.image.name
                    : "Upload a photo"}
                </strong>

                <span>
                  JPG, PNG or WEBP · Maximum 5 MB
                </span>
              </div>

              <div className="report-upload-arrow">
                <Upload size={17} />
              </div>

            </label>
          </div>

          {/* =====================================
              FORM FOOTER
          ====================================== */}

          <div className="report-form-footer">

            <div className="report-security">
              <CheckCircle2 size={17} />

              <span>
                Your information is securely handled.
              </span>
            </div>

            <motion.button
              type="submit"
              className="report-primary-button"
              disabled={isSubmitting}
              whileHover={
                !isSubmitting
                  ? {
                      scale: 1.02,
                      y: -2,
                    }
                  : {}
              }
              whileTap={
                !isSubmitting
                  ? {
                      scale: 0.98,
                    }
                  : {}
              }
            >
              {isSubmitting
                ? "Analyzing..."
                : "Submit Complaint"}

              <Send size={18} />
            </motion.button>

          </div>

        </motion.form>
      </section>
    </main>
  );
}

// =====================================================
// SECTION HEADER
// =====================================================

function SectionHeader({
  icon,
  title,
  description,
}) {
  return (
    <div className="report-section-title">

      <div className="report-section-icon">
        {icon}
      </div>

      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

    </div>
  );
}

// =====================================================
// REQUIRED
// =====================================================

function Required() {
  return (
    <span className="required-star">*</span>
  );
}

// =====================================================
// ERROR ICON
// =====================================================

function AlertIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export default ReportComplaint;