import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/courseApi.js";
import { getAllStudents, viewAllFaculty } from "../../services/userApi.js";

function AdminDashboard() {
  const [summary, setSummary] = useState({
    facultyTotal: 0,
    facultyActive: 0,
    facultyInactive: 0,
    studentTotal: 0,
    studentActive: 0,
    studentInactive: 0,
    courseTotal: 0,
    coursePublished: 0,
    courseDraft: 0,
    courseArchived: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadDashboard = async () => {
      try {
        setError("");
        const [facultyResponse, studentResponse, courseResponse] = await Promise.all([viewAllFaculty(), getAllStudents(), getCourses()]);
        if (!cancelled) {
          const faculty = facultyResponse.data;
          const students = studentResponse.data;
          const courses = courseResponse.data;
          setSummary({
            facultyTotal: faculty.length,
            facultyActive: faculty.filter((facultyMember) => facultyMember.isActive).length,
            facultyInactive: faculty.filter((facultyMember) => !facultyMember.isActive).length,
            studentTotal: students.length,
            studentActive: students.filter((student) => student.isActive).length,
            studentInactive: students.filter((student) => !student.isActive).length,
            courseTotal: courses.length,
            coursePublished: courses.filter((course) => course.status === "published").length,
            courseDraft: courses.filter((course) => course.status === "draft").length,
            courseArchived: courses.filter((course) => course.status === "archived").length,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setError(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <h3>Admin Dashboard</h3>

      {loading && <p>Loading dashboard...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="dashboard-grid">
          <section>
            <h4>Faculty Members</h4>
            <table align="center" border="1">
              <thead>
                <tr>
                  <th>Total</th>
                  <th>{summary.facultyTotal}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Active</th>
                  <td>{summary.facultyActive}</td>
                </tr>
                <tr>
                  <th>Inactive</th>
                  <td>{summary.facultyInactive}</td>
                </tr>
              </tbody>
            </table>
            <Link to="/admin/faculty">View Faculty Members</Link>
            <Link to="/admin/faculty/add">Add Faculty Member</Link>
          </section>

          <section>
            <h4>Students</h4>
            <table align="center" border="1">
              <thead>
                <tr>
                  <th>Total</th>
                  <th>{summary.studentTotal}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Active</th>
                  <td>{summary.studentActive}</td>
                </tr>
                <tr>
                  <th>Inactive</th>
                  <td>{summary.studentInactive}</td>
                </tr>
              </tbody>
            </table>
            <Link to="/admin/students">View Students</Link>
          </section>

          <section>
            <h4>Courses</h4>
            <table align="center" border="1">
              <thead>
                <tr>
                  <th>Total</th>
                  <th>{summary.courseTotal}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Published</th>
                  <td>{summary.coursePublished}</td>
                </tr>
                <tr>
                  <th>Draft</th>
                  <td>{summary.courseDraft}</td>
                </tr>
                <tr>
                  <th>Archived</th>
                  <td>{summary.courseArchived}</td>
                </tr>
              </tbody>
            </table>
            <Link to="/admin/courses">View Courses</Link>
            <Link to="/admin/courses/add">Add Course</Link>
          </section>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
