import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API = "http://localhost:5000/api";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  // LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // REGISTER
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] =
    useState("");
  const [showRegisterPassword, setShowRegisterPassword] =
    useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] =
    useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // FORGOT PASSWORD
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter Email and Password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          token: data.token,
        })
      );

      alert("Login successful!");

      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REGISTER
  // =========================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!registerName || !registerEmail || !registerPassword) {
      alert("Please fill all required fields");
      return;
    }

    if (registerPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setRegisterLoading(true);

      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerName.trim(),
          email: registerEmail.trim().toLowerCase(),
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          token: data.token,
        })
      );

      alert("Registration successful!");

      navigate("/");
    } catch (error) {
      console.error("Register Error:", error);
      alert(error.message || "Registration failed");
    } finally {
      setRegisterLoading(false);
    }
  };

  // =========================
  // FORGOT PASSWORD
  // =========================
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setResetLoading(true);

      const response = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetEmail.trim().toLowerCase(),
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      alert("Password reset successfully!");

      setResetEmail("");
      setNewPassword("");
      setConfirmPassword("");

      setMode("login");
    } catch (error) {
      console.error("Forgot Password Error:", error);
      alert(error.message || "Password reset failed");
    } finally {
      setResetLoading(false);
    }
  };

  // =========================
  // NAVIGATION
  // =========================
  const openRegister = () => {
    setMode("register");
  };

  const openLogin = () => {
    setMode("login");
  };

  const openForgotPassword = () => {
    setMode("forgot");
  };

  return (
    <div className="login-page">

      <div className="login-background-shape shape-one"></div>
      <div className="login-background-shape shape-two"></div>

      <div className="login-container">

        {/* ================= LOGIN ================= */}
        {mode === "login" && (
          <div className="login-card">

            <div className="brand-section">
              <div className="brand-logo">RF</div>

              <div>
                <h1>Real Finder</h1>
                <p>Find a place you can call home</p>
              </div>
            </div>

            <div className="login-heading">
              <h2>Welcome Back</h2>

              <p>
                Sign in to continue exploring properties
              </p>
            </div>

            <form onSubmit={handleLogin}>

              <div className="form-group">
                <label>Email Address</label>

                <div className="input-wrapper">
                  <span className="input-icon">✉</span>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>

                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div className="forgot-row">
                <button
                  type="button"
                  className="forgot-btn"
                  onClick={openForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading ? (
                  "Signing In..."
                ) : (
                  <>
                    Sign In
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>

            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="register-link">
              New to Real Finder?

              <button
                type="button"
                onClick={openRegister}
              >
                Create an account
              </button>
            </div>

          </div>
        )}

        {/* ================= REGISTER ================= */}
        {mode === "register" && (
          <div className="login-card">

            <div className="brand-section">
              <div className="brand-logo">RF</div>

              <div>
                <h1>Real Finder</h1>
                <p>Find a place you can call home</p>
              </div>
            </div>

            <div className="login-heading">
              <h2>Create Account</h2>

              <p>
                Join Real Finder and explore properties
              </p>
            </div>

            <form onSubmit={handleRegister}>

              <div className="form-group">
                <label>Full Name</label>

                <div className="input-wrapper">
                  <span className="input-icon">👤</span>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={registerName}
                    onChange={(e) =>
                      setRegisterName(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>

                <div className="input-wrapper">
                  <span className="input-icon">✉</span>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={registerEmail}
                    onChange={(e) =>
                      setRegisterEmail(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>

                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>

                  <input
                    type={
                      showRegisterPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a password"
                    value={registerPassword}
                    onChange={(e) =>
                      setRegisterPassword(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowRegisterPassword(
                        !showRegisterPassword
                      )
                    }
                  >
                    {showRegisterPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>

                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>

                  <input
                    type={
                      showRegisterConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    value={registerConfirmPassword}
                    onChange={(e) =>
                      setRegisterConfirmPassword(
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowRegisterConfirmPassword(
                        !showRegisterConfirmPassword
                      )
                    }
                  >
                    {showRegisterConfirmPassword
                      ? "🙈"
                      : "👁"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={registerLoading}
              >
                {registerLoading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>

            <div className="register-link">
              Already have an account?

              <button
                type="button"
                onClick={openLogin}
              >
                Sign In
              </button>
            </div>

          </div>
        )}

        {/* ================= FORGOT PASSWORD ================= */}
        {mode === "forgot" && (
          <div className="login-card">

            <div className="brand-section">
              <div className="brand-logo">RF</div>

              <div>
                <h1>Real Finder</h1>
                <p>Find a place you can call home</p>
              </div>
            </div>

            <div className="login-heading">
              <h2>Reset Password</h2>

              <p>
                Create a new password for your account
              </p>
            </div>

            <form onSubmit={handleForgotPassword}>

              <div className="form-group">
                <label>Email Address</label>

                <div className="input-wrapper">
                  <span className="input-icon">✉</span>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) =>
                      setResetEmail(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>New Password</label>

                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                  >
                    {showNewPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>

                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword
                      ? "🙈"
                      : "👁"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={resetLoading}
              >
                {resetLoading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>

            </form>

            <div className="register-link">
              Remember your password?

              <button
                type="button"
                onClick={openLogin}
              >
                Back to Sign In
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}