import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios"; // axios instance

/**
 * Authentication form for login and registration.
 * Handles validation and communicates with backend API.
 */
export default function AuthForm() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email_address: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState(""); // For capturing and displaying error messages
  const [errors, setErrors] = useState({});

  /**
   * Toggle between login and registration modes.
   */
  const handleToggle = () => {
    setIsLogin((prev) => !prev);
    setFormData({ email_address: "", password: "", confirmPassword: "" });
    setError(""); // Clear error message on toggle
  };

  /**
   * Handle input changes and clear error messages.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  /**
   * Validate form data for login and registration.
   * Returns an object with error messages for each invalid field.
   */
  const validate = () => {
    const newErrors = {};
    if (!formData.email_address)
      newErrors.email_address = "Email is required.";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(formData.email_address))
      newErrors.email_address = "Invalid email format.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (!isLogin && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  /**
   * Handle form submission for login or registration.
   * Performs frontend validation before sending data to backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const { email_address, password, confirmPassword } = formData;

    // Registration: check if passwords match
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (isLogin) {
        // Login flow
        const res = await api.post("/auth/login/", {
          email_address: formData.email_address,
          password: formData.password
        });

        // Store tokens and user info in localStorage
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        localStorage.setItem("email_address", formData.email_address);
        localStorage.setItem("password", formData.password);

        navigate("/dashboard");
      } else {
        // Register flow
        const res = await api.post("/auth/register/", {
          email_address: formData.email_address,
          password: formData.password,
          username: formData.email_address.split("@")[0]
        });

        // Auto login after registration
        const loginRes = await api.post("/auth/login/", {
          email_address: formData.email_address,
          password: formData.password
        });

        localStorage.setItem("access_token", loginRes.data.access);
        localStorage.setItem("refresh_token", loginRes.data.refresh);
        localStorage.setItem("email_address", formData.email_address);
        localStorage.setItem("password", formData.password);

        alert("Registration successful! Logged in.");
        navigate("/dashboard");
      }
    } catch (err) {
      // Show backend error messages if available
      console.error("Auth error:", err.response?.data || err.message);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        (err.response?.data && JSON.stringify(err.response.data)) ||
        err.message ||
        "Something went wrong";
      alert(msg);
    }
  };

  // Render the authentication form UI
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg" style={{ maxWidth: 400, width: "100%" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">
            {isLogin ? "Login" : "Register"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email_address"
                value={formData.email_address}
                onChange={handleChange}
                className={`form-control ${
                  errors.email_address ? "is-invalid" : ""
                }`}
                required
              />
              {errors.email_address && (
                <div className="invalid-feedback">
                  {errors.email_address}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                required
              />
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Show confirm password field only for registration */}
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  required
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            )}

            {/* Display error messages */}
            {error && (
              <div className="mb-3 text-danger">
                <small>{error}</small>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <div className="mt-3 text-center">
            <button onClick={handleToggle} className="btn btn-link">
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
