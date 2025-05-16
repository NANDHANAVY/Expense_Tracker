  import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Protects routes that require authentication.
 * Redirects to home if no token is found.
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Redirect to login if no token
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
