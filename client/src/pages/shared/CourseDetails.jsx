import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById, getCourseContentFile } from "../../services/courseApi.js";
import { getMyEnrollments, requestEnrollment } from "../../services/enrollmentApi.js";
import { getCourseReviews } from "../../services/reviewApi.js";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const isAdmin = user?.typeOfUser === "admin";
  const isFaculty = user?.typeOfUser === "faculty";
  const isStudent = user?.typeOfUser === "student";
  const [enrollment, setEnrollment] = useState(null);
  const [enrollmentMessage, setEnrollmentMessage] = useState("");
  const [enrollmentError, setEnrollmentError] = useState("");

  useEffect(() => {
    // Load the course details and its ratings/reviews
    const loadCourseDetails = async () => {
      try {
        setError("");
        const [courseResponse, reviewResponse] = await Promise.all([getCourseById(id), getCourseReviews(id)]);
        setCourse(courseResponse.data);
        setReviews(reviewResponse.data.reviews);
        setAverageRating(reviewResponse.data.averageRating);
        setReviewCount(reviewResponse.data.reviewCount);
        if (isStudent) {
          const enrollmentResponse = await getMyEnrollments();
          const currentEnrollment = enrollmentResponse.data.find((enrollment) => enrollment.course?._id === id);
          setEnrollment(currentEnrollment || null);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    loadCourseDetails();
  }, [id, isStudent]);
  if (!course) {
    return <main>{error ? <p>{error}</p> : <p>Loading course...</p>}</main>;
  }

  const facultyName = course.faculty ? `${course.faculty.firstName} ${course.faculty.lastName}` : "Not assigned";
  const assignedFacultyId = course.faculty?._id?.toString() || course.faculty?.toString();
  const isAssignedFaculty = isFaculty && assignedFacultyId === user?._id?.toString();
  const canEdit = isAdmin || isAssignedFaculty;
  const orderedSections = [...(course.sections || [])].sort((a, b) => a.order - b.order);

  // Request enrollment or re-request after rejection
  const handleEnrollmentRequest = async () => {
    try {
      setEnrollmentMessage("");
      setEnrollmentError("");
      const response = await requestEnrollment(id);
      setEnrollment(response.data);
      setEnrollmentMessage("Enrollment request submitted.");
    } catch (error) {
      setEnrollmentError(error.message);
    }
  };

  // Handle opening course content file in a new tab
  const handleOpenCourseFile = async (contentItem) => {
    const newTab = window.open("about:blank", "_blank");
    if (newTab) {
      newTab.opener = null;
    }
    try {
      setError("");
      const fileBlob = await getCourseContentFile(id, contentItem._id);
      const fileUrl = URL.createObjectURL(fileBlob);
      if (newTab) {
        newTab.location.href = fileUrl;
      }
      window.setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
      }, 60000);
    } catch (error) {
      newTab?.close();
      setError(error.message);
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
    return "";
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

  const getStarRating = (rating) => {
    const roundedRating = Math.round(rating);
    return "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);
  };

  return (
    <main>
      {error && <p>{error}</p>}

      <section>
        <h3>{course.title}</h3>
        <p>
          <strong>Course ID:</strong> {course.courseId}
        </p>
        <p>
          <strong>Status:</strong> {course.status}
        </p>
        {isAssignedFaculty && (
          <button type="button" onClick={() => navigate(`/courses/${id}/messages`)}>
            Course Chat
          </button>
        )}

        <br />
        <br />
        <p>
          <strong>Category:</strong> {course.category}
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
        <p>
          <strong>Rating:</strong>{" "}
          {reviewCount > 0 ? (
            <>
              {getStarRating(averageRating)} {averageRating.toFixed(1)} / 5 ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
            </>
          ) : (
            "No ratings yet"
          )}
        </p>
      </section>

      {/* Enrollment for students */}
      {isStudent && (
        <section>
          <hr />
          <h3>Enrollment</h3>
          {!enrollment && (
            <button type="button" onClick={handleEnrollmentRequest}>
              Request Enrollment
            </button>
          )}
          {enrollment?.status === "pending" && <p>Pending Approval</p>}
          {enrollment?.status === "approved" && (
            <>
              <p>Enrolled</p>
              <button type="button" onClick={() => navigate(`/student/courses/${id}`)}>
                Go to Coursework
              </button>
            </>
          )}
          {enrollment?.status === "rejected" && (
            <>
              <p>Enrollment Request Rejected</p>
              <button type="button" onClick={handleEnrollmentRequest}>
                Request Again
              </button>
            </>
          )}
          {enrollmentMessage && <p className="success-message">{enrollmentMessage}</p>}
          {enrollmentError && <p className="error-message">{enrollmentError}</p>}
        </section>
      )}

      {/* Course sections and content */}
      <br />
      {!isStudent && (
        <>
          <section>
            <br />
            <h3>Course Sections</h3>
            {orderedSections.length === 0 && <p>No course sections have been added yet.</p>}
            {orderedSections.map((section, index) => (
              <div key={section._id || `section-${index}`}>
                <hr />
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
                                {contentItem.type === "link" ? (
                                  <a href={getResourceUrl(contentItem)} target="_blank" rel="noreferrer">
                                    {getResourceLabel(contentItem.type)}
                                  </a>
                                ) : (
                                  <button type="button" onClick={() => handleOpenCourseFile(contentItem)}>
                                    {getResourceLabel(contentItem.type)}
                                  </button>
                                )}
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
          <hr />
        </>
      )}

      {/* Course Reviews section */}
      <section>
        <h3>Course Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews have been submitted yet.</p>
        ) : (
          reviews.map((review) => {
            const studentName = review.student ? `${review.student.firstName} ${review.student.lastName.charAt(0)}.` : "Student";
            return (
              <div key={review._id}>
                <p>
                  <strong>{studentName}</strong>
                </p>
                <p>
                  {getStarRating(review.rating)} {review.rating} / 5
                </p>
                {review.feedback && <p>{review.feedback}</p>}
                <p>
                  <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                </p>
              </div>
            );
          })
        )}
      </section>

      <div>
        <br />
        {canEdit && (
          <>
            {" "}
            <button type="button" onClick={() => navigate(`/courses/${id}/edit`)}>
              Edit Course
            </button>
          </>
        )}
        <br />
        <button type="button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </main>
  );
}

export default CourseDetails;
