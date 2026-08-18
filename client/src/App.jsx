import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";

import AuthenticatedLayout from "./components/AuthenticatedLayout.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AddFacultyPage from "./pages/admin/AddFacultyPage.jsx";
import FacultyView from "./pages/admin/FacultyListPage.jsx";

import FacultyDashboard from "./pages/faculty/FacultyDashboard.jsx";
import FacultyProfilePage from "./pages/faculty/FacultyProfilePage.jsx";
import FacultyCourses from "./pages/faculty/FacultyCourses.jsx";

import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import BrowseCoursesByStudent from "./pages/student/BrowseCourses.jsx";

import "./App.css";

function App() {
  return (
    <>
      <h2>eLearning App - Capstone Project</h2>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />

        <Route element={<AuthenticatedLayout allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/faculty" element={<FacultyView />} />
          <Route path="/admin/faculty/add" element={<AddFacultyPage />} />
        </Route>

        <Route element={<AuthenticatedLayout allowedRoles={["faculty"]} />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/profile/:id" element={<FacultyProfilePage />} />
          <Route path="/faculty/courses" element={<FacultyCourses />} />
        </Route>

        <Route element={<AuthenticatedLayout allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/browse-courses" element={<BrowseCoursesByStudent />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
