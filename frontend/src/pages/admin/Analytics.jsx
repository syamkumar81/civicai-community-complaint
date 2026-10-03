import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users as UsersIcon,
  X,
  Zap,
  Layers,
  PieChart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";
import "./AdminPages.css";
import "../user/UserDashboard.css";
import AdminSidebar from "./AdminSidebar";
import { getCached, setCached } from "./adminCache";

function Analytics({ navigate }) {
  const cachedAnalytics = getCached("analytics");

  const [analytics, setAnalytics] = useState(cachedAnalytics);
  const [isLoading, setIsLoading] = useState(!cachedAnalytics);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("civicai_admin") || "{}");
    } catch {
      return {};
    }
  }, []);

  const adminName = adminInfo.name || "Administrator";

  const getAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token;
  };

  const fetchAnalytics = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else if (!cachedAnalytics) {
      setIsLoading(true);
    }

    setError("");

    try {
      const token = await getAccessToken();

      if (!token) {
        navigate("admin-login");
        return;
      }

      const response = await fetch("https://civicai-community-complaint.onrender.com/admin/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        await supabase.auth.signOut();
        localStorage.removeItem("civicai_admin");
        localStorage.removeItem("civicai_is_admin");
        localStorage.removeItem("civicai_logged_in");
        navigate("admin-login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load analytics.");
      }

      const data = await response.json();
      setAnalytics(data);
      setCached("analytics", data);
    } catch (err) {
      console.error(err);
      setError("Unable to load analytics data. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("civicai_admin");
    localStorage.removeItem("civicai_is_admin");
    localStorage.removeItem("civicai_logged_in");
    navigate("admin-login");
  };

  const total = analytics?.total_complaints || 0;
  const priorityData = analytics?.by_priority || {};
  const statusData = analytics?.by_status || {};
  const categoryData = analytics?.by_category || {};
  const stateData = analytics?.by_state || {};

  const high = Number(priorityData.High || priorityData.high || 0);
  const medium = Number(priorityData.Medium || priorityData.medium || 0);
  const low = Number(priorityData.Low || priorityData.low || 0);

  const submitted = Number(
    statusData.Submitted || statusData.submitted || 0
  );
  const pending = Number(statusData.Pending || statusData.pending || 0);
  const inProgress = Number(
    statusData["In Progress"] ||
      statusData["in progress"] ||
      statusData.InProgress ||
      0
  );
  const resolved = Number(statusData.Resolved || statusData.resolved || 0);

  const resolutionRate =
    total > 0 ? Math.round((resolved / total) * 100) : 0;
  const priorityTotal = high + medium + low;

  const getPercentage = (value, totalValue) => {
    if (!totalValue) return 0;
    return Math.round((Number(value) / totalValue) * 100);
  };

  const categoryItems = Object.entries(categoryData)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 8);

  const stateItems = Object.entries(stateData)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 8);

  return (
    <main className="civic-admin-page">
      {/* BACKGROUND ATMOSPHERE */}
      <div className="civic-admin-bg">
        <div className="civic-admin-mesh" />
        <div className="civic-admin-grid" />
        <div className="civic-admin-orb-1" />
        <div className="civic-admin-orb-2" />
      </div>

      {/* MOBILE BACKDROP */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(3, 7, 18, 0.75)",
              backdropFilter: "blur(6px)",
              zIndex: 45,
            }}
          />
        )}
      </AnimatePresence>

      {/* SHARED UNIFIED SIDEBAR */}
      <AdminSidebar
        activePage="analytics"
        navigate={navigate}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT AREA */}
      <section className="civic-admin-main">
        {/* TOPBAR HEADER */}
        <header className="civic-admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              className="civic-page-btn"
              style={{ display: "none" }}
              onClick={() => setSidebarOpen(true)}
              id="civic-admin-mobile-menu-btn"
            >
              <Menu size={18} />
            </button>

            <div className="civic-admin-greeting">
              <div className="civic-admin-telemetry-badge">
                <span className="civic-admin-pulse-dot" />
                <span>MUNICIPAL TELEMETRY ENGINE</span>
              </div>
              <h1>Executive Analytics</h1>
              <p>Real-time civic intelligence, triage severity, and municipal resolution velocity.</p>
            </div>
          </div>

          <div className="civic-admin-top-actions">
            <motion.button
              className="civic-refresh-btn"
              onClick={() => fetchAnalytics(true)}
              whileTap={{ scale: 0.95 }}
              title="Refresh telemetry stream"
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={{
                  duration: 0.7,
                  repeat: isRefreshing ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <RefreshCw size={14} />
              </motion.div>
              <span>{isRefreshing ? "Recalculating..." : "Sync Telemetry"}</span>
            </motion.button>

            <div className="civic-admin-profile-pill">
              <div className="civic-admin-avatar">
                {adminName.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <strong style={{ fontSize: "12px", color: "#f8fafc", lineHeight: 1.2 }}>
                  {adminName}
                </strong>
                <span style={{ fontSize: "10px", color: "#38bdf8", fontWeight: 700 }}>
                  Municipal Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ALERTS */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="civic-admin-alert error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="civic-admin-alert-content">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
              <button
                className="civic-alert-close-btn"
                onClick={() => setError("")}
              >
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 EXECUTIVE KPI CARDS */}
        <div className="civic-admin-stats-grid">
          <motion.div
            className="civic-admin-stat-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
          >
            <div className="civic-stat-icon-wrap" style={{ color: "#38bdf8" }}>
              <FileText size={22} />
            </div>
            <div>
              <span className="civic-stat-label">Total Volume</span>
              <strong className="civic-stat-value">
                {isLoading ? "—" : total}
              </strong>
            </div>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              All registered municipal issues
            </span>
          </motion.div>

          <motion.div
            className="civic-admin-stat-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="civic-stat-icon-wrap" style={{ color: "#34d399" }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="civic-stat-label">Resolution Rate</span>
              <strong className="civic-stat-value">
                {isLoading ? "—" : `${resolutionRate}%`}
              </strong>
            </div>
            <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 600 }}>
              {resolved} complaints fully resolved
            </span>
          </motion.div>

          <motion.div
            className="civic-admin-stat-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            <div className="civic-stat-icon-wrap" style={{ color: "#fb7185" }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <span className="civic-stat-label">High Severity</span>
              <strong className="civic-stat-value">
                {isLoading ? "—" : high}
              </strong>
            </div>
            <span style={{ fontSize: "11px", color: "#fb7185", fontWeight: 600 }}>
              Immediate municipal attention
            </span>
          </motion.div>

          <motion.div
            className="civic-admin-stat-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <div className="civic-stat-icon-wrap" style={{ color: "#fbbf24" }}>
              <Activity size={22} />
            </div>
            <div>
              <span className="civic-stat-label">Active Cases</span>
              <strong className="civic-stat-value">
                {isLoading ? "—" : pending + inProgress}
              </strong>
            </div>
            <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 600 }}>
              In Progress & Pending review
            </span>
          </motion.div>
        </div>

        {/* 2-COLUMN SECTION: RESOLUTION PIPELINE + PRIORITY DISTRIBUTION */}
        <div className="civic-analytics-columns">
          {/* RESOLUTION PIPELINE */}
          <motion.section
            className="civic-admin-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <div className="civic-panel-header" style={{ marginBottom: "18px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                  Resolution Pipeline
                </h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Current operational flow of filed complaints
                </span>
              </div>
              <Activity size={18} color="#38bdf8" />
            </div>

            <div className="civic-status-grid">
              <div className="civic-status-metric-card">
                <div className="civic-status-card-top">
                  <span>Submitted</span>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#38bdf8" }} />
                </div>
                <div className="civic-status-card-val">{submitted}</div>
                <div className="civic-status-card-sub">
                  {getPercentage(submitted, total)}% of total volume
                </div>
                <div className="civic-status-card-track">
                  <motion.div
                    className="civic-status-card-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${getPercentage(submitted, total)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              <div className="civic-status-metric-card">
                <div className="civic-status-card-top">
                  <span>Pending Review</span>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
                </div>
                <div className="civic-status-card-val">{pending}</div>
                <div className="civic-status-card-sub">
                  {getPercentage(pending, total)}% of total volume
                </div>
                <div className="civic-status-card-track">
                  <motion.div
                    className="civic-status-card-fill"
                    style={{ background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${getPercentage(pending, total)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              <div className="civic-status-metric-card">
                <div className="civic-status-card-top">
                  <span>In Progress</span>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }} />
                </div>
                <div className="civic-status-card-val">{inProgress}</div>
                <div className="civic-status-card-sub">
                  {getPercentage(inProgress, total)}% of total volume
                </div>
                <div className="civic-status-card-track">
                  <motion.div
                    className="civic-status-card-fill"
                    style={{ background: "linear-gradient(90deg, #3b82f6, #6366f1)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${getPercentage(inProgress, total)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              <div className="civic-status-metric-card">
                <div className="civic-status-card-top">
                  <span>Resolved</span>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                </div>
                <div className="civic-status-card-val">{resolved}</div>
                <div className="civic-status-card-sub">
                  {getPercentage(resolved, total)}% of total volume
                </div>
                <div className="civic-status-card-track">
                  <motion.div
                    className="civic-status-card-fill"
                    style={{ background: "linear-gradient(90deg, #10b981, #34d399)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${getPercentage(resolved, total)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* AI PRIORITY DISTRIBUTION */}
          <motion.section
            className="civic-admin-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="civic-panel-header" style={{ marginBottom: "18px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                  AI Priority Distribution
                </h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Autonomous severity triage breakdown
                </span>
              </div>
              <AlertTriangle size={18} color="#fbbf24" />
            </div>

            <div className="civic-priority-row-item">
              <div className="civic-priority-row-head">
                <span style={{ color: "#fb7185" }}>High Priority (Urgent)</span>
                <span style={{ color: "#f8fafc", fontFamily: "monospace" }}>
                  {high} · {getPercentage(high, priorityTotal)}%
                </span>
              </div>
              <div className="civic-priority-row-track">
                <motion.div
                  className="civic-priority-fill-high"
                  style={{ height: "100%", borderRadius: "9999px" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${getPercentage(high, priorityTotal)}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            <div className="civic-priority-row-item">
              <div className="civic-priority-row-head">
                <span style={{ color: "#fbbf24" }}>Medium Priority (Standard)</span>
                <span style={{ color: "#f8fafc", fontFamily: "monospace" }}>
                  {medium} · {getPercentage(medium, priorityTotal)}%
                </span>
              </div>
              <div className="civic-priority-row-track">
                <motion.div
                  className="civic-priority-fill-med"
                  style={{ height: "100%", borderRadius: "9999px" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${getPercentage(medium, priorityTotal)}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            <div className="civic-priority-row-item">
              <div className="civic-priority-row-head">
                <span style={{ color: "#38bdf8" }}>Low Priority (Minor)</span>
                <span style={{ color: "#f8fafc", fontFamily: "monospace" }}>
                  {low} · {getPercentage(low, priorityTotal)}%
                </span>
              </div>
              <div className="civic-priority-row-track">
                <motion.div
                  className="civic-priority-fill-low"
                  style={{ height: "100%", borderRadius: "9999px" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${getPercentage(low, priorityTotal)}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          </motion.section>
        </div>

        {/* 2-COLUMN SECTION: TOP CATEGORIES & REGIONAL DISTRIBUTION */}
        <div className="civic-analytics-columns">
          {/* TOP CATEGORIES */}
          <motion.section
            className="civic-admin-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <div className="civic-panel-header" style={{ marginBottom: "18px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                  Top Issue Categories
                </h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Categories generating the highest volume of reports
                </span>
              </div>
              <BarChart3 size={18} color="#38bdf8" />
            </div>

            {categoryItems.length === 0 ? (
              <div className="civic-empty-state">
                <p>No category reports registered yet.</p>
              </div>
            ) : (
              <div className="civic-rank-list">
                {categoryItems.map(([name, value], index) => (
                  <motion.div
                    key={name}
                    className="civic-rank-row"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.04 }}
                  >
                    <div className="civic-rank-number">0{index + 1}</div>
                    <div className="civic-rank-info">
                      <strong>{name}</strong>
                      <span>{getPercentage(value, total)}% of total complaints</span>
                    </div>
                    <div className="civic-rank-count">{value}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          {/* REGIONAL DISTRIBUTION */}
          <motion.section
            className="civic-admin-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="civic-panel-header" style={{ marginBottom: "18px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                  Regional Volume Leaderboard
                </h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Top states & districts with active civic reporting
                </span>
              </div>
              <TrendingUp size={18} color="#34d399" />
            </div>

            {stateItems.length === 0 ? (
              <div className="civic-empty-state">
                <p>No regional location reports registered yet.</p>
              </div>
            ) : (
              <div className="civic-rank-list">
                {stateItems.map(([name, value], index) => (
                  <motion.div
                    key={name}
                    className="civic-rank-row"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + index * 0.04 }}
                  >
                    <div
                      className="civic-rank-number"
                      style={{
                        background: "rgba(52, 211, 153, 0.12)",
                        borderColor: "rgba(52, 211, 153, 0.3)",
                        color: "#34d399",
                      }}
                    >
                      0{index + 1}
                    </div>
                    <div className="civic-rank-info">
                      <strong>{name}</strong>
                      <span>{getPercentage(value, total)}% of regional volume</span>
                    </div>
                    <div className="civic-rank-count" style={{ color: "#34d399" }}>
                      {value}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </div>

        {/* CATEGORY CARDS OVERVIEW */}
        <motion.section
          className="civic-admin-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <div className="civic-panel-header" style={{ marginBottom: "18px" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                Category Breakdown Overview
              </h3>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                Comprehensive distribution across municipal departments
              </span>
            </div>
            <Layers size={18} color="#38bdf8" />
          </div>

          {categoryItems.length === 0 ? (
            <div className="civic-empty-state">
              <p>No department records found.</p>
            </div>
          ) : (
            <div className="civic-category-cards-grid">
              {categoryItems.map(([name, value], index) => (
                <motion.div
                  key={name}
                  className="civic-category-card-item"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.03 }}
                >
                  <strong>{name}</strong>
                  <span>
                    {value} issues · {getPercentage(value, total)}%
                  </span>
                </motion.div>
              ))}
            </div>
          )}
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

export default Analytics;