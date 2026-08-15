import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { accessFacultyCourses } from "../../services/courseService.js";

function FacultyCourses() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  
  let userEmail = sessionStorage.getItem("userEmail");

  const accessFacultyCoursesHandler = async () => {
    try {
      const response = await accessFacultyCourses(userEmail);
      setCourses(response.data);
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
      <h3>{`Courses for ${userEmail}`}</h3>
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
      <br />
      <a href="/faculty-dashboard">Back to Dashboard</a>
    </>
  );
}

export default FacultyCourses;