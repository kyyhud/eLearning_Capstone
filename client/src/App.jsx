import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import FacultyDashboard from "./pages/faculty/FacultyDashboard.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";

import "./App.css";

function App() {
  return (
    <>
      <h2>eLearning App - Capstone Project</h2>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </>
  );
}

export default App;
