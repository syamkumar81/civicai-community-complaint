import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users as UsersIcon,
  Zap,
  Calendar,
  Layers,
  MapPin,
  ArrowRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";
import "./AdminPages.css";
import "../user/UserDashboard.css";
import AdminSidebar from "./AdminSidebar";
import { getCached, setCached } from "./adminCache";

function AdminDashboard({ navigate }) {
  const cachedAnalytics = getCached("analytics");
  const cachedComplaints = getCached("complaints");

  const [analytics, setAnalytics] = useState(cachedAnalytics);
  const [complaints, setComplaints] = useState(cachedComplaints || []);
  const [isLoading, setIsLoading] = useState(!cachedAnalytics || !cachedComplaints);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminInfo = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("civicai_admin") || "{}"
      );
    } catch {
      return {};
    }
  }, []);

  const adminName = adminInfo.name || "Administrator";

  const getAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token;
  };

  const fetchDashboard = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else if (!cachedAnalytics || !cachedComplaints) {
      setIsLoading(true);
    }

    setError("");

    try {
      const token = await getAccessToken();

      if (!token) {
        navigate("admin-login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [analyticsResponse, complaintsResponse] = await Promise.all([
        fetch("https://civicai-community-complaint.onrender.com/admin/analytics", { headers }),
        fetch("https://civicai-community-complaint.onrender.com/admin/complaints", { headers }),
      ]);

      if (
        analyticsResponse.status === 401 ||
        analyticsResponse.status === 403 ||
        complaintsResponse.status === 401 ||
        complaintsResponse.status === 403
      ) {
        await supabase.auth.signOut();
        localStorage.removeItem("civicai_admin");
        localStorage.removeItem("civicai_is_admin");
        localStorage.removeItem("civicai_logged_in");
        navigate("admin-login");
        return;
      }

      if (!analyticsResponse.ok || !complaintsResponse.ok) {
        throw new Error("Failed to load dashboard data.");
      }

      const analyticsData = await analyticsResponse.json();
      const complaintsData = await complaintsResponse.json();

      setAnalytics(analyticsData);
      setComplaints(complaintsData?.complaints || []);
      setCached("analytics", analyticsData);
      setCached("complaints", complaintsData?.complaints || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("civicai_admin");
    localStorage.removeItem("civicai_is_admin");
    localStorage.removeItem("civicai_logged_in");
    navigate("admin-login");
  };

  // Metrics
  const total = Number(analytics?.total_complaints) || 0;
  const statusData = analytics?.by_status || {};
  const priorityData = analytics?.by_priority || {};

  const pending =
    (Number(statusData.Submitted) || 0) +
    (Number(statusData["In Progress"]) || 0) +
    (Number(statusData.Pending) || 0);

  const resolved =
    Number(statusData.Resolved) || Number(statusData.resolved) || 0;

  const highPriority =
    Number(priorityData.High) || Number(priorityData.high) || 0;

  const mediumPriority =
    Number(priorityData.Medium) || Number(priorityData.medium) || 0;

  const lowPriority =
    Number(priorityData.Low) || Number(priorityData.low) || 0;

  const resolvedPercentage =
    total > 0 ? Math.round((resolved / total) * 100) : 0;

  const resolvedAngle = total > 0 ? (resolved / total) * 360 : 0;
  const pendingAngle = total > 0 ? (pending / total) * 360 : 0;

  const donutStyle = {
    background:
      total > 0
        ? `conic-gradient(
            #10b981 0deg ${resolvedAngle}deg,
            #38bdf8 ${resolvedAngle}deg ${resolvedAngle + pendingAngle}deg,
            #0f2038 ${resolvedAngle + pendingAngle}deg 360deg
          )`
        : "#0f2038",
  };

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <main className="civic-admin-page">
      {/* BACKGROUND ATMOSPHERE */}
      <div className="civic-admin-bg">
        <div className="civic-admin-mesh" />
        <div className="civic-admin-grid" />
        <div className="civic-admin-orb-1" />
        <div className="civic-admin-orb-2" />
      </div>

      {/* SHARED UNIFIED SIDEBAR */}
      <AdminSidebar
        activePage="dashboard"
        navigate={navigate}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN DASHBOARD */}
      <section className="civic-admin-main">
        <header className="civic-admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              className="civic-mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="civic-admin-greeting">
              <div className="civic-admin-telemetry-badge">
                <span className="civic-admin-pulse-dot" />
                <span>Municipal Command Center · Real-time Dispatch Active</span>
              </div>

              <h1>
                Welcome back,{" "}
                <span className="civic-greeting-name">{adminName}</span>
              </h1>
              <p>Overview of community complaints, triage queues, and diagnostics.</p>
            </div>
          </div>

          <div className="civic-admin-top-actions">
            <div className="civic-date-chip">
              <Calendar size={14} />
              <span>{currentDate}</span>
            </div>

            <motion.button
              className="civic-refresh-btn"
              onClick={() => fetchDashboard(true)}
              disabled={isRefreshing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? "civic-spin" : ""}
                style={{
                  animation: isRefreshing ? "civicSpin 0.8s linear infinite" : "none",
                }}
              />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </motion.button>

            <div className="civic-admin-profile-pill">
              <div className="civic-admin-avatar">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className="civic-user-info">
                <span className="civic-user-name">{adminName}</span>
                <span className="civic-user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* 4 STAT CARDS */}
        <section className="civic-admin-stats-grid">
          {/* TOTAL */}
          <motion.div
            className="civic-admin-stat-card stat-cyan"
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
              <span className="civic-stat-number">{total}</span>
            </div>
            <div className="civic-stat-footer">
              <TrendingUp size={12} color="#38bdf8" />
              <span>All recorded municipal reports</span>
            </div>
          </motion.div>

          {/* ACTIVE / PENDING */}
          <motion.div
            className="civic-admin-stat-card stat-amber"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4, scale: 1.015 }}
          >
            <div className="civic-stat-top">
              <div className="civic-stat-icon-wrap">
                <Clock3 size={22} />
              </div>
              <span className="civic-stat-badge">Active Queue</span>
            </div>
            <div className="civic-stat-metric-row">
              <span className="civic-stat-title">In Progress & Pending</span>
              <span className="civic-stat-number">{pending}</span>
            </div>
            <div className="civic-stat-footer">
              <Activity size={12} color="#f59e0b" />
              <span>Assigned or waiting for triage</span>
            </div>
          </motion.div>

          {/* RESOLVED */}
          <motion.div
            className="civic-admin-stat-card stat-emerald"
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
              <span className="civic-stat-number">{resolved}</span>
            </div>
            <div className="civic-stat-footer">
              <ShieldCheck size={12} color="#10b981" />
              <span>Completed municipal actions</span>
            </div>
          </motion.div>

          {/* HIGH PRIORITY */}
          <motion.div
            className="civic-admin-stat-card stat-rose"
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
              <span className="civic-stat-number">{highPriority}</span>
            </div>
            <div className="civic-stat-footer">
              <span style={{ color: "#fb7185" }}>●</span>
              <span>Requires immediate field attention</span>
            </div>
          </motion.div>
        </section>

        {/* MIDDLE GRID: DISTRIBUTION & PRIORITY */}
        <section className="civic-dash-middle-grid">
          {/* STATUS BREAKDOWN */}
          <motion.div
            className="civic-admin-panel"
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
              <span className="civic-panel-filter-pill">Overview</span>
            </div>

            <div className="civic-donut-layout">
              <div className="civic-donut-container">
                <div className="civic-donut-circle" style={donutStyle}>
                  <div className="civic-donut-hole">
                    <span className="civic-donut-total">{total}</span>
                    <span className="civic-donut-sub">Total</span>
                  </div>
                </div>
              </div>

              <div className="civic-status-legend-col">
                <div className="civic-legend-item">
                  <div className="civic-legend-left">
                    <span className="civic-legend-marker marker-resolved" />
                    <span>Resolved</span>
                  </div>
                  <div className="civic-legend-right">
                    <span className="civic-legend-count">{resolved}</span>
                    <span className="civic-legend-pct">{resolvedPercentage}%</span>
                  </div>
                </div>

                <div className="civic-legend-item">
                  <div className="civic-legend-left">
                    <span className="civic-legend-marker marker-progress" />
                    <span>Active Queue</span>
                  </div>
                  <div className="civic-legend-right">
                    <span className="civic-legend-count">{pending}</span>
                    <span className="civic-legend-pct">
                      {total > 0 ? Math.round((pending / total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI PRIORITY TRIAGE */}
          <motion.div
            className="civic-admin-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="civic-panel-header">
              <div className="civic-panel-title-wrap">
                <div className="civic-panel-icon" style={{ color: "#818cf8" }}>
                  <BrainCircuit size={18} />
                </div>
                <h3>AI Emergency Triage</h3>
              </div>
              <span className="civic-panel-filter-pill">Severity Analysis</span>
            </div>

            <div className="civic-priority-list">
              {/* HIGH */}
              <div className="civic-priority-item">
                <div className="civic-priority-row-top">
                  <div className="civic-priority-label-left">
                    <span className="civic-priority-dot-ring dot-high" />
                    <span>High Priority</span>
                  </div>
                  <span className="civic-priority-val">{highPriority} Issues</span>
                </div>
                <div className="civic-priority-bar-track">
                  <div
                    className="civic-priority-bar-fill fill-high"
                    style={{
                      width: `${total > 0 ? (highPriority / total) * 100 : 0}%`,
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
                  <span className="civic-priority-val">{mediumPriority} Issues</span>
                </div>
                <div className="civic-priority-bar-track">
                  <div
                    className="civic-priority-bar-fill fill-medium"
                    style={{
                      width: `${total > 0 ? (mediumPriority / total) * 100 : 0}%`,
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
                  <span className="civic-priority-val">{lowPriority} Issues</span>
                </div>
                <div className="civic-priority-bar-track">
                  <div
                    className="civic-priority-bar-fill fill-low"
                    style={{
                      width: `${total > 0 ? (lowPriority / total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* RECENT COMPLAINTS TABLE */}
        <motion.section
          className="civic-admin-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="civic-panel-header">
            <div className="civic-panel-title-wrap">
              <div className="civic-panel-icon">
                <Layers size={17} />
              </div>
              <h3>Recent Complaints Queue</h3>
            </div>

            <motion.button
              className="civic-track-btn"
              onClick={() => navigate("admin-complaints")}
              whileHover={{ x: 2 }}
            >
              <span>Manage All Complaints</span>
              <ChevronRight size={14} />
            </motion.button>
          </div>

          <div className="civic-table-responsive">
            {isLoading ? (
              <div className="civic-empty-state">
                <div className="civic-empty-icon-pulse">
                  <Clock3 size={28} />
                </div>
                <strong>Loading Complaints Queue...</strong>
                <p>Retrieving municipal data.</p>
              </div>
            ) : complaints.length === 0 ? (
              <div className="civic-empty-state">
                <div className="civic-empty-icon-pulse">
                  <CheckCircle2 size={28} />
                </div>
                <strong>No Complaints Pending</strong>
                <p>All citizen complaints have been triaged or addressed.</p>
              </div>
            ) : (
              <table className="civic-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
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
                        key={complaint.complaint_id || complaint.id || index}
                        className="civic-table-row"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 + index * 0.04 }}
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
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="civic-dash-footer">
          <span>© 2026 CivicAI · Municipal Command Center</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={14} color="#10b981" />
            Authorized Personnel Encrypted Console
          </span>
        </footer>
      </section>
    </main>
  );
}

export default AdminDashboard;