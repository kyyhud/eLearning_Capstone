import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById, updateCourse } from "../../services/courseService.js";
import { viewAllFaculty } from "../../services/userService.js";

const emptyForm = {
  title: "",
  description: "",
  durationWeeks: "",
  faculty: "",
  sections: [],
};

function CourseEditor() {
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
        sections: course.sections || [],
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
      const sections = formData.sections.map((section, index) => ({
  ...section,
  order: index + 1,
}));
      const updateData = isAdmin
  ? {
      ...formData,
      sections,
    }
  : {
      description: formData.description,
      sections,
    };
      await updateCourse(id, updateData);
      setMessage("Course updated successfully.");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddSection = () => {
  setFormData((prev) => ({
    ...prev,
    sections: [
      ...prev.sections,
      {
        title: "",
        description: "",
        order: prev.sections.length + 1,
        content: [],
      },
    ],
  }));
};

  const handleSectionChange = (index, e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    sections: prev.sections.map((section, sectionIndex) =>
      sectionIndex === index
        ? {
            ...section,
            [name]: value,
          }
        : section
    ),
  }));
};

const handleRemoveSection = (index) => {
  setFormData((prev) => ({
    ...prev,
    sections: prev.sections
      .filter((_, sectionIndex) => sectionIndex !== index)
      .map((section, sectionIndex) => ({
        ...section,
        order: sectionIndex + 1,
      })),
  }));
};

const handleMoveSection = (index, direction) => {
  setFormData((prev) => {
    const sections = [...prev.sections];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sections.length) {
      return prev;
    }
    [sections[index], sections[newIndex]] = [
      sections[newIndex],
      sections[index],
    ];
    return {
      ...prev,
      sections: sections.map((section, sectionIndex) => ({
        ...section,
        order: sectionIndex + 1,
      })),
    };
  });
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
          {formData.sections.length === 0 && (
  <p>No course sections have been added yet.</p>
)}

{formData.sections.map((section, index) => (
  <div key={section._id || `section-${index}`}>
    <h4>Section {index + 1}</h4>
    <div>
      <label htmlFor={`section-title-${index}`}>Title</label>
      <input
        type="text"
        id={`section-title-${index}`}
        name="title"
        value={section.title}
        onChange={(e) => handleSectionChange(index, e)}
        required
      />
    </div>
    <div>
      <label htmlFor={`section-description-${index}`}>
        Description
      </label>
      <textarea
        id={`section-description-${index}`}
        name="description"
        value={section.description}
        onChange={(e) => handleSectionChange(index, e)}
      />
    </div>
    <button
  type="button"
  onClick={() => handleMoveSection(index, -1)}
  disabled={index === 0}
>
  Move Up
</button>

<button
  type="button"
  onClick={() => handleMoveSection(index, 1)}
  disabled={index === formData.sections.length - 1}
>
  Move Down
</button>
    <button
      type="button"
      onClick={() => handleRemoveSection(index)}
    >
      Remove Section
    </button>
  </div>
))}

<button type="button" onClick={handleAddSection}>
  Add Section
</button>
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

export default CourseEditor;
