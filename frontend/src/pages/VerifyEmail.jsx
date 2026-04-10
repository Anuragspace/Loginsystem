import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the URL.");
      return;
    }

    const verify = async () => {
      effectRan.current = true;
      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        const errMsg = err.response?.data?.message || "Verification failed. The link may have expired.";
      // Detect already-verified / used link
      if (errMsg.toLowerCase().includes("already been used") || errMsg.toLowerCase().includes("already verified")) {
        setStatus("already");
        setMessage("Your email is already verified! You can log in right now.");
      } else {
        setStatus("error");
        setMessage(errMsg);
      }
      }
    };

    verify();
  }, []);

  const icons = {
    loading: "⏳",
    success: "✅",
    already: "✅",
    error: "❌",
  };

  const titles = {
    loading: "Verifying your email...",
    success: "Email Verified!",
    already: "Already Verified!",
    error: "Verification Failed",
  };

  return (
    <div className="status-page">
      <div className="status-card page-enter">
        <div className={`status-icon ${status}`} id={`verify-status-${status}`}>
          {status === "loading" ? (
            <div className="spinner spinner-dark" />
          ) : (
            <span>{icons[status]}</span>
          )}
        </div>

        <h2>{titles[status]}</h2>
        <p>
          {status === "loading"
            ? "Please wait while we verify your email address."
            : message}
        </p>

        {(status === "success" || status === "already") && (
          <button
            id="verify-go-login"
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Go to Login →
          </button>
        )}

        {status === "error" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
            <button
              id="verify-go-register"
              className="btn btn-outline"
              onClick={() => navigate("/register")}
              style={{ maxWidth: "200px" }}
            >
              Back to Register
            </button>
            <Link
              to="/login"
              style={{ color: "var(--orange)", fontSize: "13px", fontWeight: 600 }}
            >
              Try logging in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
