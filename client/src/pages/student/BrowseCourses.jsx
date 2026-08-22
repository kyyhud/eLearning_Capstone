import { useState, useEffect } from "react";
import { viewCourses } from "../../services/courseService.js";

function BrowseCoursesByStudent() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    try {
      const response = await viewCourses();
      setCourses(response);
      setMessage("");
    } catch (error) {
      console.error(error);
      setCourses([]);
      setMessage(error.message);
    }
  };

  const searchCourses = async () => {
    if (!searchTerm.trim()) {
      fetchAllCourses();
      return;
    }
    try {
      const response = await viewCourses({ search: searchTerm });
      setCourses(response);
      setMessage(response.length === 0 ? "No courses found." : "");
    } catch (error) {
      setCourses([]);
      setMessage(error.message);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    fetchAllCourses();
  };

  return (
    <>
      <h3>Browse Courses</h3>
      <input type="text" placeholder="Search by Course ID or title" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <button type="button" value="Search" onClick={searchCourses}>
        Search
      </button>
      <button type="button" value="Clear" onClick={clearSearch}>
        Clear
      </button>
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
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default BrowseCoursesByStudent;
