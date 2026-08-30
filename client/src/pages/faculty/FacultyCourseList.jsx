import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { accessFacultyCourses } from "../../services/courseService.js";

function FacultyCourseList() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await accessFacultyCourses();
        setCourses(response);
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
      <h3>Course Management, {user?.email}</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <br />
      <table border="1">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Description</th>
            <th>Duration</th>
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
                <td>{course.status}</td>
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
