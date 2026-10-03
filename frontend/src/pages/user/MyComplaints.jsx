import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";

import {
  ArrowLeft,
  Search,
  Filter,
  FileText,
  MapPin,
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  UserRound,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

function MyComplaints({ navigate }) {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH COMPLAINTS
  // =========================================================

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      // Get logged-in Supabase user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        setComplaints([]);
        setError("You are not logged in.");
        return;
      }

      // -----------------------------------------------------
      // FASTAPI
      // -----------------------------------------------------

      const response = await fetch(
        `https://civicai-community-complaint.onrender.com/complaints/?user_id=${encodeURIComponent(
          user.id
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const data = await response.json();

      const allComplaints = Array.isArray(data.complaints)
        ? data.complaints
        : [];

      // -----------------------------------------------------
      // EXTRA USER PROTECTION
      // -----------------------------------------------------

      const hasUserIdField = allComplaints.some(
        (complaint) =>
          complaint.user_id !== undefined ||
          complaint.userId !== undefined ||
          complaint.created_by !== undefined ||
          complaint.created_by_user_id !== undefined
      );

      if (hasUserIdField) {
        const userComplaints = allComplaints.filter(
          (complaint) => {
            const complaintUserId =
              complaint.user_id ||
              complaint.userId ||
              complaint.created_by ||
              complaint.created_by_user_id;

            return complaintUserId === user.id;
          }
        );

        setComplaints(userComplaints);
      } else {
        // Backend already filtered by user_id
        setComplaints(allComplaints);
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);

      setError(
        "Unable to load complaints. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // NORMALIZE STATUS
  // =========================================================

  const normalizeStatus = (status) => {
    const value = String(status || "")
      .trim()
      .toLowerCase();

    if (value === "in progress") return "In Progress";
    if (value === "resolved") return "Resolved";
    if (value === "pending") return "Pending";
    if (value === "submitted") return "Submitted";

    return "Submitted";
  };

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredComplaints = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const complaintId = String(
        complaint.complaint_id ||
          complaint.id ||
          ""
      ).toLowerCase();

      const title = String(
        complaint.title ||
          complaint.complaint_title ||
          ""
      ).toLowerCase();

      const category = String(
        complaint.category || ""
      ).toLowerCase();

      const description = String(
        complaint.description || ""
      ).toLowerCase();

      const matchesSearch =
        !searchText ||
        complaintId.includes(searchText) ||
        title.includes(searchText) ||
        category.includes(searchText) ||
        description.includes(searchText);

      const status = normalizeStatus(
        complaint.status
      );

      const matchesFilter =
        filter === "All" || status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [complaints, search, filter]);

  // =========================================================
  // COUNTS
  // =========================================================

  const totalComplaints = complaints.length;

  const inProgressCount = complaints.filter(
    (complaint) =>
      normalizeStatus(complaint.status) ===
      "In Progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) =>
      normalizeStatus(complaint.status) ===
      "Resolved"
  ).length;

  const highPriorityCount = complaints.filter(
    (complaint) =>
      String(
        complaint.priority || ""
      ).toLowerCase() === "high"
  ).length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="my-complaints-page">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="my-complaints-background">
        <div className="my-complaints-glow glow-one" />
        <div className="my-complaints-glow glow-two" />
        <div className="my-complaints-grid" />
      </div>

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="my-complaints-topbar">

        <motion.button
          className="back-dashboard-button"
          onClick={() =>
            navigate("user-dashboard")
          }
          whileHover={{
            x: -3,
          }}
          whileTap={{
            scale: 0.97,
          }}
        >
          <ArrowLeft size={17} />
          <span>Back to Dashboard</span>
        </motion.button>

        <div className="my-complaints-account">
          <div className="account-icon">
            <UserRound size={17} />
          </div>

          <span>Citizen Account</span>
        </div>

      </header>

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <section className="my-complaints-container">

        {/* ===================================================
            HEADING
        =================================================== */}

        <motion.div
          className="my-complaints-heading"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
        >
          <h1>
            My <span>complaints.</span>
          </h1>

          <p>
            View and track all the community problems
            you have reported through CivicAI.
          </p>
        </motion.div>

        {/* ===================================================
            SUMMARY CARDS
        =================================================== */}

        <section className="my-complaints-summary">

          <SummaryCard
            type="blue"
            icon={<FileText size={22} />}
            label="Total Complaints"
            value={totalComplaints}
            description="All complaints you've reported"
          />

          <SummaryCard
            type="orange"
            icon={<Clock3 size={22} />}
            label="In Progress"
            value={inProgressCount}
            description="Currently being worked on"
          />

          <SummaryCard
            type="green"
            icon={<CheckCircle2 size={22} />}
            label="Resolved"
            value={resolvedCount}
            description="Successfully resolved"
          />

          <SummaryCard
            type="red"
            icon={<AlertCircle size={22} />}
            label="High Priority"
            value={highPriorityCount}
            description="Require immediate attention"
          />

        </section>

        {/* ===================================================
            SEARCH / FILTER
        =================================================== */}

        <motion.section
          className="complaints-toolbar"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
        >

          <div className="complaints-search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="filter-label">
            Filter by:
          </div>

          <div className="status-select-wrapper">
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
            >
              <option value="All">
                All Status
              </option>

              <option value="Submitted">
                Submitted
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Resolved">
                Resolved
              </option>
            </select>

            <ChevronRight
              size={16}
              className="select-arrow"
            />
          </div>

          <div className="filter-tabs">

            {[
              "All",
              "Submitted",
              "In Progress",
              "Resolved",
            ].map((item) => (
              <button
                key={item}
                className={
                  filter === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(item)
                }
              >
                {item}
              </button>
            ))}

          </div>

          <button
            className="filter-icon-button"
            title="Filter complaints"
          >
            <Filter size={18} />
          </button>

        </motion.section>

        {/* ===================================================
            RESULTS
        =================================================== */}

        <div className="complaints-results">

          <AnimatePresence mode="popLayout">

            {loading ? (

              <motion.div
                className="complaints-message"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
              >
                <Clock3 size={28} />

                <h3>
                  Loading complaints...
                </h3>

                <p>
                  Fetching your complaints from CivicAI.
                </p>
              </motion.div>

            ) : error ? (

              <motion.div
                className="complaints-message error"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
              >
                <AlertCircle size={30} />

                <h3>
                  Unable to load complaints
                </h3>

                <p>{error}</p>

                <button
                  className="try-again-button"
                  onClick={fetchComplaints}
                >
                  Try Again
                </button>
              </motion.div>

            ) : filteredComplaints.length === 0 ? (

              <motion.div
                className="complaints-message"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
              >
                <FileText size={30} />

                <h3>
                  No complaints found
                </h3>

                <p>
                  {complaints.length === 0
                    ? "You have not submitted any complaints yet."
                    : "Try changing your search or filter."}
                </p>
              </motion.div>

            ) : (

              filteredComplaints.map(
                (complaint, index) => (
                  <ComplaintCard
                    key={
                      complaint.id ||
                      complaint.complaint_id ||
                      index
                    }
                    complaint={complaint}
                    index={index}
                    navigate={navigate}
                  />
                )
              )

            )}

          </AnimatePresence>

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        {!loading &&
          !error &&
          filteredComplaints.length > 0 && (
            <div className="complaints-footer">

              <span>
                Showing 1 to{" "}
                {filteredComplaints.length}{" "}
                of {filteredComplaints.length}{" "}
                complaints
              </span>

              <div className="pagination">

                <button disabled>
                  <ArrowLeft size={16} />
                </button>

                <button className="current">
                  1
                </button>

                <button disabled>
                  <ChevronRight size={16} />
                </button>

              </div>

            </div>
          )}

      </section>
    </main>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  type,
  icon,
  label,
  value,
  description,
}) {
  return (
    <motion.div
      className={`summary-card ${type}`}
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
    >
      <div className="summary-card-content">

        <div className="summary-icon">
          {icon}
        </div>

        <div className="summary-text">

          <span className="summary-label">
            {label}
          </span>

          <strong className="summary-value">
            {String(value).padStart(2, "0")}
          </strong>

          <span className="summary-description">
            {description}
          </span>

        </div>

      </div>

      <div className="summary-progress" />

    </motion.div>
  );
}

// ============================================================
// COMPLAINT CARD
// ============================================================

function ComplaintCard({
  complaint,
  index,
  navigate,
}) {
  const status = normalizeStatusValue(
    complaint.status
  );

  const priority =
    complaint.priority || "Medium";

  const priorityClass = String(priority)
    .toLowerCase()
    .replace(/\s+/g, "-");

  const statusClass = String(status)
    .toLowerCase()
    .replace(/\s+/g, "-");

  // ----------------------------------------------------------
  // LOCATION
  // ----------------------------------------------------------

  const location = [
    complaint.village,
    complaint.city,
    complaint.district,
    complaint.state,
  ]
    .filter(Boolean)
    .join(", ");

  // ----------------------------------------------------------
  // DATE
  // ----------------------------------------------------------

  const dateValue =
    complaint.created_at ||
    complaint.createdAt;

  const formattedDate = dateValue
    ? new Date(dateValue).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "Date unavailable";

  const formattedTime = dateValue
    ? new Date(dateValue).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      )
    : "";

  // ----------------------------------------------------------
  // TITLE
  // ----------------------------------------------------------

  const title =
    complaint.title ||
    complaint.complaint_title ||
    "Community Complaint";

  // ----------------------------------------------------------
  // DESCRIPTION
  // ----------------------------------------------------------

  const description =
    complaint.description ||
    complaint.details ||
    "No description provided.";

  return (
    <motion.article
      className="complaint-card-new"
      layout
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -10,
      }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
      }}
    >

      {/* =====================================================
          LEFT CONTENT
      ===================================================== */}

      <div className="complaint-left">

        <div className="complaint-file-icon">
          <FileText size={23} />
        </div>

        <div className="complaint-information">

          <div className="complaint-id-row">

            <span className="complaint-id">
              {complaint.complaint_id ||
                complaint.id ||
                "CMP-000000"}
            </span>

            <span
              className={`priority-label ${priorityClass}`}
            >
              {priority} Priority
            </span>

          </div>

          <h2>{title}</h2>

          <div className="complaint-category">
            <FileText size={14} />
            <span>
              {complaint.category ||
                "General Complaint"}
            </span>
          </div>

          <div className="complaint-details-row">

            <span>
              <MapPin size={15} />

              {location ||
                "Location unavailable"}
            </span>

            <span>
              <CalendarDays size={15} />

              {formattedDate}
            </span>

          </div>

          <p className="complaint-description">
            {description}
          </p>

          {status === "Resolved" && (
            <div className="resolved-message">
              <CheckCircle2 size={17} />

              <span>
                This complaint has been resolved.
                Thank you for helping make the
                community better!
              </span>
            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          RIGHT STATUS SECTION
      ===================================================== */}

      <div className="complaint-right">

        <div className="complaint-right-top">

          <StatusBadge status={status} />

          <button
            className="complaint-details-button"
            onClick={() =>
              navigate("track")
            }
          >
            <span>View Details</span>
            <ChevronRight size={17} />
          </button>

        </div>

        <div className="complaint-timeline">

          <TimelineItem
            active={true}
            color="blue"
            title="Submitted"
            date={formattedDate}
            time={formattedTime}
          />

          {status === "In Progress" && (
            <TimelineItem
              active={true}
              color="orange"
              title="In Progress"
              date="Currently being worked on"
            />
          )}

          {status === "Resolved" && (
            <TimelineItem
              active={true}
              color="green"
              title="Resolved"
              date={formattedDate}
              time={formattedTime}
            />
          )}

          {status === "Submitted" && (
            <TimelineItem
              active={false}
              color="gray"
              title="Awaiting review"
              date="Awaiting review by"
              subtext="concerned authority"
            />
          )}

        </div>

      </div>

    </motion.article>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({ status }) {
  const className = String(status)
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <div
      className={`new-status-badge ${className}`}
    >
      {status}
    </div>
  );
}

// ============================================================
// TIMELINE ITEM
// ============================================================

function TimelineItem({
  active,
  color,
  title,
  date,
  time,
  subtext,
}) {
  return (
    <div
      className={`timeline-item ${color} ${
        active ? "active" : ""
      }`}
    >

      <div className="timeline-dot" />

      <div className="timeline-content">

        <strong>{title}</strong>

        {date && (
          <span>{date}</span>
        )}

        {time && (
          <span>{time}</span>
        )}

        {subtext && (
          <span>{subtext}</span>
        )}

      </div>

    </div>
  );
}

// ============================================================
// STATUS NORMALIZER
// ============================================================

function normalizeStatusValue(status) {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  if (value === "in progress") {
    return "In Progress";
  }

  if (value === "resolved") {
    return "Resolved";
  }

  if (value === "pending") {
    return "Pending";
  }

  return "Submitted";
}

export default MyComplaints;