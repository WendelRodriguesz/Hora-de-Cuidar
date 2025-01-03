import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login/login"; 
import Patients from "../pages/patients/patients"; 
const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
