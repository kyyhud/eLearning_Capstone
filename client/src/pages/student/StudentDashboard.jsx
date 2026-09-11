import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyEnrollments } from "../../services/enrollmentApi.js";

function StudentDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadDashboard = async () => {
      try {
        setError("");
        const response = await getMyEnrollments();
        if (!cancelled) {
          setEnrollments(response.data);
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

  const pendingEnrollmentCount = enrollments.filter((enrollment) => enrollment.status === "pending").length;
  const approvedEnrollments = enrollments.filter((enrollment) => enrollment.status === "approved" && enrollment.course);
  const inProgressCourses = approvedEnrollments.filter((enrollment) => enrollment.progressPercent < 100);
  const completedCourses = approvedEnrollments.filter((enrollment) => enrollment.progressPercent === 100);

  return (
    <>
      <h3>Student Dashboard</h3>
      <h4>Welcome, {user?.email}</h4>

      {loading && <p>Loading dashboard...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div>
          <section>
            <h4>Course Summary</h4>
            <table align="center" border="1">
              <thead>
                <tr>
                  <th>Enrolled Courses</th>
                  <th>{approvedEnrollments.length}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>In Progress</th>
                  <td>{inProgressCourses.length}</td>
                </tr>
                <tr>
                  <th>Completed</th>
                  <td>{completedCourses.length}</td>
                </tr>
                <tr>
                  <th>Pending Requests</th>
                  <td>{pendingEnrollmentCount}</td>
                </tr>
              </tbody>
            </table>
            <Link to="/student/courses/my">View My Courses</Link>
          </section>

          <section>
            <h4>Courses In Progress</h4>
            {inProgressCourses.length === 0 ? (
              <p>You do not have any courses in progress.</p>
            ) : (
              <table align="center" border="1">
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Title</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {inProgressCourses.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td>{enrollment.course.courseId}</td>
                      <td>
                        <Link to={`/student/courses/${enrollment.course._id}`}>{enrollment.course.title}</Link>
                      </td>
                      <td>{enrollment.progressPercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section>
            <h4>Completed Courses</h4>
            {completedCourses.length === 0 ? (
              <p>You have not completed any courses yet.</p>
            ) : (
              <table align="center" border="1">
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Title</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {completedCourses.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td>{enrollment.course.courseId}</td>
                      <td>
                        <Link to={`/student/courses/${enrollment.course._id}`}>{enrollment.course.title}</Link>
                      </td>
                      <td>100%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <p>
            <Link to="/student/courses">Browse Available Courses</Link>
          </p>
        </div>
      )}
    </>
  );
}

export default StudentDashboard;
