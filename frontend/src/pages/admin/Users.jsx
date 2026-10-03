import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserRound,
  Users as UsersIcon,
  X,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";
import "./AdminPages.css";
import "../user/UserDashboard.css";
import AdminSidebar from "./AdminSidebar";
import { getCached, setCached } from "./adminCache";

function Users({ navigate }) {
  const cachedData = getCached("users");
  const initialUsers = Array.isArray(cachedData)
    ? cachedData
    : Array.isArray(cachedData?.users)
    ? cachedData.users
    : [];
  const initialTotalComplaints =
    typeof cachedData?.total_complaints === "number"
      ? cachedData.total_complaints
      : 0;
  const initialTotalUsers =
    typeof cachedData?.total_users === "number"
      ? cachedData.total_users
      : initialUsers.length;

  const [users, setUsers] = useState(initialUsers);
  const [totalComplaints, setTotalComplaints] = useState(initialTotalComplaints);
  const [totalUsers, setTotalUsers] = useState(initialTotalUsers);
  const [isLoading, setIsLoading] = useState(!cachedData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 8;

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

  const fetchUsers = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else if (!cachedData) {
      setIsLoading(true);
    }

    setError("");

    try {
      const token = await getAccessToken();

      if (!token) {
        navigate("admin-login");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/admin/users", {
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
        throw new Error("Failed to fetch users.");
      }

      const data = await response.json();
      const list = data.users || [];
      const backendTotalComplaints =
        typeof data.total_complaints === "number" ? data.total_complaints : 0;
      const backendTotalUsers =
        typeof data.total_users === "number" ? data.total_users : list.length;

      setUsers(list);
      setTotalComplaints(backendTotalComplaints);
      setTotalUsers(backendTotalUsers);
      setCached("users", {
        users: list,
        total_complaints: backendTotalComplaints,
        total_users: backendTotalUsers,
      });
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError("Unable to load users. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("civicai_admin");
    localStorage.removeItem("civicai_is_admin");
    localStorage.removeItem("civicai_logged_in");
    navigate("admin-login");
  };

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return users;

    return users.filter((user) => {
      return (
        String(user.name || "").toLowerCase().includes(value) ||
        String(user.email || "").toLowerCase().includes(value) ||
        String(user.id || "").toLowerCase().includes(value)
      );
    });
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const formatDate = (date) => {
    if (!date) return "—";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

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
        activePage="users"
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
                <span>MUNICIPAL CITIZEN DIRECTORY</span>
              </div>
              <h1>Citizen Directory</h1>
              <p>Manage registered CivicAI constituents and monitor their reporting activity.</p>
            </div>
          </div>

          <div className="civic-admin-top-actions">
            <motion.button
              className="civic-refresh-btn"
              onClick={() => fetchUsers(true)}
              whileTap={{ scale: 0.95 }}
              title="Refresh citizen directory"
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
              <span>{isRefreshing ? "Syncing..." : "Sync Directory"}</span>
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

        {/* 3 STATS KPI CARDS */}
        <div
          className="civic-admin-stats-grid"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          <motion.div
            className="civic-admin-stat-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="civic-stat-icon-wrap" style={{ color: "#38bdf8" }}>
              <UsersIcon size={22} />
            </div>
            <div>
              <span className="civic-stat-label">Registered Citizens</span>
              <strong className="civic-stat-value">
                {isLoading ? "—" : totalUsers}
              </strong>
            </div>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              Enrolled municipal residents
            </span>
          </motion.div>

          <motion.div
            className="civic-admin-stat-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            <div className="civic-stat-icon-wrap" style={{ color: "#34d399" }}>
              <UserCheck size={22} />
            </div>
            <div>
              <span className="civic-stat-label">Active Accounts</span>
              <strong className="civic-stat-value">
                {isLoading ? "—" : totalUsers}
              </strong>
            </div>
            <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 600 }}>
              ● 100% In Good Standing
            </span>
          </motion.div>

          <motion.div
            className="civic-admin-stat-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.19 }}
          >
            <div className="civic-stat-icon-wrap" style={{ color: "#a855f7" }}>
              <FileText size={22} />
            </div>
            <div>
              <span className="civic-stat-label">Total Submissions</span>
              <strong className="civic-stat-value">
                {isLoading ? "—" : totalComplaints}
              </strong>
            </div>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              Filed citizen grievances
            </span>
          </motion.div>
        </div>

        {/* CITIZEN DIRECTORY TABLE PANEL */}
        <motion.section
          className="civic-admin-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {/* SEARCH & FILTERS BAR */}
          <div className="civic-admin-filter-bar">
            <div className="civic-search-input-wrap">
              <Search size={16} />
              <input
                type="text"
                className="civic-search-input"
                placeholder="Search citizen name, email, or account ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {search && (
                <button
                  className="civic-alert-close-btn"
                  style={{ position: "absolute", right: "12px" }}
                  onClick={() => setSearch("")}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                background: "rgba(56, 189, 248, 0.08)",
                border: "1px solid rgba(56, 189, 248, 0.2)",
                color: "#38bdf8",
                fontSize: "12.5px",
                fontWeight: 700,
              }}
            >
              {filteredUsers.length} Citizen{filteredUsers.length === 1 ? "" : "s"} Found
            </div>
          </div>

          {/* TABLE */}
          <div className="civic-table-responsive">
            {isLoading ? (
              <div className="civic-empty-state">
                <div className="civic-empty-icon-pulse">
                  <Clock3 size={28} />
                </div>
                <strong>Loading Citizen Registry...</strong>
                <p>Retrieving constituent records and reporting histories.</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="civic-empty-state">
                <div className="civic-empty-icon-pulse">
                  <UserRound size={28} />
                </div>
                <strong>No Citizens Found</strong>
                <p>No constituents match your active search terms.</p>
              </div>
            ) : (
              <table className="civic-table">
                <thead>
                  <tr>
                    <th>Constituent</th>
                    <th>Email Address</th>
                    <th>Complaints Filed</th>
                    <th>Enrolled Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {paginatedUsers.map((user, index) => {
                      const name = user.name || "Constituent";
                      const initials = name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "C";
                      const userId = user.id ? String(user.id).slice(0, 10) : `USR-${index + 1}`;

                      return (
                        <motion.tr
                          key={user.id || user.email || index}
                          className="civic-table-row"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.035 }}
                        >
                          <td>
                            <div className="civic-user-cell">
                              <div className="civic-user-avatar-circle">
                                {initials}
                              </div>
                              <div>
                                <span className="civic-user-name">{name}</span>
                                <span className="civic-user-subid">
                                  ID: {userId}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="civic-user-email-wrap">
                              <Mail size={14} />
                              <span>{user.email || "—"}</span>
                            </div>
                          </td>

                          <td>
                            <span className="civic-complaint-count-badge">
                              <FileText size={13} />
                              {Number(user.complaint_count ?? 0)} Reports
                            </span>
                          </td>

                          <td>
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                color: "#94a3b8",
                                fontSize: "12px",
                              }}
                            >
                              <CalendarDays size={14} color="#38bdf8" />
                              <span>{formatDate(user.created_at)}</span>
                            </div>
                          </td>

                          <td>
                            <span className="civic-active-status-pill">
                              <span className="civic-active-dot" />
                              Active
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>

          {/* PAGINATION BAR */}
          {!isLoading && filteredUsers.length > 0 && (
            <div className="civic-pagination-bar">
              <div>
                Showing <strong>{startIndex + 1}</strong>–
                <strong>
                  {Math.min(startIndex + usersPerPage, filteredUsers.length)}
                </strong>{" "}
                of <strong>{filteredUsers.length}</strong> constituents
              </div>

              <div className="civic-page-controls">
                <button
                  className="civic-page-btn"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  title="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>

                {pageNumbers
                  .slice(
                    Math.max(0, safePage - 3),
                    Math.min(totalPages, safePage + 2)
                  )
                  .map((page) => (
                    <button
                      key={page}
                      className={`civic-page-btn ${
                        safePage === page ? "active" : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                <button
                  className="civic-page-btn"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  title="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
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

export default Users;