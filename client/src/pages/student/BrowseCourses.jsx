import { useState, useEffect } from "react";
import { viewAllCourses, viewCourseByTitle } from "../../services/courseService.js";

function BrowseCoursesByStudent() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    try {
      const response = await viewAllCourses();
      setCourses(response);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const searchCourses = async () => {
    try {
      const response = await viewCourseByTitle(title);
      setCourses(response);
      setMessage("");
    } catch (error) {
      setCourses([]);
      setMessage(error.message);
    }
  };

  const clearSearch = () => {
    setTitle("");
    fetchAllCourses();
  };

  return (
    <>
      <h3>Browse Courses</h3>
      <input type="text" placeholder="Enter course title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="button" value="Search" onClick={searchCourses} />
      <input type="button" value="Clear" onClick={clearSearch} />
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

export default BrowseCoursesByStudent;
