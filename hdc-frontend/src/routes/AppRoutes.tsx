import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login/login"; 
import RecoveryPassword from "../pages/login/recoveryPassword/recoveryPassword";
import RegisterNow from "../pages/login/registerNow/registerNow";
import Teste from "../pages/teste"; 
import Patients from "../pages/patients/patients"; 

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/teste" element={<Teste />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/recoverypassword" element={<RecoveryPassword/>} />
        <Route path="/registerNow" element={<RegisterNow/>} />
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
