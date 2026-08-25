import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCourseById } from "../../services/courseService.js";

function CourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));
  const canEdit = user?.typeOfUser === "admin" || user?.typeOfUser === "faculty";

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setError("");
      const courseData = await getCourseById(id);
      setCourse(courseData);
    } catch (error) {
      setError(error.message);
    }
  };
  if (!course) {
    return <main>{error ? <p>{error}</p> : <p>Loading course...</p>}</main>;
  }

  const facultyName = course.faculty ? `${course.faculty.firstName} ${course.faculty.lastName}` : "Not assigned";

  return (
    <main>
      <h2>{course.title}</h2>
      {location.state?.message && <p>{location.state.message}</p>}
      {error && <p>{error}</p>}

      <section>
        <h3>Course Information</h3>
        <p>
          <strong>Course ID:</strong> {course.courseId}
        </p>
        <p>
          <strong>Title:</strong> {course.title}
        </p>
        <p>
          <strong>Description:</strong> {course.description}
        </p>
        <p>
          <strong>Faculty:</strong> {facultyName}
        </p>
        <p>
          <strong>Duration:</strong> {course.durationWeeks} weeks
        </p>
      </section>

      <section>
        <h3>Course Content</h3>
        <p>Course sections and learning materials will appear here.</p>
      </section>

      <div>
        {canEdit && (
          <button type="button" onClick={() => navigate(`/courses/${id}/edit`)}>
            Edit Course
          </button>
        )}
        { " | " }
        <button type="button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </main>
  );
}

export default CourseDetailsPage;
