import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import NoticeBoard from "./components/NoticeBoard";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleAuthChange = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("storage", handleAuthChange); // Sync authentication across tabs
    return () => window.removeEventListener("storage", handleAuthChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<NoticeBoard />} /> {/* Default Page */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/panel" /> : <Login setAuth={setIsAuthenticated} />} 
        />
        <Route 
          path="/panel" 
          element={isAuthenticated ? <AdminPanel setAuth={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
