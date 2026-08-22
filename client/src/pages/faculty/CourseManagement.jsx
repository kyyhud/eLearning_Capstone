import { useState, useEffect } from "react";
import { accessFacultyCourses } from "../../services/courseService.js";

function CourseManagementPage() {
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
            <th>Faculty</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>{course.courseId}</td>
              <td>{course.title}</td>
              <td>{course.category}</td>
              <td>{course.description}</td>
              <td>{course.faculty ? `${course.faculty.firstName} ${course.faculty.lastName}` : "Not assigned"}</td>
              <td>{course.durationWeeks} weeks</td>
              <td>{course.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default CourseManagementPage;
