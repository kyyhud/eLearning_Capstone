import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentCoursework, markContentComplete } from "../../services/enrollmentApi.js";

const SERVER_URL = "http://localhost:3000";

function Coursework() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoursework();
  }, [id]);

  // Load the full course and this student's enrollment/progress
  const fetchCoursework = async () => {
    try {
      setLoading(true);
      const response = await getStudentCoursework(id);
      setCourse(response.data.course);
      setEnrollment(response.data.enrollment);
      setMessage("");
    } catch (error) {
      console.error(error);
      setCourse(null);
      setEnrollment(null);
      setMessage(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check whether a content item's _id is stored in completedContent
  const isContentComplete = (contentId) => {
    return enrollment?.progress?.completedContent?.some((completedId) => completedId.toString() === contentId.toString()) || false;
  };

  // Calculate progress using required content only
  const calculateProgress = () => {
    if (!course?.sections) {
      return 0;
    }
    const requiredContent = course.sections.flatMap((section) => section.content.filter((content) => content.isRequired));
    if (requiredContent.length === 0) {
      return 0;
    }
    const completedRequiredContent = requiredContent.filter((content) => isContentComplete(content._id));
    return Math.round((completedRequiredContent.length / requiredContent.length) * 100);
  };
  if (loading) {
    return <p>Loading coursework...</p>;
  }
  if (message) {
    return (
      <>
        <p>{message}</p>
        <button type="button" onClick={() => navigate("/student/courses/my")}>
          Back to My Courses
        </button>
      </>
    );
  }
  if (!course || !enrollment) {
    return <p>Coursework not found.</p>;
  }
  const progressPercent = calculateProgress();
  // Display sections according to their saved order
  const orderedSections = [...(course.sections || [])].sort((a, b) => a.order - b.order);

  // Mark a content item complete and update the student's progress
  const handleMarkComplete = async (contentId) => {
    try {
      const response = await markContentComplete(id, contentId);
      setEnrollment(response.data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || error.message);
    }
  };

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
    <>
      <button type="button" onClick={() => navigate("/student/courses/my")}>
        Back to My Courses
      </button>

      <h2>{course.title}</h2>

      <p>
        <strong>Course ID:</strong> {course.courseId}
      </p>

      {course.description && <p>{course.description}</p>}

      <hr />

      <h3>Course Progress</h3>

      <p>
        <strong>Progress:</strong> {progressPercent}% Complete
      </p>

      {enrollment.progress?.completedAt && <p>Course Complete</p>}

      <hr />

      <h3>Coursework</h3>

      {orderedSections.length === 0 ? (
        <p>No coursework has been added yet.</p>
      ) : (
        orderedSections.map((section) => (
          <section key={section._id}>
            <h4>
              Section {section.order}: {section.title}
            </h4>
            {section.description && <p>{section.description}</p>}

            {section.content.length === 0 ? (
              <p>No content has been added to this section.</p>
            ) : (
              <ul>
                {section.content.map((content) => {
                  const completed = isContentComplete(content._id);

                  return (
                    <li style={{ listStyle: "none" }} key={content._id}>
                      <h5>{content.title}</h5>

                      <p>
                        <strong>Type:</strong> {content.type}
                      </p>

                      <p>
                        <strong>Status:</strong> {content.isRequired ? "Required" : "Optional"}
                      </p>

                      {content.description && <p>{content.description}</p>}

                      {content.fileName && (
                        <p>
                          <strong>File:</strong> {content.fileName}
                        </p>
                      )}

                      {content.resourceUrl && (
                        <p>
                          <a href={getResourceUrl(content)} target="_blank" rel="noreferrer">
                            {getResourceLabel(content.type)}
                          </a>
                        </p>
                      )}

                      {completed ? (
                        <p>Completed</p>
                      ) : (
                        <button type="button" onClick={() => handleMarkComplete(content._id)}>
                          Mark Complete
                        </button>
                      )}

                      <hr />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))
      )}
    </>
  );
}

export default Coursework;
