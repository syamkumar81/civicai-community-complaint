import { useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  MapPin,
  Search,
  CheckCircle2,
  Clock3,
  AlertCircle,
  FileText,
  Building2,
  CalendarDays,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

function TrackComplaint({ navigate }) {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const id = complaintId.trim();

    if (!id) {
      setError("Please enter a complaint ID.");
      setComplaint(null);
      return;
    }

    setLoading(true);
    setError("");
    setComplaint(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/complaints/${encodeURIComponent(id)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Complaint not found."
        );
      }

      if (!data.complaint) {
        throw new Error(
          "Complaint data was not returned."
        );
      }

      setComplaint(data.complaint);
    } catch (err) {
      console.error("Track complaint error:", err);

      setError(
        err.message ||
          "Unable to find the complaint."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    try {
      const date = new Date(dateString);

      if (Number.isNaN(date.getTime())) {
        return "—";
      }

      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);

      if (Number.isNaN(date.getTime())) {
        return "";
      }

      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const getLocation = () => {
    if (!complaint) return "—";

    return [
      complaint.village,
      complaint.district,
      complaint.state,
    ]
      .filter(Boolean)
      .join(", ") || "—";
  };

  // ==========================================
  // NORMALIZE STATUS
  // ==========================================

  const rawStatus = String(
    complaint?.status || "Pending"
  )
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  const isPending =
    rawStatus === "pending";

  const isInProgress =
    rawStatus === "inprogress";

  const isResolved =
    rawStatus === "resolved";

  const isRejected =
    rawStatus === "rejected";

  // ==========================================
  // DISPLAY STATUS
  // ==========================================

  const getDisplayStatus = () => {
    if (isPending) return "Pending";
    if (isInProgress) return "In Progress";
    if (isResolved) return "Resolved";
    if (isRejected) return "Rejected";

    return complaint?.status || "Pending";
  };

  // ==========================================
  // STATUS DESCRIPTION
  // ==========================================

  const getStatusDescription = () => {
    if (isPending) {
      return "Your complaint has been received and is awaiting review.";
    }

    if (isInProgress) {
      return "Your complaint is currently being processed by the concerned department.";
    }

    if (isResolved) {
      return "Your complaint has been successfully resolved.";
    }

    if (isRejected) {
      return "Your complaint has been reviewed but was not approved for further action.";
    }

    return "Your complaint has been received.";
  };

  return (
    <main className="track-page">

      {/* ==========================================
          BACKGROUND
      ========================================== */}

      <div className="track-background">
        <div className="track-glow track-glow-one" />
        <div className="track-glow track-glow-two" />
        <div className="track-grid" />
      </div>

      {/* ==========================================
          HEADER
      ========================================== */}

      <motion.header
        className="track-header"
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <button
          className="track-back-button"
          onClick={() =>
            navigate("user-dashboard")
          }
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </button>

        <div className="track-brand">
          <div className="track-brand-logo">
            <BrainCircuit size={22} />
          </div>

          <div>
            <strong>CivicAI</strong>
            <span>COMMUNITY INTELLIGENCE</span>
          </div>
        </div>
      </motion.header>

      <section className="track-container">

        {/* ==========================================
            HEADING
        ========================================== */}

        <motion.div
          className="track-heading"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
        >
          <div className="track-eyebrow">
            <span className="track-live-dot" />
            COMPLAINT TRACKING
          </div>

          <h1>
            Track your <span>complaint.</span>
          </h1>

          <p>
            Enter your complaint ID to check the
            latest status and progress of your
            submitted complaint.
          </p>
        </motion.div>

        {/* ==========================================
            SEARCH CARD
        ========================================== */}

        <motion.section
          className="track-search-card"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
            duration: 0.45,
          }}
        >
          <div className="track-search-title">
            <div className="track-search-title-icon">
              <Search size={19} />
            </div>

            <div>
              <h2>Find your complaint</h2>

              <p>
                Enter the complaint ID provided
                after submission.
              </p>
            </div>
          </div>

          <div className="track-search-row">

            <div className="track-input-wrapper">
              <FileText size={17} />

              <input
                type="text"
                placeholder="Example: CMP-20260822-8107E3"
                value={complaintId}
                onChange={(e) => {
                  setComplaintId(e.target.value);
                  setError("");
                  setComplaint(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>

            <motion.button
              className="track-search-button"
              onClick={handleSearch}
              disabled={loading}
              whileHover={
                !loading
                  ? {
                      y: -2,
                    }
                  : {}
              }
              whileTap={
                !loading
                  ? {
                      scale: 0.98,
                    }
                  : {}
              }
            >
              <Search size={17} />

              {loading
                ? "Searching..."
                : "Track Complaint"}
            </motion.button>
          </div>

          {error && (
            <motion.div
              className="track-error"
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <AlertCircle size={17} />
              <span>{error}</span>
            </motion.div>
          )}
        </motion.section>

        {/* ==========================================
            RESULT
        ========================================== */}

        {complaint && (
          <motion.section
            className="track-result"
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
            }}
          >

            {/* RESULT HEADER */}

            <div className="track-result-header">

              <div className="track-result-heading">

                <div className="track-result-label">
                  <span />
                  COMPLAINT FOUND
                </div>

                <h2>
                  {complaint.title ||
                    "Community Complaint"}
                </h2>

                <p>
                  {complaint.complaint_id ||
                    complaint.id ||
                    "—"}
                </p>
              </div>

              <div
                className={`track-status-badge ${
                  isRejected
                    ? "track-status-rejected"
                    : isResolved
                    ? "track-status-resolved"
                    : isInProgress
                    ? "track-status-progress"
                    : "track-status-pending"
                }`}
              >
                <span />
                {getDisplayStatus()}
              </div>
            </div>

            {/* ==========================================
                DETAILS
            ========================================== */}

            <div className="track-details-grid">

              <div className="track-detail">
                <div className="track-detail-icon">
                  <MapPin size={17} />
                </div>

                <div>
                  <small>Location</small>
                  <strong>
                    {getLocation()}
                  </strong>
                </div>
              </div>

              <div className="track-detail">
                <div className="track-detail-icon">
                  <Building2 size={17} />
                </div>

                <div>
                  <small>Category</small>
                  <strong>
                    {complaint.category || "—"}
                  </strong>
                </div>
              </div>

              <div className="track-detail">
                <div className="track-detail-icon">
                  <CalendarDays size={17} />
                </div>

                <div>
                  <small>Submitted</small>
                  <strong>
                    {formatDate(
                      complaint.created_at
                    )}
                  </strong>
                </div>
              </div>

              <div className="track-detail">
                <div className="track-detail-icon priority-icon">
                  <BrainCircuit size={17} />
                </div>

                <div>
                  <small>AI Priority</small>

                  <strong
                    className={
                      complaint.priority
                        ? `priority-text ${String(
                            complaint.priority
                          ).toLowerCase()}`
                        : ""
                    }
                  >
                    {complaint.priority ||
                      "Medium"}
                  </strong>
                </div>
              </div>
            </div>

            {/* ==========================================
                DESCRIPTION
            ========================================== */}

            <div className="track-content-section">

              <div className="track-section-heading">

                <div className="track-section-icon">
                  <FileText size={18} />
                </div>

                <div>
                  <h3>
                    Complaint Details
                  </h3>

                  <p>
                    Description submitted by you
                  </p>
                </div>
              </div>

              <div className="track-description-box">
                <p>
                  {complaint.description ||
                    "No description available."}
                </p>
              </div>
            </div>

            {/* ==========================================
                PROGRESS
            ========================================== */}

            <div className="track-content-section">

              <div className="track-section-heading">

                <div className="track-section-icon">
                  <Clock3 size={18} />
                </div>

                <div>
                  <h3>
                    Complaint Progress
                  </h3>

                  <p>
                    {getStatusDescription()}
                  </p>
                </div>
              </div>

              <div className="track-timeline">

                {/* SUBMITTED */}

                <TimelineItem
                  active
                  completed
                  title="Complaint Submitted"
                  description="Your complaint was successfully submitted."
                  date={formatDateTime(
                    complaint.created_at
                  )}
                />

                {/* REVIEW */}

                <TimelineItem
                  active={
                    isPending ||
                    isInProgress ||
                    isResolved ||
                    isRejected
                  }
                  completed={
                    isInProgress ||
                    isResolved ||
                    isRejected
                  }
                  title="Complaint Under Review"
                  description={
                    isPending
                      ? "Your complaint has been received and is waiting for review."
                      : "Your complaint has been reviewed by the concerned department."
                  }
                />

                {/* IN PROGRESS */}

                <TimelineItem
                  active={
                    isInProgress ||
                    isResolved
                  }
                  completed={isResolved}
                  title="Assigned / In Progress"
                  description={
                    isInProgress ||
                    isResolved
                      ? "The complaint has been assigned to the concerned department."
                      : "Waiting for the complaint to be assigned."
                  }
                />

                {/* FINAL */}

                {isRejected ? (
                  <TimelineItem
                    active
                    completed
                    rejected
                    title="Complaint Rejected"
                    description="The complaint has been reviewed and rejected."
                  />
                ) : (
                  <TimelineItem
                    active={isResolved}
                    completed={isResolved}
                    title="Resolution"
                    description={
                      isResolved
                        ? "The complaint has been resolved successfully."
                        : "Waiting for the issue to be resolved."
                    }
                  />
                )}
              </div>
            </div>

            {/* BOTTOM ACTION */}

            <div className="track-result-footer">
              <button
                className="track-dashboard-button"
                onClick={() =>
                  navigate("user-dashboard")
                }
              >
                <ArrowLeft size={17} />
                Back to Dashboard
              </button>
            </div>
          </motion.section>
        )}

        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {!complaint &&
          !error &&
          !loading && (
            <motion.div
              className="track-empty"
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
            >
              <div className="track-empty-icon">
                <MapPin size={25} />
              </div>

              <h3>
                Track your complaint
              </h3>

              <p>
                Enter your complaint ID above to
                see its current status and
                progress.
              </p>
            </motion.div>
          )}

      </section>
    </main>
  );
}

/* ==========================================
   TIMELINE ITEM
========================================== */

function TimelineItem({
  active = false,
  completed = false,
  rejected = false,
  title,
  description,
  date,
}) {
  return (
    <div
      className={`timeline-item ${
        active ? "active" : ""
      } ${completed ? "completed" : ""} ${
        rejected ? "rejected" : ""
      }`}
    >

      <div className="timeline-marker">

        {rejected ? (
          <XCircle size={17} />
        ) : completed ? (
          <CheckCircle2 size={17} />
        ) : active ? (
          <Clock3 size={16} />
        ) : (
          <span />
        )}
      </div>

      <div className="timeline-content">

        <div className="timeline-title-row">

          <h4>{title}</h4>

          {date && (
            <span>{date}</span>
          )}
        </div>

        <p>{description}</p>
      </div>
    </div>
  );
}

export default TrackComplaint;