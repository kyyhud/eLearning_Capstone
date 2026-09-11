import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentCoursework, markContentComplete } from "../../services/enrollmentApi.js";
import { getCourseReviews, submitCourseReview } from "../../services/reviewApi.js";
import { getCourseContentFile } from "../../services/courseApi.js";

function Coursework() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [review, setReview] = useState(null);
  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    // Load the full course and this student's enrollment/progress/review
    const fetchCoursework = async () => {
      try {
        setLoading(true);
        const [courseworkResponse, reviewResponse] = await Promise.all([getStudentCoursework(id), getCourseReviews(id)]);
        const reviewData = reviewResponse.data;
        const courseData = courseworkResponse.data.course;
        const enrollmentData = courseworkResponse.data.enrollment;
        setCourse(courseData);
        setEnrollment(enrollmentData);
        const existingReview = reviewData.reviews.find((courseReview) => courseReview.enrollment?.toString() === enrollmentData._id.toString());
        setReview(existingReview || null);
        setMessage("");
      } catch (error) {
        console.error(error);
        setCourse(null);
        setEnrollment(null);
        setReview(null);
        setMessage(error.response?.data?.error || error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoursework();
  }, [id]);

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

  // Handle submitting a course review
  const handleSubmitReview = async (event) => {
    event.preventDefault();
    try {
      setReviewMessage("");
      const response = await submitCourseReview(id, {
        rating: Number(rating),
        feedback,
      });
      setReview(response.data);
      setRating("");
      setFeedback("");
      setReviewMessage("Review submitted successfully.");
    } catch (error) {
      console.error(error);
      setReviewMessage(error.response?.data?.error || error.response?.data?.message || error.message);
    }
  };

  // Handle opening course content file in a new tab
  const handleOpenCourseFile = async (contentItem) => {
    const newTab = window.open("about:blank", "_blank");
    if (newTab) {
      newTab.opener = null;
    }
    try {
      setMessage("");
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
      setMessage(error.message);
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
      {/* Course discussion Button */}
      <button type="button" onClick={() => navigate(`/courses/${id}/messages`)}>
        Course Discussion
      </button>
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
              <table border="1" align="center">
                <thead>
                  <tr>
                    <th>Content</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Resource</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {section.content.map((content) => {
                    const completed = isContentComplete(content._id);
                    return (
                      <tr key={content._id}>
                        <td>
                          <strong>{content.title}</strong>
                          {content.description && <p>{content.description}</p>}
                          {content.fileName && (
                            <p>
                              <strong>File:</strong> {content.fileName}
                            </p>
                          )}
                        </td>
                        <td>{content.type}</td>
                        <td>{content.isRequired ? "Required" : "Optional"}</td>
                        <td>
                          {content.type === "link" ? (
                            <a href={getResourceUrl(content)} target="_blank" rel="noreferrer">
                              {getResourceLabel(content.type)}
                            </a>
                          ) : (
                            <button type="button" onClick={() => handleOpenCourseFile(content)}>
                              {getResourceLabel(content.type)}
                            </button>
                          )}
                        </td>
                        <td>
                          {completed ? (
                            "Completed"
                          ) : (
                            <button type="button" onClick={() => handleMarkComplete(content._id)}>
                              Mark Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>
        ))
      )}

      <hr />
      <section>
        <h3>Course Review</h3>
        {progressPercent < 100 ? (
          <p>Complete the course to leave a review.</p>
        ) : review ? (
          <div>
            <p>
              <strong>Your Rating:</strong> {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </p>
            {review.feedback && (
              <p>
                <strong>Your Feedback:</strong> {review.feedback}
              </p>
            )}
            <p>Your review has been submitted and cannot be changed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview}>
            <div>
              <label htmlFor="rating">Rating:</label>
              <select id="rating" value={rating} onChange={(event) => setRating(event.target.value)} required>
                <option value="">Select a rating</option>
                <option value="5">★★★★★ - Excellent</option>
                <option value="4">★★★★☆ - Very Good</option>
                <option value="3">★★★☆☆ - Good</option>
                <option value="2">★★☆☆☆ - Fair</option>
                <option value="1">★☆☆☆☆ - Poor</option>
              </select>
            </div>
            <br />
            <div>
              <label htmlFor="feedback">Feedback:</label>
              <br />
              <textarea id="feedback" value={feedback} onChange={(event) => setFeedback(event.target.value)} rows="4" />
            </div>
            <br />
            <button type="submit">Submit Review</button>
          </form>
        )}

        {reviewMessage && <p>{reviewMessage}</p>}
      </section>
    </>
  );
}

export default Coursework;
