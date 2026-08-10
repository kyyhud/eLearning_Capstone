import { Outlet } from "react-router-dom";
import { useState } from "react";
import { viewCourseByTitle } from "../../services/courseService.js";

function SearchCourseByTitle() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
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

  return (
    <>
      <h3>Search Course by Title</h3>
      <input type="text" placeholder="Enter course title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="button" value="Search" onClick={searchCourses} />
      {message && <p style={{ color: "red" }}>{message}</p>}
      {courses.map((course) => (
        <div key={course._id}>
          <h4>Course Details</h4>
          <p>Course ID: {course._id}</p>
          <p>Title: {course.title}</p>
          <p>Description: {course.description}</p>
          <p>Faculty: {course.faculty}</p>
          <p>Duration: {course.duration}</p>
        </div>
      ))}
      <br />
      <a href="/student-dashboard">Back to Dashboard</a>
    </>
  );
}

export default SearchCourseByTitle;
