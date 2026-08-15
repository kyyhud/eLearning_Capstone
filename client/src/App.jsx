import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import FacultyDashboard from "./pages/faculty/FacultyDashboard.jsx";
import FacultyCourses from "./pages/faculty/FacultyCourses.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import BrowseCoursesByStudent from "./pages/student/BrowseCourses.jsx";

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
        <Route path="/faculty/courses" element={<FacultyCourses />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student/browse-courses" element={<BrowseCoursesByStudent />} />
      </Routes>
    </>
  );
}

export default App;
