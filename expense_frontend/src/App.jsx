import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute'; // Ensure the route is protected
import AuthForm from "./pages/AuthForm";

import './App.css'; // Import your CSS file

const App = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
    

      </Routes>
    </Router>
  );
};

export default App;
