import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
 * Navigation bar for the app.
 * Handles logout and conditional rendering based on login state.
 */
export default function Navbar() {
  const navigate = useNavigate();

  /**
   * Handles user logout by clearing local storage and redirecting.
   */
  const handleLogout = () => {
    localStorage.removeItem("email_address");
    localStorage.removeItem("password");
    navigate("/login");
  };

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("email_address");

  useEffect(() => {
    // Optional: You can redirect or protect routes here if needed
  }, []);

  // Render the navigation bar UI
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Expense Tracker</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Dashboard</Link>
            </li>
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
