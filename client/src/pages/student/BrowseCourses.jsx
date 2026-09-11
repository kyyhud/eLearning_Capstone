import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../../services/courseApi.js";
import { getMyEnrollments, requestEnrollment } from "../../services/enrollmentApi.js";

const getInitialCourseData = async () => {
  const [courseResponse, enrollmentsResponse] = await Promise.all([getCourses(), getMyEnrollments()]);
  return {
    courses: courseResponse.data,
    enrollments: enrollmentsResponse.data,
  };
};

function BrowseCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const reloadInitialData = async () => {
    try {
      const initialData = await getInitialCourseData();
      setCourses(initialData.courses);
      setEnrollments(initialData.enrollments);
      setMessage("");
      setError("");
    } catch (error) {
      setCourses([]);
      setEnrollments([]);
      setMessage("");
      setError(error.message);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const loadInitialData = async () => {
      try {
        const initialData = await getInitialCourseData();
        if (!cancelled) {
          setCourses(initialData.courses);
          setEnrollments(initialData.enrollments);
          setMessage("");
          setError("");
        }
      } catch (error) {
        if (!cancelled) {
          setCourses([]);
          setEnrollments([]);
          setMessage("");
          setError(error.message);
        }
      }
    };
    loadInitialData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Search the courses returned by the authorized API
  const searchCourses = async () => {
    if (!searchTerm.trim()) {
      reloadInitialData();
      return;
    }
    try {
      const response = await getCourses({ search: searchTerm });
      setCourses(response.data);
      setMessage(response.data.length === 0 ? "No courses found." : "");
      setError("");
    } catch (error) {
      console.error(error);
      setCourses([]);
      setMessage("");
      setError(error.message);
    }
  };

  const clearSearch = async () => {
    setSearchTerm("");
    await reloadInitialData();
  };

  // Find this student's enrollment for a specific course
  const getEnrollmentForCourse = (id) => {
    return enrollments.find((enrollment) => enrollment.course?._id === id);
  };

  // Request enrollment or re-request after rejection
  const handleEnrollmentRequest = async (id) => {
    setMessage("");
    setError("");
    try {
      const response = await requestEnrollment(id);
      const updatedEnrollment = response.data;
      setEnrollments((currentEnrollments) => {
        const existingEnrollment = currentEnrollments.find((enrollment) => enrollment.course?._id === id);
        // Re-requested enrollment already exists in state
        if (existingEnrollment) {
          return currentEnrollments.map((enrollment) =>
            enrollment._id === updatedEnrollment._id
              ? {
                  ...updatedEnrollment,
                  course: enrollment.course,
                }
              : enrollment,
          );
        }
        // New enrollment request
        return [
          ...currentEnrollments,
          {
            ...updatedEnrollment,
            course: {
              _id: id,
            },
          },
        ];
      });
      setMessage("Enrollment request submitted.");
    } catch (error) {
      console.error(error);
      setMessage("");
      setError(error.message);
    }
  };

  return (
    <>
      <h3>Browse Courses</h3>
      <input type="text" placeholder="Search by Course ID or title" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <button type="button" onClick={searchCourses}>
        Search
      </button>
      <button type="button" onClick={clearSearch}>
        Clear
      </button>
      <br />
      {message && <p className="status-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <br />
      <table border="1">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Description</th>
            <th>Faculty</th>
            <th>Duration</th>
            <th>Rating</th>
            <th>Details</th>
            <th>Enrollment</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => {
            const enrollment = getEnrollmentForCourse(course._id);
            return (
              <tr key={course._id}>
                <td>{course.courseId}</td>
                <td>{course.title}</td>
                <td>{course.category}</td>
                <td>{course.description}</td>
                <td>{course.faculty ? `${course.faculty.firstName} ${course.faculty.lastName}` : "Not assigned"}</td>
                <td>{course.durationWeeks} weeks</td>
                <td>
                  {course.rating?.count > 0
                    ? `${"★".repeat(Math.round(course.rating.average))}${"☆".repeat(
                        5 - Math.round(course.rating.average),
                      )} ${course.rating.average.toFixed(1)} (${course.rating.count})`
                    : "No ratings yet"}
                </td>
                <td>
                  <button type="button" onClick={() => navigate(`/courses/${course._id}`)}>
                    View Details
                  </button>
                </td>
                <td>
                  {!enrollment && (
                    <button type="button" onClick={() => handleEnrollmentRequest(course._id)}>
                      Request Enrollment
                    </button>
                  )}
                  {enrollment?.status === "pending" && <span>Pending Approval</span>}
                  {enrollment?.status === "approved" && <span>Enrolled</span>}
                  {enrollment?.status === "rejected" && (
                    <>
                      <span>Rejected </span>
                      <button type="button" onClick={() => handleEnrollmentRequest(course._id)}>
                        Request Again
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default BrowseCourses;
