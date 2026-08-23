import {useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { viewCourses, deleteCourseByCourseId } from "../../services/courseService.js";

function CourseListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");

  const handleDelete = async (courseId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this course?");
      if (!confirmDelete) return;
      await deleteCourseByCourseId(courseId);
      setCourses(courses.filter(course => course._id !== courseId));
      setMessage("Course deleted successfully");
    } catch (error) {
      setMessage(`Error deleting course: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await viewCourses();
        setCourses(data);
      } catch (error) {
        setMessage(`Error fetching courses: ${error.message}`);
      }
    };
    fetchCourses();
  }, []);
  
  return (
    <div>
      <h1>Course List</h1>
      {message && <p>{message}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Faculty</th>
            <th>Duration (weeks)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course._id}>
              <td>{course.courseId}</td>
              <td>{course.title}</td>
              <td>{course.category}</td>
              <td>{course.faculty ? `${course.faculty.firstName} ${course.faculty.lastName}` : "Not assigned"}</td>
              <td>{course.durationWeeks}</td>
              <td>{course.status}</td>
              <td>
                <button onClick={() => handleDelete(course._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseListPage;