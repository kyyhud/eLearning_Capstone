import { Outlet } from "react-router-dom";
import { useState } from "react";
import { viewCourseByTitle } from "../../services/courseService.js";

function SearchCourseByTitle() {
  const [course, setCourse] = useState([]);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const searchCourses = async () => {
    try {
      const response = await viewCourseByTitle(title);
      setCourse(response.data);
      setMessage("");
    } catch (error) {
      setCourse(null);
      setMessage(error.message);
    }
  };

  return (
    <>
      <h3>Search Courses</h3>
      <input type="text" placeholder="Enter course title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="button" value="Search" onClick={searchCourses} />
      {message && <p style={{ color: "red" }}>{message}</p>}
      {course && (
        <div>
          <h4>Course Details</h4>
          <p>Course ID: {course._id}</p>
          <p>Title: {course.title}</p>
          <p>Description: {course.description}</p>
          <p>Faculty: {course.faculty}</p>
          <p>Duration: {course.duration}</p>
        </div>
      )}
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default SearchCourseByTitle;
