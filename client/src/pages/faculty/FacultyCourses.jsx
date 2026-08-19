import { useState, useEffect } from "react";
import { accessFacultyCourses } from "../../services/courseService.js";

function FacultyCourses() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));

  const accessFacultyCoursesHandler = async () => {
    try {
      const response = await accessFacultyCourses(user.email);
      setCourses(response);
      setMessage("");
    } catch (error) {
      setCourses([]);
      setMessage(error.message);
    }
  };

  useEffect(() => {
    accessFacultyCoursesHandler();
  }, []);

  return (
    <>
      <h3>{`Courses for ${user?.email}`}</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <br />
      <table border="1">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Faculty</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>{course._id}</td>
              <td>{course.title}</td>
              <td>{course.description}</td>
              <td>{course.faculty}</td>
              <td>{course.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default FacultyCourses;
