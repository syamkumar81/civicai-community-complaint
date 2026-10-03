import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

import {
  Bell,
  BrainCircuit,
  ChevronRight,
  FileText,
  Home,
  LogOut,
  MapPin,
  Plus,
  Settings,
  ShieldCheck,
  User,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Activity,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import "./UserDashboard.css";

function UserDashboard({ navigate }) {
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [userName, setUserName] = useState("Citizen");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoadingComplaints(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setComplaints([]);
        setUserName("Citizen");
        return;
      }

      const metadataName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Citizen";

      setUserName(metadataName);

      const {
        data: complaintData,
        error: complaintError,
      } = await supabase
        .from("complaints")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (complaintError) {
        console.error(complaintError);
        setComplaints([]);
        return;
      }

      setComplaints(
        Array.isArray(complaintData) ? complaintData : []
      );
    } catch (error) {
      console.error("Dashboard loading error:", error);
      setComplaints([]);
    } finally {
      setLoadingComplaints(false);
    }
  };

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalComplaints = complaints.length;

  const inProgressComplaints = complaints.filter(
    (complaint) =>
      String(complaint.status || "")
        .toLowerCase()
        .replace(/_/g, " ") === "in progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) =>
      String(complaint.status || "")
        .toLowerCase() === "resolved"
  ).length;

  const pendingComplaints = complaints.filter(
    (complaint) =>
      String(complaint.status || "")
        .toLowerCase() === "pending"
  ).length;

  const highPriorityComplaints = complaints.filter(
    (complaint) =>
      String(complaint.priority || "")
        .toLowerCase() === "high"
  ).length;

  const mediumPriorityComplaints = complaints.filter(
    (complaint) =>
      String(complaint.priority || "")
        .toLowerCase() === "medium"
  ).length;

  const lowPriorityComplaints = complaints.filter(
    (complaint) =>
      String(complaint.priority || "")
        .toLowerCase() === "low"
  ).length;

  const resolvedPercentage =
    totalComplaints > 0
      ? Math.round((resolvedComplaints / totalComplaints) * 100)
      : 0;

  const progressPercentage =
    totalComplaints > 0
      ? Math.round((inProgressComplaints / totalComplaints) * 100)
      : 0;

  const pendingPercentage =
    totalComplaints > 0
      ? Math.round((pendingComplaints / totalComplaints) * 100)
      : 0;

  // ==========================================================
  // DONUT CHART
  // ==========================================================

  const resolvedAngle =
    totalComplaints > 0
      ? (resolvedComplaints / totalComplaints) * 360
      : 0;

  const progressAngle =
    totalComplaints > 0
      ? (inProgressComplaints / totalComplaints) * 360
      : 0;

  const donutStyle = {
    background:
      totalComplaints > 0
        ? `conic-gradient(
            #10b981 0deg ${resolvedAngle}deg,
            #38bdf8 ${resolvedAngle}deg ${resolvedAngle + progressAngle}deg,
            #f59e0b ${resolvedAngle + progressAngle}deg 360deg
          )`
        : "#0f2038",
  };

  // ==========================================================
  // DATE & GREETING
  // ==========================================================

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = today.getHours();

  const greeting =
    time < 12
      ? "Good morning"
      : time < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <main className="civic-dash-page">
      {/* BACKGROUND ATMOSPHERE */}
      <div className="civic-dash-bg">
        <div className="civic-dash-gradient-mesh" />
        <div className="civic-dash-grid" />
        <div className="civic-dash-orb-1" />
        <div className="civic-dash-orb-2" />
      </div>

      {/* ======================================================
          FLOATING SIDEBAR
      ====================================================== */}
      <aside className={`civic-dash-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* BRAND */}
        <div className="civic-sidebar-brand">
          <motion.div
            className="civic-sidebar-logo"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <BrainCircuit size={24} />
          </motion.div>

          <div className="civic-sidebar-brand-text">
            <strong>CivicAI</strong>
            <span>CITIZEN PORTAL</span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="civic-sidebar-nav">
          <motion.button
            className="civic-nav-link active"
            whileHover={{ x: 4 }}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </motion.button>

          <motion.button
            className="civic-nav-link"
            onClick={() => {
              setSidebarOpen(false);
              navigate("complaints");
            }}
            whileHover={{ x: 4 }}
          >
            <FileText size={18} />
            <span>My Complaints</span>
          </motion.button>

          <motion.button
            className="civic-nav-link"
            onClick={() => {
              setSidebarOpen(false);
              navigate("report-complaint");
            }}
            whileHover={{ x: 4 }}
          >
            <Plus size={18} />
            <span>Report Problem</span>
          </motion.button>

          <motion.button
            className="civic-nav-link"
            onClick={() => {
              setSidebarOpen(false);
              navigate("track");
            }}
            whileHover={{ x: 4 }}
          >
            <MapPin size={18} />
            <span>Track Complaint</span>
          </motion.button>

          <motion.button
            className="civic-nav-link"
            onClick={() => {
              setSidebarOpen(false);
              navigate("profile");
            }}
            whileHover={{ x: 4 }}
          >
            <User size={18} />
            <span>Profile</span>
          </motion.button>
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="civic-sidebar-bottom">
          <div className="civic-assist-widget">
            <div className="civic-assist-badge">
              <Sparkles size={13} />
              <span>CivicAI Copilot</span>
            </div>
            <p>Smart civic resolution assistant ready to help.</p>
            <button
              className="civic-assist-btn"
              onClick={() => {
                setSidebarOpen(false);
                navigate("report-complaint");
              }}
            >
              <Plus size={13} />
              Report an Issue
            </button>
          </div>

          <motion.button
            className="civic-nav-link"
            onClick={() => {
              setSidebarOpen(false);
              navigate("settings");
            }}
            whileHover={{ x: 4 }}
          >
            <Settings size={18} />
            <span>Settings</span>
          </motion.button>

          <motion.button
            className="civic-logout-btn"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("login");
            }}
            whileHover={{ x: 4 }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </motion.button>
        </div>
      </aside>

      {/* ======================================================
          MAIN CONTENT AREA
      ====================================================== */}
      <section className="civic-dash-main">
        {/* ====================================================
            TOPBAR HEADER
        ==================================================== */}
        <header className="civic-dash-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              className="civic-mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="civic-dash-greeting">
              <div className="civic-telemetry-badge">
                <span className="civic-pulse-dot" />
                <span>Neural Dispatch Active · Real-time Civic Telemetry</span>
              </div>

              <h1>
                {greeting},{" "}
                <span className="civic-greeting-name">{userName}!</span>
              </h1>

              <p>Welcome to your AI-powered municipal community dashboard.</p>
            </div>
          </div>

          <div className="civic-dash-top-actions">
            <div className="civic-date-chip">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>

            <motion.button
              className="civic-report-cta-btn"
              onClick={() => navigate("report-complaint")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={16} />
              <span>Report a Problem</span>
            </motion.button>

            <div
              className="civic-user-pill-btn"
              onClick={() => navigate("profile")}
            >
              <div className="civic-user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="civic-user-info">
                <span className="civic-user-name">{userName}</span>
                <span className="civic-user-role">Citizen Account</span>
              </div>
              <ChevronRight size={14} color="#64748b" />
            </div>
          </div>
        </header>

        {/* ====================================================
            STAT CARDS (4 CARDS)
        ==================================================== */}
        <section className="civic-stats-grid">
          {/* TOTAL */}
          <motion.div
            className="civic-stat-card stat-cyan"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4, scale: 1.015 }}
          >
            <div className="civic-stat-top">
              <div className="civic-stat-icon-wrap">
                <FileText size={22} />
              </div>
              <span className="civic-stat-badge">Total</span>
            </div>

            <div className="civic-stat-metric-row">
              <span className="civic-stat-title">Total Complaints</span>
              <span className="civic-stat-number">{totalComplaints}</span>
            </div>

            <div className="civic-stat-footer">
              <TrendingUp size={12} color="#38bdf8" />
              <span>All submitted citizen issues</span>
            </div>
          </motion.div>

          {/* IN PROGRESS */}
          <motion.div
            className="civic-stat-card stat-amber"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4, scale: 1.015 }}
          >
            <div className="civic-stat-top">
              <div className="civic-stat-icon-wrap">
                <Clock3 size={22} />
              </div>
              <span className="civic-stat-badge">Active</span>
            </div>

            <div className="civic-stat-metric-row">
              <span className="civic-stat-title">In Progress</span>
              <span className="civic-stat-number">{inProgressComplaints}</span>
            </div>

            <div className="civic-stat-footer">
              <Activity size={12} color="#f59e0b" />
              <span>Field teams currently assigned</span>
            </div>
          </motion.div>

          {/* RESOLVED */}
          <motion.div
            className="civic-stat-card stat-emerald"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4, scale: 1.015 }}
          >
            <div className="civic-stat-top">
              <div className="civic-stat-icon-wrap">
                <CheckCircle2 size={22} />
              </div>
              <span className="civic-stat-badge">{resolvedPercentage}% Rate</span>
            </div>

            <div className="civic-stat-metric-row">
              <span className="civic-stat-title">Resolved</span>
              <span className="civic-stat-number">{resolvedComplaints}</span>
            </div>

            <div className="civic-stat-footer">
              <ShieldCheck size={12} color="#10b981" />
              <span>Successfully closed complaints</span>
            </div>
          </motion.div>

          {/* HIGH PRIORITY */}
          <motion.div
            className="civic-stat-card stat-rose"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -4, scale: 1.015 }}
          >
            <div className="civic-stat-top">
              <div className="civic-stat-icon-wrap">
                <AlertTriangle size={22} />
              </div>
              <span className="civic-stat-badge">Urgent</span>
            </div>

            <div className="civic-stat-metric-row">
              <span className="civic-stat-title">High Priority</span>
              <span className="civic-stat-number">{highPriorityComplaints}</span>
            </div>

            <div className="civic-stat-footer">
              <span style={{ color: "#fb7185" }}>●</span>
              <span>Requires expedited response</span>
            </div>
          </motion.div>
        </section>

        {/* ====================================================
            MIDDLE GRID: ANALYTICS & AI INSIGHTS
        ==================================================== */}
        <section className="civic-dash-middle-grid">
          {/* COMPLAINT STATUS BREAKDOWN */}
          <motion.div
            className="civic-dash-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="civic-panel-header">
              <div className="civic-panel-title-wrap">
                <div className="civic-panel-icon">
                  <BarChart3 size={17} />
                </div>
                <h3>Status Distribution</h3>
              </div>

              <span className="civic-panel-filter-pill">Current Overview</span>
            </div>

            <div className="civic-donut-layout">
              {/* DONUT */}
              <div className="civic-donut-container">
                <div className="civic-donut-circle" style={donutStyle}>
                  <div className="civic-donut-hole">
                    <span className="civic-donut-total">{totalComplaints}</span>
                    <span className="civic-donut-sub">Total</span>
                  </div>
                </div>
              </div>

              {/* LEGEND */}
              <div className="civic-status-legend-col">
                <div className="civic-legend-item">
                  <div className="civic-legend-left">
                    <span className="civic-legend-marker marker-resolved" />
                    <span>Resolved</span>
                  </div>
                  <div className="civic-legend-right">
                    <span className="civic-legend-count">{resolvedComplaints}</span>
                    <span className="civic-legend-pct">{resolvedPercentage}%</span>
                  </div>
                </div>

                <div className="civic-legend-item">
                  <div className="civic-legend-left">
                    <span className="civic-legend-marker marker-progress" />
                    <span>In Progress</span>
                  </div>
                  <div className="civic-legend-right">
                    <span className="civic-legend-count">{inProgressComplaints}</span>
                    <span className="civic-legend-pct">{progressPercentage}%</span>
                  </div>
                </div>

                <div className="civic-legend-item">
                  <div className="civic-legend-left">
                    <span className="civic-legend-marker marker-pending" />
                    <span>Pending</span>
                  </div>
                  <div className="civic-legend-right">
                    <span className="civic-legend-count">{pendingComplaints}</span>
                    <span className="civic-legend-pct">{pendingPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="civic-panel-insight-banner">
              <TrendingUp size={15} />
              <span>
                {resolvedPercentage >= 50
                  ? "Positive resolution rate trending above municipal targets."
                  : "Field response teams are addressing active tickets."}
              </span>
            </div>
          </motion.div>

          {/* AI PRIORITY INSIGHTS */}
          <motion.div
            className="civic-dash-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="civic-panel-header">
              <div className="civic-panel-title-wrap">
                <div className="civic-panel-icon" style={{ color: "#818cf8" }}>
                  <BrainCircuit size={18} />
                </div>
                <h3>AI Priority Triage</h3>
              </div>

              <span className="civic-panel-filter-pill">NLP Diagnostic</span>
            </div>

            <div className="civic-ai-banner">
              <div className="civic-ai-icon-pulse">
                <Sparkles size={18} />
              </div>
              <div className="civic-ai-banner-text">
                <strong>Automated AI Routing</strong>
                <p>
                  Issues are classified using natural language understanding and
                  dispatched based on emergency severity.
                </p>
              </div>
            </div>

            <div className="civic-priority-list">
              {/* HIGH */}
              <div className="civic-priority-item">
                <div className="civic-priority-row-top">
                  <div className="civic-priority-label-left">
                    <span className="civic-priority-dot-ring dot-high" />
                    <span>High Priority</span>
                  </div>
                  <span className="civic-priority-val">
                    {highPriorityComplaints} Issues
                  </span>
                </div>
                <div className="civic-priority-bar-track">
                  <div
                    className="civic-priority-bar-fill fill-high"
                    style={{
                      width: `${
                        totalComplaints > 0
                          ? (highPriorityComplaints / totalComplaints) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* MEDIUM */}
              <div className="civic-priority-item">
                <div className="civic-priority-row-top">
                  <div className="civic-priority-label-left">
                    <span className="civic-priority-dot-ring dot-medium" />
                    <span>Medium Priority</span>
                  </div>
                  <span className="civic-priority-val">
                    {mediumPriorityComplaints} Issues
                  </span>
                </div>
                <div className="civic-priority-bar-track">
                  <div
                    className="civic-priority-bar-fill fill-medium"
                    style={{
                      width: `${
                        totalComplaints > 0
                          ? (mediumPriorityComplaints / totalComplaints) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* LOW */}
              <div className="civic-priority-item">
                <div className="civic-priority-row-top">
                  <div className="civic-priority-label-left">
                    <span className="civic-priority-dot-ring dot-low" />
                    <span>Low Priority</span>
                  </div>
                  <span className="civic-priority-val">
                    {lowPriorityComplaints} Issues
                  </span>
                </div>
                <div className="civic-priority-bar-track">
                  <div
                    className="civic-priority-bar-fill fill-low"
                    style={{
                      width: `${
                        totalComplaints > 0
                          ? (lowPriorityComplaints / totalComplaints) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ====================================================
            RECENT COMPLAINTS SECTION
        ==================================================== */}
        <motion.section
          className="civic-recent-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="civic-panel-header">
            <div className="civic-panel-title-wrap">
              <div className="civic-panel-icon">
                <Layers size={17} />
              </div>
              <h3>Recent Complaints</h3>
            </div>

            <motion.button
              className="civic-track-btn"
              onClick={() => navigate("complaints")}
              whileHover={{ x: 2 }}
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </motion.button>
          </div>

          <div className="civic-table-responsive">
            {loadingComplaints ? (
              <div className="civic-empty-state">
                <div className="civic-empty-icon-pulse">
                  <Clock3 size={28} />
                </div>
                <strong>Loading Complaints...</strong>
                <p>Retrieving your municipal tickets from the database.</p>
              </div>
            ) : complaints.length === 0 ? (
              <div className="civic-empty-state">
                <div className="civic-empty-icon-pulse">
                  <FileText size={28} />
                </div>
                <strong>No Complaints Filed Yet</strong>
                <p>
                  You haven't reported any community problems yet. Use the button
                  below to submit your first civic issue.
                </p>
                <button
                  className="civic-report-cta-btn"
                  style={{ marginTop: "8px" }}
                  onClick={() => navigate("report-complaint")}
                >
                  <Plus size={15} />
                  <span>Report an Issue</span>
                </button>
              </div>
            ) : (
              <table className="civic-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title & Description</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {complaints.slice(0, 5).map((complaint, index) => {
                    const priority = String(
                      complaint.priority || "Medium"
                    ).toLowerCase();
                    const status = String(
                      complaint.status || "Submitted"
                    ).toLowerCase();
                    const date = complaint.created_at
                      ? new Date(complaint.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "—";

                    return (
                      <motion.tr
                        key={
                          complaint.id ||
                          complaint.complaint_id ||
                          index
                        }
                        className="civic-table-row"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 + index * 0.05 }}
                      >
                        <td>
                          <span className="civic-id-chip">
                            {complaint.complaint_id ||
                              complaint.id?.slice(0, 8) ||
                              `CMP-${index + 1}`}
                          </span>
                        </td>

                        <td className="civic-title-cell">
                          <strong>
                            {complaint.title ||
                              complaint.complaint_title ||
                              "Community Issue"}
                          </strong>
                        </td>

                        <td>
                          <span className="civic-cat-pill">
                            {complaint.category || "General"}
                          </span>
                        </td>

                        <td>
                          <div className="civic-location-cell">
                            <MapPin size={13} />
                            <span>
                              {complaint.village ||
                                complaint.city ||
                                complaint.district ||
                                "Not specified"}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`civic-pill ${
                              priority === "high"
                                ? "pill-high"
                                : priority === "low"
                                ? "pill-low"
                                : "pill-medium"
                            }`}
                          >
                            {complaint.priority || "Medium"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`civic-pill ${
                              status === "resolved"
                                ? "pill-resolved"
                                : status.includes("progress")
                                ? "pill-progress"
                                : "pill-pending"
                            }`}
                          >
                            {complaint.status || "Submitted"}
                          </span>
                        </td>

                        <td style={{ color: "#94a3b8", fontSize: "11.5px" }}>
                          {date}
                        </td>

                        <td>
                          <button
                            className="civic-track-btn"
                            onClick={() => navigate("track")}
                          >
                            <span>Track</span>
                            <ArrowRight size={12} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.section>

        {/* ====================================================
            DASHBOARD FOOTER
        ==================================================== */}
        <footer className="civic-dash-footer">
          <span>© 2026 CivicAI · Smart Civic Services Portal</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={14} color="#10b981" />
            256-Bit Encrypted Municipal Intelligence
          </span>
        </footer>
      </section>
    </main>
  );
}

export default UserDashboard;