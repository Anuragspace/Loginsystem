import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="home-layout">
      {/* Navbar */}
      <nav className="home-nav">
        <div className="home-nav-brand">
          <div className="nav-logo">A</div>
          AuthSystem
        </div>
        <div className="home-nav-right">
          <div className="user-avatar" title={user?.name}>
            {initials}
          </div>
          <button
            id="logout-btn"
            className="btn-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="home-content page-enter">
        <div className="home-welcome">
          <h1>Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋</h1>
          <p>You're securely logged in. Here's your account overview.</p>
        </div>

        {/* Stat Cards */}
        <div className="home-cards">
          <div className="stat-card">
            <div className="stat-card-icon orange">🔐</div>
            <h3>Auth Status</h3>
            <div className="stat-value" style={{ fontSize: "16px", color: "var(--text-success)", fontWeight: 700 }}>
              ✓ Authenticated
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon green">✉️</div>
            <h3>Email Verified</h3>
            <div className="stat-value" style={{ fontSize: "16px", color: "var(--text-success)", fontWeight: 700 }}>
              ✓ Verified
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon blue">🛡️</div>
            <h3>Token Type</h3>
            <div className="stat-value" style={{ fontSize: "16px" }}>JWT · 7 Days</div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <h2>Account Information</h2>

          <div className="profile-row">
            <span className="profile-row-label">Full Name</span>
            <span className="profile-row-value" id="profile-name">{user?.name || "—"}</span>
          </div>

          <div className="profile-row">
            <span className="profile-row-label">Email</span>
            <span className="profile-row-value" id="profile-email">{user?.email || "—"}</span>
          </div>

          <div className="profile-row">
            <span className="profile-row-label">User ID</span>
            <span
              className="profile-row-value"
              id="profile-id"
              style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--text-muted)" }}
            >
              {user?.id || "—"}
            </span>
          </div>

          <div className="profile-row">
            <span className="profile-row-label">Status</span>
            <span className="badge badge-success" id="profile-status">
              ✓ Verified
            </span>
          </div>
        </div>

        {/* Security Tips */}
        <div style={{ marginTop: "24px", background: "var(--orange-light)", border: "1px solid #FDDCCC", borderRadius: "var(--radius-lg)", padding: "24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--orange)", marginBottom: "12px" }}>
            🔒 Security Tips
          </h3>
          <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)", fontSize: "14px", lineHeight: "2" }}>
            <li>Never share your JWT token with anyone</li>
            <li>Use a strong, unique password for this account</li>
            <li>Log out when using shared or public devices</li>
            <li>Enable two-factor authentication when available</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Home;
