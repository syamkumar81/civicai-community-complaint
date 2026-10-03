import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  RefreshCw,
  Search,
  ShieldCheck,
  Users as UsersIcon,
  X,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";
import "./AdminPages.css";
import "../user/UserDashboard.css";
import AdminSidebar from "./AdminSidebar";
import { getCached, setCached, updateCachedComplaint } from "./adminCache";

function Complaints({ navigate }) {
  const cachedComplaints = getCached("complaints");

  const [complaints, setComplaints] = useState(cachedComplaints || []);
  const [isLoading, setIsLoading] = useState(!cachedComplaints);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const itemsPerPage = 8;

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

  const fetchComplaints = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else if (!cachedComplaints) {
      setIsLoading(true);
    }

    setError("");

    try {
      const token = await getAccessToken();

      if (!token) {
        navigate("admin-login");
        return;
      }

      const response = await fetch("https://civicai-community-complaint.onrender.com/admin/complaints", {
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
        throw new Error("Failed to fetch complaints.");
      }

      const data = await response.json();
      const list = data.complaints || [];
      setComplaints(list);
      setCached("complaints", list);
    } catch (err) {
      console.error(err);
      setError("Unable to load complaints. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, priorityFilter]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("civicai_admin");
    localStorage.removeItem("civicai_is_admin");
    localStorage.removeItem("civicai_logged_in");
    navigate("admin-login");
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();
    if (value.includes("resolved")) return "pill-resolved";
    if (value.includes("progress")) return "pill-progress";
    if (value.includes("reject")) return "pill-rejected";
    if (value.includes("pending")) return "pill-pending";
    return "pill-pending";
  };

  const getPriorityClass = (priority) => {
    const value = String(priority || "").toLowerCase();
    if (value === "high") return "pill-high";
    if (value === "low") return "pill-low";
    return "pill-medium";
  };

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

  const getComplaintTitle = (complaint) => {
    return (
      complaint.title ||
      complaint.complaint_title ||
      complaint.subject ||
      complaint.description ||
      "Community complaint"
    );
  };

  const getComplaintLocation = (complaint) => {
    return (
      [complaint.village, complaint.city, complaint.district, complaint.state]
        .filter(Boolean)
        .join(", ") || "Location not specified"
    );
  };

  const filteredComplaints = useMemo(() => {
    const query = search.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const title = getComplaintTitle(complaint).toLowerCase();
      const description = String(complaint.description || "").toLowerCase();
      const complaintId = String(
        complaint.complaint_id || complaint.id || ""
      ).toLowerCase();
      const category = String(complaint.category || "").toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        description.includes(query) ||
        complaintId.includes(query) ||
        category.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        String(complaint.status || "Submitted").toLowerCase() ===
        statusFilter.toLowerCase();

      const matchesPriority =
        priorityFilter === "All" ||
        String(complaint.priority || "Medium").toLowerCase() ===
        priorityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [complaints, search, statusFilter, priorityFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredComplaints.length / itemsPerPage)
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const updateComplaint = async (complaintId, field, value) => {
    setUpdatingId(`${complaintId}-${field}`);
    setError("");
    setSuccess("");

    try {
      const token = await getAccessToken();

      if (!token) {
        navigate("admin-login");
        return;
      }

      const response = await fetch(
        `https://civicai-community-complaint.onrender.com/admin/complaints/${complaintId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [field]: value,
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        await supabase.auth.signOut();
        localStorage.removeItem("civicai_admin");
        localStorage.removeItem("civicai_is_admin");
        localStorage.removeItem("civicai_logged_in");
        navigate("admin-login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || "Failed to update complaint.");
      }

      const data = await response.json();
      const updatedComplaint = data.complaint;

      setComplaints((previous) =>
        previous.map((complaint) => {
          const id = complaint.complaint_id || complaint.id;
          if (String(id) === String(complaintId)) {
            return {
              ...complaint,
              ...updatedComplaint,
              [field]: value,
            };
          }
          return complaint;
        })
      );

      updateCachedComplaint(complaintId, { [field]: value });

      setSuccess(
        `${field === "status" ? "Status" : "Priority"} updated to "${value}" successfully.`
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to update complaint.");
    } finally {
      setUpdatingId(null);
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
        activePage="complaints"
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
                <span>MUNICIPAL AI DISPATCH ONLINE</span>
              </div>
              <h1>Complaint Management</h1>
              <p>Review AI-prioritized community issues and update live resolution status.</p>
            </div>
          </div>

          <div className="civic-admin-top-actions">
            <motion.button
              className="civic-refresh-btn"
              onClick={() => fetchComplaints(true)}
              whileTap={{ scale: 0.95 }}
              title="Refresh complaints queue"
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
              <span>{isRefreshing ? "Syncing..." : "Sync Live Queue"}</span>
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

          {success && (
            <motion.div
              className="civic-admin-alert success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="civic-admin-alert-content">
                <CheckCircle2 size={18} />
                <span>{success}</span>
              </div>
              <button
                className="civic-alert-close-btn"
                onClick={() => setSuccess("")}
              >
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COMPLAINTS FILTER BAR & TABLE PANEL */}
        <motion.section
          className="civic-admin-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* SEARCH & FILTERS CONTROLS */}
          <div className="civic-admin-filter-bar">
            <div className="civic-search-input-wrap">
              <Search size={16} />
              <input
                type="text"
                className="civic-search-input"
                placeholder="Search complaint ID, issue description, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

            <div className="civic-admin-filter-group">
              <select
                className="civic-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                className="civic-filter-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>

              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: "rgba(56, 189, 248, 0.08)",
                  border: "1px solid rgba(56, 189, 248, 0.2)",
                  color: "#38bdf8",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {filteredComplaints.length} Record{filteredComplaints.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="civic-table-responsive">
            {isLoading ? (
              <div className="civic-empty-state">
                <div className="civic-empty-icon-pulse">
                  <Clock3 size={28} />
                </div>
                <strong>Loading Complaint Ledger...</strong>
                <p>Retrieving database records and AI triage scores.</p>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="civic-empty-state">
                <div className="civic-empty-icon-pulse">
                  <FileText size={28} />
                </div>
                <strong>No Complaints Found</strong>
                <p>No complaints match your active filter parameters or search query.</p>
              </div>
            ) : (
              <table className="civic-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Complaint Details</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Live Status</th>
                    <th>AI Priority</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {paginatedComplaints.map((complaint, index) => {
                      const complaintId =
                        complaint.complaint_id ||
                        complaint.id?.slice(0, 8) ||
                        `CMP-${index + 1}`;
                      const rawId = complaint.complaint_id || complaint.id;
                      const title = getComplaintTitle(complaint);
                      const location = getComplaintLocation(complaint);
                      const status = complaint.status || "Submitted";
                      const priority = complaint.priority || "Medium";
                      const isStatusUpdating =
                        updatingId === `${rawId}-status`;

                      return (
                        <motion.tr
                          key={rawId || index}
                          className="civic-table-row"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.035 }}
                        >
                          <td>
                            <span className="civic-id-chip">{complaintId}</span>
                          </td>

                          <td className="civic-title-cell" style={{ maxWidth: "340px" }}>
                            <strong>{title}</strong>
                            {complaint.description && complaint.description !== title && (
                              <span className="civic-complaint-desc-sub">
                                {complaint.description}
                              </span>
                            )}
                          </td>

                          <td>
                            <span className="civic-cat-pill">
                              {complaint.category || "General"}
                            </span>
                          </td>

                          <td>
                            <div className="civic-location-cell">
                              <MapPin size={13} />
                              <span>{location}</span>
                            </div>
                          </td>

                          <td style={{ color: "#94a3b8", fontSize: "11.5px", whiteSpace: "nowrap" }}>
                            {formatDate(complaint.created_at)}
                          </td>

                          <td>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                                alignItems: "flex-start",
                              }}
                            >
                              <span className={`civic-pill ${getStatusClass(status)}`}>
                                {status}
                              </span>

                              <select
                                className="civic-inline-select"
                                value={status}
                                disabled={isStatusUpdating}
                                onChange={(e) =>
                                  updateComplaint(rawId, "status", e.target.value)
                                }
                                title="Change complaint status"
                              >
                                <option value="Submitted">Submitted</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Rejected">Rejected</option>
                              </select>

                              {isStatusUpdating && (
                                <span className="civic-updating-spinner">
                                  <RefreshCw
                                    size={11}
                                    style={{
                                      animation: "civicPulse 0.8s linear infinite",
                                    }}
                                  />
                                  Saving...
                                </span>
                              )}
                            </div>
                          </td>

                          <td>
                            <span className={`civic-pill ${getPriorityClass(priority)}`}>
                              {priority}
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
          {!isLoading && filteredComplaints.length > 0 && (
            <div className="civic-pagination-bar">
              <div>
                Showing <strong>{startIndex + 1}</strong>–
                <strong>
                  {Math.min(startIndex + itemsPerPage, filteredComplaints.length)}
                </strong>{" "}
                of <strong>{filteredComplaints.length}</strong> complaints
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
                      className={`civic-page-btn ${safePage === page ? "active" : ""
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

export default Complaints;