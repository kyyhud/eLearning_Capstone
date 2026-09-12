import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFacultyCourses } from "../../services/courseApi.js";
import { getFacultyEnrollments } from "../../services/enrollmentApi.js";

function FacultyDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadDashboard = async () => {
      try {
        setError("");
        const [courseResponse, enrollmentResponse] = await Promise.all([getFacultyCourses(), getFacultyEnrollments()]);
        if (!cancelled) {
          setCourses(courseResponse.data);
          setEnrollments(enrollmentResponse.data);
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

  const publishedCourses = courses.filter((course) => course.status === "published");
  const draftCourses = courses.filter((course) => course.status === "draft");
  const archivedCourses = courses.filter((course) => course.status === "archived");
  const currentCourses = [...publishedCourses, ...draftCourses].sort((a, b) => a.courseId - b.courseId);
  const pendingEnrollmentCount = enrollments.filter((enrollment) => enrollment.status === "pending").length;

  return (
    <>
      <h3>Faculty Dashboard</h3>
      <h4 className="page-subtitle">Welcome, {user?.email}</h4>

      {loading && <p>Loading dashboard...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="dashboard-grid">
          <section>
            <h4>Course Summary</h4>
            <table align="center" border="1">
              <thead>
                <tr>
                  <th>Total</th>
                  <th>{courses.length}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Published</th>
                  <td>{publishedCourses.length}</td>
                </tr>
                <tr>
                  <th>Draft</th>
                  <td>{draftCourses.length}</td>
                </tr>
                <tr>
                  <th>Archived</th>
                  <td>{archivedCourses.length}</td>
                </tr>
              </tbody>
            </table>
            <Link to="/faculty/courses">View My Courses</Link>
          </section>

          <section>
            <h4>Published and Draft Courses</h4>
            {currentCourses.length === 0 ? (
              <p>You do not have any published or draft courses.</p>
            ) : (
              <table border="1" align="center">
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Title</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCourses.map((course) => (
                    <tr key={course._id}>
                      <td>{course.courseId}</td>
                      <td>
                        <Link to={`/courses/${course._id}`}>{course.title}</Link>
                      </td>
                      <td>
                        <span className={`status-badge status-${course.status}`}>{course.status === "published" ? "Published" : "Draft"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section>
            <h4>Enrollment Requests</h4>
            <table align="center">
              <thead>
                <tr>
                  <th>Pending</th>
                  <th>{pendingEnrollmentCount}</th>
                </tr>
              </thead>
            </table>
            <Link to="/faculty/enrollments">View Enrollment Requests</Link>
          </section>
        </div>
      )}
    </>
  );
}

export default FacultyDashboard;
