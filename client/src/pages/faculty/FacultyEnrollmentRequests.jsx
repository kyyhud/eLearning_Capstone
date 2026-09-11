import { useEffect, useState } from "react";
import { getFacultyEnrollments, updateEnrollmentStatus } from "../../services/enrollmentApi.js";

function FacultyEnrollmentRequests() {
  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Load enrollment requests for courses assigned to this faculty member
    const fetchEnrollments = async () => {
      try {
        const response = await getFacultyEnrollments();
        setEnrollments(response.data);
        setError("");
      } catch (error) {
        setEnrollments([]);
        setError(error.message);
      }
    };
    fetchEnrollments();
  }, []);

  // Approve or reject a pending enrollment request
  const handleReview = async (enrollmentId, status) => {
    setMessage("");
    setError("");
    try {
      await updateEnrollmentStatus(enrollmentId, status);

      // Update the status locally after the backend succeeds
      setEnrollments((currentEnrollments) =>
        currentEnrollments.map((enrollment) => (enrollment._id === enrollmentId ? { ...enrollment, status } : enrollment)),
      );
      setMessage(status === "approved" ? "Enrollment approved." : "Enrollment rejected.");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <h3>Enrollment Requests</h3>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Course</th>
            <th>Student ID</th>
            <th>Student</th>
            <th>Email</th>
            <th>Requested</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {enrollments.length === 0 ? (
            <tr>
              <td colSpan="8">No enrollment requests found.</td>
            </tr>
          ) : (
            [...enrollments]
              .sort((a, b) => {
                const aPending = a.status === "pending";
                const bPending = b.status === "pending";
                if (aPending !== bPending) {
                  return aPending ? -1 : 1;
                }
                return a.course?.courseId - b.course?.courseId;
              })
              .map((enrollment) => (
                <tr key={enrollment._id}>
                  <td>{enrollment.course?.courseId}</td>
                  <td>{enrollment.course?.title}</td>
                  <td>{enrollment.student?.studentProfile?.studentId || "N/A"}</td>
                  <td>{enrollment.student ? `${enrollment.student.firstName} ${enrollment.student.lastName}` : "Unknown student"}</td>
                  <td>{enrollment.student?.email}</td>
                  <td>{enrollment.requestedAt ? new Date(enrollment.requestedAt).toLocaleDateString() : ""}</td>
                  <td>{enrollment.status}</td>
                  <td>
                    {enrollment.status === "pending" ? (
                      <>
                        <button type="button" onClick={() => handleReview(enrollment._id, "approved")}>
                          Approve
                        </button>

                        <button type="button" onClick={() => handleReview(enrollment._id, "rejected")}>
                          Reject
                        </button>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </>
  );
}

export default FacultyEnrollmentRequests;
