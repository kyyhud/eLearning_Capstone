import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFacultyCourses } from "../../services/courseApi.js";

function FacultyCourseList() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getFacultyCourses();
        setCourses(response.data);
        setMessage("");
      } catch (error) {
        setCourses([]);
        setMessage(error.message);
      }
    };
    loadCourses();
  }, []);

  return (
    <>
      <h3>Course Management</h3>
      {message && <p className="error-message">{message}</p>}
      <table className="data-table" border="1">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...courses]
            .sort((a, b) => {
              if (a.status === "archived" && b.status !== "archived") return 1;
              if (a.status !== "archived" && b.status === "archived") return -1;
              return a.courseId - b.courseId;
            })
            .map((course) => (
              <tr key={course._id}>
                <td>{course.courseId}</td>
                <td>{course.title}</td>
                <td>{course.category}</td>
                <td>{course.description}</td>
                <td>{course.durationWeeks} weeks</td>
                <td>
                  {course.rating?.count > 0
                    ? `${"★".repeat(Math.round(course.rating.average))}${"☆".repeat(
                        5 - Math.round(course.rating.average),
                      )} ${course.rating.average.toFixed(1)} (${course.rating.count})`
                    : "No ratings yet"}
                </td>
                <td>
                  <span className={`status-badge status-${course.status}`}>{course.status}</span>
                </td>
                <td>
                  <button onClick={() => navigate(`/courses/${course._id}`)}>View/Edit</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default FacultyCourseList;
