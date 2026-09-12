import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyEnrollments } from "../../services/enrollmentApi.js";

function StudentCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Load the student's approved enrollments
    const fetchMyCourses = async () => {
      try {
        const response = await getMyEnrollments();
        const approvedEnrollments = response.data.filter((enrollment) => enrollment.status === "approved");
        setEnrollments(approvedEnrollments);
        setMessage("");
      } catch (error) {
        setEnrollments([]);
        setMessage(error.message);
      }
    };
    fetchMyCourses();
  }, []);

  // Open the student's coursework page for this course
  const openCourse = (id) => {
    navigate(`/student/courses/${id}`);
  };

  return (
    <>
      <h3>Courses</h3>
      {message && <p className="error-message">{message}</p>}

      {enrollments.length === 0 ? (
        <p className="empty-state">You are not currently enrolled in any courses.</p>
      ) : (
        <table className="data-table" border="1">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Progress</th>
              <th>Course</th>
            </tr>
          </thead>

          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment._id}>
                <td>{enrollment.course?.courseId}</td>
                <td>{enrollment.course?.title}</td>
                <td>{enrollment.course?.category}</td>
                <td>{enrollment.course?.durationWeeks} weeks</td>
                <td>{enrollment.progress?.completedAt ? "100% - Complete" : `${enrollment.progressPercent}%`}</td>
                <td>
                  <button type="button" onClick={() => openCourse(enrollment.course._id)}>
                    {enrollment.progress?.completedContent?.length > 0 ? "Continue Course" : "Start Course"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default StudentCourses;
