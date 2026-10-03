import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import UserDashboard from "./pages/user/UserDashboard";
import ReportComplaint from "./pages/user/ReportComplaint";
import MyComplaints from "./pages/user/MyComplaints";
import Profile from "./pages/user/Profile";
import TrackComplaint from "./pages/user/TrackComplaint";
import Settings from "./pages/user/Settings";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Complaints from "./pages/admin/Complaints";
import Users from "./pages/admin/Users";
import Analytics from "./pages/admin/Analytics";

const getPageFromPath = (path) => {
  if (path === "/admin") return "admin-login";
  if (path === "/admin-dashboard") return "admin-dashboard";
  if (path === "/admin-complaints") return "admin-complaints";
  if (path === "/admin-users") return "admin-users";
  if (path === "/admin-analytics") return "admin-analytics";
  if (path === "/register") return "register";
  if (path === "/forgot") return "forgot";
  if (path === "/reset-password") return "reset-password";
  return null;
};

function App() {
  const [page, setPage] = useState(() => {
    const fromPath = getPageFromPath(window.location.pathname);
    if (fromPath) return fromPath;
    const saved = localStorage.getItem("civicai_current_page");
    return saved || "login";
  });
  const [loading, setLoading] = useState(true);

  // ==========================================
  // RESTORE SESSION AFTER PAGE REFRESH
  // ==========================================

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const email = session.user.email;
          const isAdminStored =
            localStorage.getItem("civicai_is_admin") === "true" ||
            Boolean(localStorage.getItem("civicai_admin"));

          // 1. ADMIN SESSION RESTORE
          if (isAdminStored || email === "admin@civicai.com") {
            try {
              const adminResponse = await fetch(
                "http://127.0.0.1:8000/admin/verify",
                {
                  headers: {
                    Authorization: `Bearer ${session.access_token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (adminResponse.ok) {
                const verifyData = await adminResponse.json();
                localStorage.setItem(
                  "civicai_admin",
                  JSON.stringify({
                    is_admin: true,
                    email: verifyData.email,
                    name: verifyData.name,
                  })
                );
                localStorage.setItem("civicai_is_admin", "true");
                localStorage.setItem("civicai_logged_in", "true");

                const pathPage = getPageFromPath(window.location.pathname);
                const savedPage = localStorage.getItem("civicai_current_page");

                if (pathPage && pathPage.startsWith("admin-")) {
                  setPage(pathPage);
                } else if (savedPage && savedPage.startsWith("admin-")) {
                  setPage(savedPage);
                } else {
                  setPage("admin-dashboard");
                }
                setLoading(false);
                return;
              }
            } catch (adminErr) {
              console.warn("Admin verify check error:", adminErr);
            }
          }

          // 2. CITIZEN USER SESSION RESTORE
          const response = await fetch(
            `http://127.0.0.1:8000/profile?email=${encodeURIComponent(email)}`
          );

          if (response.ok) {
            const profile = await response.json();

            localStorage.setItem(
              "civicai_user",
              JSON.stringify(profile)
            );

            localStorage.setItem(
              "civicai_logged_in",
              "true"
            );

            const pathPage = getPageFromPath(window.location.pathname);
            const savedPage = localStorage.getItem("civicai_current_page");

            if (pathPage) {
              setPage(pathPage);
            } else if (savedPage) {
              setPage(savedPage);
            } else {
              setPage("user-dashboard");
            }
          } else {
            await supabase.auth.signOut();
            localStorage.removeItem("civicai_user");
            localStorage.removeItem("civicai_admin");
            localStorage.removeItem("civicai_is_admin");
            localStorage.removeItem("civicai_logged_in");
            localStorage.removeItem("civicai_current_page");
            setPage("login");
          }
        } else {
          const pathPage = getPageFromPath(window.location.pathname);
          if (pathPage) {
            setPage(pathPage);
          } else {
            setPage("login");
          }
        }
      } catch (error) {
        console.error("Session restore error:", error);
        setPage("login");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    // ==========================================
    // LISTEN FOR LOGIN / LOGOUT
    // ==========================================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);

        if (event === "SIGNED_IN" && session?.user) {
          const isAdmin =
            localStorage.getItem("civicai_is_admin") === "true" ||
            session.user.email === "admin@civicai.com";

          const savedPage = localStorage.getItem("civicai_current_page");
          if (savedPage) {
            setPage(savedPage);
          } else {
            setPage(isAdmin ? "admin-dashboard" : "user-dashboard");
          }
        }

        if (event === "SIGNED_OUT") {
          localStorage.removeItem("civicai_user");
          localStorage.removeItem("civicai_admin");
          localStorage.removeItem("civicai_is_admin");
          localStorage.removeItem("civicai_logged_in");
          localStorage.removeItem("civicai_current_page");
          setPage("login");
        }
      }
    );

    const handlePopState = () => {
      const pageFromPath = getPageFromPath(window.location.pathname);
      if (pageFromPath) {
        setPage(pageFromPath);
      }
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // ==========================================
  // NAVIGATION
  // ==========================================

 const navigate = (nextPage) => {
  setPage(nextPage);

  // Remember current page across refresh/reopen
  if (nextPage !== "login") {
    localStorage.setItem(
      "civicai_current_page",
      nextPage
    );
  } else {
    localStorage.removeItem(
      "civicai_current_page"
    );
  }

    switch (nextPage) {
      case "admin-login":
        window.history.pushState({}, "", "/admin");
        break;

      case "admin-dashboard":
        window.history.pushState({}, "", "/admin-dashboard");
        break;

      case "admin-complaints":
        window.history.pushState({}, "", "/admin-complaints");
        break;

      case "admin-users":
        window.history.pushState({}, "", "/admin-users");
        break;

      case "admin-analytics":
        window.history.pushState({}, "", "/admin-analytics");
        break;

      case "reset-password":
        window.history.pushState({}, "", "/reset-password");
        break;

      default:
        window.history.pushState({}, "", "/");
        break;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050b14",
          color: "#22d3ee",
          fontSize: "16px",
        }}
      >
        Loading CivicAI...
      </div>
    );
  }

  return (
    <>
      {/* =========================
          USER AUTH
      ========================= */}

      {page === "login" && (
        <Login navigate={navigate} />
      )}

      {page === "register" && (
        <Register navigate={navigate} />
      )}

      {page === "forgot" && (
        <ForgotPassword navigate={navigate} />
      )}

      {page === "reset-password" && (
        <ResetPassword navigate={navigate} />
      )}

      {/* =========================
          USER PAGES
      ========================= */}

      {page === "user-dashboard" && (
        <UserDashboard navigate={navigate} />
      )}

      {page === "report-complaint" && (
        <ReportComplaint navigate={navigate} />
      )}

      {page === "complaints" && (
        <MyComplaints navigate={navigate} />
      )}

      {page === "profile" && (
        <Profile navigate={navigate} />
      )}

      {page === "track" && (
        <TrackComplaint navigate={navigate} />
      )}

      {page === "settings" && (
        <Settings navigate={navigate} />
      )}

      {/* =========================
          ADMIN AUTH
      ========================= */}

      {page === "admin-login" && (
        <AdminLogin navigate={navigate} />
      )}

      {/* =========================
          ADMIN DASHBOARD
      ========================= */}

      {page === "admin-dashboard" && (
        <AdminDashboard navigate={navigate} />
      )}

      {/* =========================
          ADMIN COMPLAINTS
      ========================= */}

      {page === "admin-complaints" && (
        <Complaints navigate={navigate} />
      )}

      {/* =========================
          ADMIN USERS
      ========================= */}

      {page === "admin-users" && (
        <Users navigate={navigate} />
      )}

      {/* =========================
          ADMIN ANALYTICS
      ========================= */}

      {page === "admin-analytics" && (
        <Analytics navigate={navigate} />
      )}
    </>
  );
}

export default App;