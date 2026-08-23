import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import StudentSignUp from "./pages/auth/StudentSignUp.jsx";

import AuthenticatedLayout from "./components/AuthenticatedLayout.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AddFacultyPage from "./pages/admin/AddFacultyPage.jsx";
import FacultyView from "./pages/admin/FacultyListPage.jsx";
import StudentListPage from "./pages/admin/StudentListPage.jsx";
import CourseListPage from "./pages/admin/CourseListPage.jsx";
import AddCoursePage from "./pages/admin/AddCoursePage.jsx";

import FacultyDashboard from "./pages/faculty/FacultyDashboard.jsx";

import CourseManagementPage from "./pages/faculty/CourseManagement.jsx";
import FacultyUserSettings from "./pages/faculty/FacultyUserSetting.jsx";

import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import BrowseCoursesByStudent from "./pages/student/BrowseCourses.jsx";
import StudentUserSettings from "./pages/student/StudentUserSettings.jsx";

import CourseDetailsPage from "./pages/shared/CourseDetailsPage.jsx";

import CourseEditorPage from "./pages/shared/CourseEditorPage.jsx";
import FacultyProfilePage from "./pages/shared/FacultyProfilePage.jsx";

import StudentProfilePage from "./pages/shared/StudentProfilePage.jsx";

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
          <Route path="/admin/courses" element={<CourseListPage />} />
          <Route path="/admin/add-course" element={<AddCoursePage />} />
        </Route>

        <Route element={<AuthenticatedLayout allowedRoles={["faculty"]} />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          
          <Route path="/faculty/courses" element={<CourseManagementPage />} />
          <Route path="/faculty/settings" element={<FacultyUserSettings />} />
        </Route>

        <Route element={<AuthenticatedLayout allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          
          <Route path="/student/browse-courses" element={<BrowseCoursesByStudent />} />
          <Route path="/student/settings" element={<StudentUserSettings />} />
        </Route>

        <Route element={<AuthenticatedLayout allowedRoles={["admin", "faculty", "student"]} />}>
          <Route path="/courses/:id" element={<CourseDetailsPage />} />
        </Route>

        <Route element={<AuthenticatedLayout allowedRoles={["admin", "faculty"]} />}>
          <Route path="/faculty/profile/:id" element={<FacultyProfilePage />} />
          <Route path="/courses/:id/edit" element={<CourseEditorPage />} />
        </Route>

        <Route element={<AuthenticatedLayout allowedRoles={["admin", "student"]} />}>
          <Route path="/student/profile/:id" element={<StudentProfilePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
