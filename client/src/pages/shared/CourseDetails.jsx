import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCourseById } from "../../services/courseService.js";

const SERVER_URL = "http://localhost:3000";

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

  // Helper functions to get resource URL and label based on content type
  const getResourceUrl = (contentItem) => {
  if (!contentItem.resourceUrl) {
    return "";
  }
  if (contentItem.type === "link") {
    const url = contentItem.resourceUrl.trim();
    return /^https?:\/\//i.test(url) ? url : `http://${url}`;
  }
  return `${SERVER_URL}${contentItem.resourceUrl}`;
};

const getResourceLabel = (type) => {
  switch (type) {
    case "document":
      return "Open Document";
    case "presentation":
      return "Open Presentation";
    case "video":
      return "Watch Video";
    case "recording":
      return "Watch Recording";
    case "link":
      return "Open Link";
    default:
      return "Open Resource";
  }
};

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
      {/* Course sections and content */}
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
                {(section.content || []).length === 0 ? (
                  <p>No content has been added to this section.</p>
                ) : (
                  <div>
                    <h5>Content</h5>
                    {section.content.map((contentItem, contentIndex) => (
                      <div key={contentItem._id}>
                        <h6>
                          {contentIndex + 1}. {contentItem.title}
                        </h6>
                        <p>
                          <strong>Type:</strong> {contentItem.type}
                        </p>
                        {contentItem.description && <p>{contentItem.description}</p>}
                        <p>
                          <strong>Status:</strong> {contentItem.isRequired ? "Required" : "Optional"}
                        </p>
                        {contentItem.resourceUrl && (
                          <p>
                            <a href={getResourceUrl(contentItem)} target="_blank" rel="noreferrer">
                              {getResourceLabel(contentItem.type)}
                            </a>
                          </p>
                        )}
                        {contentItem.fileName && (
                          <p>
                            <strong>File:</strong> {contentItem.fileName}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
        {" | "}
        <button type="button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </main>
  );
}

export default CourseDetails;
