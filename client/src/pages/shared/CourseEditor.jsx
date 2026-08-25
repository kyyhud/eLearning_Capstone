import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById, updateCourse } from "../../services/courseService.js";
import { viewAllFaculty } from "../../services/userService.js";

const emptyForm = {
  title: "",
  description: "",
  durationWeeks: "",
  faculty: "",
};

function CourseEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);
  const [courseId, setCourseId] = useState("");
  const [faculty, setFaculty] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));
  const isAdmin = user?.typeOfUser === "admin";

  useEffect(() => {
    loadCourse();
    if (isAdmin) {
      loadFaculty();
    }
  }, [id, isAdmin]);

  const loadCourse = async () => {
    try {
      setError("");
      const course = await getCourseById(id);
      setCourseId(course.courseId);
      setFormData({
        title: course.title || "",
        description: course.description || "",
        durationWeeks: course.durationWeeks ?? "",
        faculty: course.faculty?._id || "",
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const loadFaculty = async () => {
    try {
      const facultyData = await viewAllFaculty();
      setFaculty(facultyData);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const updateData = isAdmin
        ? formData
        : {
            description: formData.description,
          };
      await updateCourse(id, updateData);
      setMessage("Course updated successfully.");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main>
      <h2>Edit Course</h2>
      {error && <p>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <section>
          <h3>Course Information</h3>
          <div>
            <label htmlFor="courseId">Course ID</label>
            <input type="text" id="courseId" value={courseId} disabled />
          </div>
          <div>
            <label htmlFor="title">Course Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} disabled={!isAdmin} required />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="durationWeeks">Duration</label>
            <input type="number" id="durationWeeks" name="durationWeeks" value={formData.durationWeeks} onChange={handleChange} disabled={!isAdmin} required />
          </div>
          {isAdmin && (
            <div>
              <label htmlFor="faculty">Faculty</label>
              <select id="faculty" name="faculty" value={formData.faculty} onChange={handleChange} required>
                <option value="">Select Faculty</option>

                {faculty.map((facultyMember) => (
                  <option key={facultyMember._id} value={facultyMember._id}>
                    {facultyMember.firstName} {facultyMember.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        <section>
          <h3>Course Sections</h3>
          <p>Course sections and learning materials will be managed here.</p>
        </section>

        <div>
          <button type="submit">Save Updates</button>
          {" | "}
          <button type="button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </form>
    </main>
  );
}

export default CourseEditorPage;
