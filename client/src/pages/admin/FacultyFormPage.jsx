import { useState, useEffect } from "react";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { registerFaculty, getFacultyById, updateFaculty } from "../../services/userService.js";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  bio: "",
  department: "",
  title: "",
  specialization: "",
  isActive: true,
};

function FacultyForm() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const isExistingFaculty = Boolean(id);

  useEffect(() => {
    setIsEditing(false);
    if (id) {
      loadFaculty();
    } else {
      setFormData(emptyForm);
    }
  }, [id]);

  const loadFaculty = async () => {
    try {
      const facultyMember = await getFacultyById(id);
      setFormData({
        firstName: facultyMember.firstName,
        lastName: facultyMember.lastName,
        email: facultyMember.email,
        password: "",
        phone: facultyMember.facultyProfile?.phone || "",
        department: facultyMember.facultyProfile?.department || "",
        title: facultyMember.facultyProfile?.title || "",
        specialization: facultyMember.facultyProfile?.specialization || "",
        bio: facultyMember.facultyProfile?.bio || "",
        isActive: facultyMember.isActive,
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    loadFaculty();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const facultyData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        isActive: formData.isActive,
        facultyProfile: {
          phone: formData.phone,
          department: formData.department,
          title: formData.title,
          specialization: formData.specialization,
          bio: formData.bio,
        },
      };
      if (isEditing) {
        if (formData.password) {
          facultyData.password = formData.password;
        }
        await updateFaculty(id, facultyData);
        setMessage("Faculty member updated successfully.");
        setIsEditing(false);
      } else {
        facultyData.password = formData.password;
        await registerFaculty(facultyData);
        setMessage("Faculty member added successfully.");
        setFormData(emptyForm);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  return (
    <>
      <h3>Faculty Management</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <h4>{!isExistingFaculty ? "Add Faculty Member" : isEditing ? "Edit Faculty Member" : "Faculty Details"}</h4>
      <form onSubmit={handleSubmit}>
        First Name:{" "}
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} disabled={isExistingFaculty && !isEditing} required />
        <br />
        Last Name: <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} disabled={isExistingFaculty && !isEditing} required />
        <br />
        Email: <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={isExistingFaculty && !isEditing} required />
        <br />
        Password (optional for current faculty):{" "}
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isExistingFaculty && !isEditing}
          required={!isEditing}
        />
        <br />
        Phone: <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={isExistingFaculty && !isEditing} />
        <br />
        Department: <input type="text" name="department" value={formData.department} onChange={handleChange} disabled={isExistingFaculty && !isEditing} />
        <br />
        Title: <input type="text" name="title" value={formData.title} onChange={handleChange} disabled={isExistingFaculty && !isEditing} />
        <br />
        Specialization:{" "}
        <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} disabled={isExistingFaculty && !isEditing} />
        <br />
        Bio: <textarea name="bio" value={formData.bio} onChange={handleChange} disabled={isExistingFaculty && !isEditing} />
        <br />
        <label>
          Status: {formData.isActive ? "Active" : "Inactive"}
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                isActive: e.target.checked,
              }))
            }
            disabled={isExistingFaculty && !isEditing}
          />
        </label>
        <br />
        {isExistingFaculty && !isEditing && (
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit Faculty
          </button>
        )}
        {!isExistingFaculty && <button type="submit">Add Faculty</button>}
        {isExistingFaculty && isEditing && (
          <>
            <button type="submit">Update Faculty</button>|
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          </>
        )}
      </form>
      <br />
      <Link to="/admin/faculty-list">Show Faculty List</Link> |<Link to="/admin-dashboard">Back to Dashboard</Link>
    </>
  );
}

export default FacultyForm;
