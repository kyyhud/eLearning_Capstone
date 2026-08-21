import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import StudentSignUp from "./pages/auth/StudentSignUp.jsx";

import AuthenticatedLayout from "./components/AuthenticatedLayout.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AddFacultyPage from "./pages/admin/AddFacultyPage.jsx";
import FacultyView from "./pages/admin/FacultyListPage.jsx";
import StudentListPage from "./pages/admin/StudentListPage.jsx";

import FacultyDashboard from "./pages/faculty/FacultyDashboard.jsx";
import FacultyProfilePage from "./pages/faculty/FacultyProfilePage.jsx";
import FacultyCourses from "./pages/faculty/FacultyCourses.jsx";
import FacultyUserSettings from "./pages/faculty/FacultyUserSetting.jsx";

import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import BrowseCoursesByStudent from "./pages/student/BrowseCourses.jsx";
import StudentProfilePage from "./pages/student/StudentProfilePage.jsx";

import "./App.css";

function App() {
  return (
    <>
      <h2>eLearning App - Capstone Project</h2>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<StudentSignUp />} />

        <Route element={<AuthenticatedLayout allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/faculty" element={<FacultyView />} />
          <Route path="/admin/faculty/add" element={<AddFacultyPage />} />
          <Route path="/admin/faculty/:id" element={<FacultyProfilePage />} />
          <Route path="/admin/students" element={<StudentListPage />} />
          <Route path="/admin/students/:id" element={<StudentProfilePage />} />
        </Route>

        <Route element={<AuthenticatedLayout allowedRoles={["faculty"]} />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/profile/:id" element={<FacultyProfilePage />} />
          <Route path="/faculty/courses" element={<FacultyCourses />} />
          <Route path="/faculty/settings" element={<FacultyUserSettings />} />
        </Route>

        <Route element={<AuthenticatedLayout allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile/:id" element={<StudentProfilePage />} />
          <Route path="/student/browse-courses" element={<BrowseCoursesByStudent />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
