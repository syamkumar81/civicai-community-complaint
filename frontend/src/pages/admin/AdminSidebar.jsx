import { motion } from "framer-motion";
import {
  BrainCircuit,
  LayoutDashboard,
  FileText,
  Users as UsersIcon,
  BarChart3,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import { clearAdminCache } from "./adminCache";

function AdminSidebar({ activePage, navigate, sidebarOpen, setSidebarOpen }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("civicai_admin");
    localStorage.removeItem("civicai_is_admin");
    localStorage.removeItem("civicai_logged_in");
    localStorage.removeItem("civicai_current_page");
    clearAdminCache();
    navigate("admin-login");
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      route: "admin-dashboard",
    },
    {
      id: "complaints",
      label: "Complaints",
      icon: FileText,
      route: "admin-complaints",
    },
    {
      id: "users",
      label: "Users",
      icon: UsersIcon,
      route: "admin-users",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      route: "admin-analytics",
    },
  ];

  return (
    <aside className={`civic-admin-sidebar ${sidebarOpen ? "open" : ""}`}>
      {/* BRAND */}
      <div className="civic-admin-brand">
        <motion.div
          className="civic-admin-logo-badge"
          animate={{
            boxShadow: [
              "0 0 15px rgba(6, 182, 212, 0.35)",
              "0 0 30px rgba(6, 182, 212, 0.6)",
              "0 0 15px rgba(6, 182, 212, 0.35)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <BrainCircuit size={24} />
        </motion.div>
        <div className="civic-admin-brand-text">
          <strong>CivicAI</strong>
          <span>MUNICIPAL COMMAND</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="civic-admin-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <motion.button
              key={item.id}
              className={`civic-admin-nav-link ${isActive ? "active" : ""}`}
              onClick={() => {
                if (setSidebarOpen) setSidebarOpen(false);
                navigate(item.route);
              }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.15 }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* SIDEBAR FOOTER */}
      <div className="civic-admin-sidebar-bottom">
        <div className="civic-admin-audit-card">
          <div className="civic-audit-badge">
            <ShieldCheck size={14} />
            <span>Admin Security</span>
          </div>
          <p>Session active. Actions are logged for municipal compliance.</p>
        </div>

        <motion.button
          className="civic-admin-logout-btn"
          onClick={handleLogout}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.15 }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
