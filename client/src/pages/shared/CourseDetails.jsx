import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCourseById } from "../../services/courseService.js";

function CourseDetails() {
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
  const orderedSections = [...course.sections].sort((a, b) => a.order - b.order);

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
        <h3>Course Sections</h3>
        {orderedSections.length === 0 && <p>No course sections have been added yet.</p>}
        {orderedSections.map((section, index) => (
          <div key={section._id || `section-${index}`}>
            <h4>Section {index + 1}</h4>
            <p>
              <strong>Title:</strong> {section.title}
            </p>
            <p>
              <strong>Description:</strong> {section.description}
            </p>
            {section.content.length > 0 && (
              <div>
                <h5>Content</h5>
                <ul>
                  {section.content.map((contentItem, contentIndex) => (
                    <li key={contentItem._id || `content-${contentIndex}`}>
                      <strong>{contentItem.title}</strong> ({contentItem.type})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
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

export default CourseDetails;
