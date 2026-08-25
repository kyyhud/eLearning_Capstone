import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import StudentSignUp from "./pages/auth/StudentSignUp.jsx";

import AuthenticatedLayout from "./components/AuthenticatedLayout.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AddFaculty from "./pages/admin/AddFaculty.jsx";
import FacultyList from "./pages/admin/FacultyList.jsx";
import StudentList from "./pages/admin/StudentList.jsx";
import CourseList from "./pages/admin/CourseList.jsx";
import AddCourse from "./pages/admin/AddCourse.jsx";

import FacultyDashboard from "./pages/faculty/FacultyDashboard.jsx";
import FacultyCourseList from "./pages/faculty/FacultyCourseList.jsx";
import FacultyUserSettings from "./pages/faculty/FacultyUserSettings.jsx";

import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import BrowseCourses from "./pages/student/BrowseCourses.jsx";
import StudentUserSettings from "./pages/student/StudentUserSettings.jsx";

import CourseDetails from "./pages/shared/CourseDetails.jsx";

import CourseEditor from "./pages/shared/CourseEditor.jsx";
import FacultyProfile from "./pages/shared/FacultyProfile.jsx";

import StudentProfile from "./pages/shared/StudentProfile.jsx";

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
          <Route path="/admin/faculty" element={<FacultyList />} />
          <Route path="/admin/faculty/add" element={<AddFaculty />} />
          <Route path="/admin/students" element={<StudentList />} />
          <Route path="/admin/courses" element={<CourseList />} />
          <Route path="/admin/courses/add" element={<AddCourse />} />
        </Route>

        <Route element={<AuthenticatedLayout allowedRoles={["faculty"]} />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/courses" element={<FacultyCourseList />} />
          <Route path="/faculty/settings" element={<FacultyUserSettings />} />
        </Route>

        <Route element={<AuthenticatedLayout allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<BrowseCourses />} />
          <Route path="/student/settings" element={<StudentUserSettings />} />
        </Route>

        <Route element={<AuthenticatedLayout allowedRoles={["admin", "faculty", "student"]} />}>
          <Route path="/courses/:id" element={<CourseDetails />} />
        </Route>

        <Route element={<AuthenticatedLayout allowedRoles={["admin", "faculty"]} />}>
          <Route path="/faculty/:id" element={<FacultyProfile />} />
          <Route path="/courses/:id/edit" element={<CourseEditor />} />
        </Route>

        <Route element={<AuthenticatedLayout allowedRoles={["admin", "student"]} />}>
          <Route path="/student/:id" element={<StudentProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
