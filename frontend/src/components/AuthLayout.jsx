const AuthLayout = ({ children, title, subtitle, linkText, linkTo }) => {
  return (
    <div className="auth-layout">
      {/* Left Panel */}
      <div className="auth-panel-left">
        <div className="auth-panel-brand">
          <div className="brand-logo">A</div>
          <h1>AuthSystem</h1>
          <p>A secure, production-grade authentication platform with email verification and JWT tokens.</p>
        </div>

        <div className="auth-panel-features">
          <div className="auth-feature-item">
            <span>🔐</span>
            <span>JWT-based authentication</span>
          </div>
          <div className="auth-feature-item">
            <span>📩</span>
            <span>Email verification system</span>
          </div>
          <div className="auth-feature-item">
            <span>🔑</span>
            <span>Secure password hashing</span>
          </div>
          <div className="auth-feature-item">
            <span>🛡️</span>
            <span>Protected route middleware</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-panel-right">
        <div className="auth-form-header page-enter">
          <h2>{title}</h2>
          {subtitle && (
            <p>
              {subtitle}{" "}
              {linkText && linkTo && (
                <a href={linkTo}>{linkText}</a>
              )}
            </p>
          )}
        </div>
        <div className="page-enter">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
