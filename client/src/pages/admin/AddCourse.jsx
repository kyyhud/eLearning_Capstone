import { useState, useEffect } from "react";
import { createCourse } from "../../services/courseApi.js";
import { viewAllFaculty } from "../../services/userApi.js";

function AddCourse() {
  const initialFormData = {
    courseLevel: "",
    title: "",
    category: "",
    description: "",
    faculty: "",
    durationWeeks: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [facultyMembers, setFacultyMembers] = useState([]);

  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const faculty = await viewAllFaculty();
        setFacultyMembers(faculty);
      } catch (error) {
        alert(`Error loading faculty: ${error.message}`);
      }
    };
    loadFaculty();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourse(formData);
      alert("Course added successfully");
      setFormData(initialFormData);
    } catch (error) {
      alert(`Error adding course: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Add Course</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="courseLevel">Course Level:</label>
          <select id="courseLevel" name="courseLevel" value={formData.courseLevel} onChange={handleChange} required>
            <option value="">Select Level</option>
            <option value="100">100 - Introductory</option>
            <option value="200">200 - Intermediate</option>
            <option value="300">300 - Advanced</option>
            <option value="400">400 - Expert</option>
          </select>
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="faculty">Faculty:</label>
          <select id="faculty" name="faculty" value={formData.faculty} onChange={handleChange} required>
            <option value="">Select Faculty</option>
            {[...facultyMembers]
              .sort((a, b) => a.lastName.localeCompare(b.lastName))
              .map((faculty) => (
                <option key={faculty._id} value={faculty._id}>
                  {faculty.lastName}
                  {","} {faculty.firstName}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="durationWeeks">Duration (weeks):</label>
          <input type="number" id="durationWeeks" name="durationWeeks" value={formData.durationWeeks} onChange={handleChange} required />
        </div>
        <button type="submit">Add Course</button>
      </form>
    </div>
  );
}

export default AddCourse;
