import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../../services/courseApi.js";

function CourseList() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (error) {
        setMessage(`Error fetching courses: ${error.message}`);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h3>Course List</h3>
      {message && <p>{message}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Faculty</th>
            <th>Duration</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Manage</th>
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
                <td>{course.faculty ? `${course.faculty.firstName} ${course.faculty.lastName}` : "Faculty unavailable"}</td>
                <td>{course.durationWeeks} weeks</td>
                <td>
                  {course.rating?.count > 0
                    ? `${"★".repeat(Math.round(course.rating.average))}${"☆".repeat(
                        5 - Math.round(course.rating.average),
                      )} ${course.rating.average.toFixed(1)} (${course.rating.count})`
                    : "No ratings yet"}
                </td>
                <td>{course.status}</td>
                <td>
                  <button onClick={() => navigate(`/courses/${course._id}`)}>View/Edit</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseList;
