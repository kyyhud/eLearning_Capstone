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
};

function AddEditFaculty() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (id) {
      loadFaculty();
    } else {
      setFormData(emptyForm);
      if (location.state && location.state.message) {
        setMessage(location.state.message);
      }
    }
  }, [id, location.state]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const facultyData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
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
        navigate("/admin/manage-faculty", {
          state: {
            message: "Faculty member updated successfully.",
          },
        });
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
      <h4>{isEditing ? "Edit Faculty Member" : "Add Faculty Member"}</h4>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input
          type="password"
          name="password"
          placeholder="New Password (optional for current faculty)"
          value={formData.password}
          onChange={handleChange}
          required={!isEditing}
        />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} />
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
        <input type="text" name="specialization" placeholder="Specialization" value={formData.specialization} onChange={handleChange} />
        <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange} />
        <button type="submit">{isEditing ? "Update Faculty" : "Add Faculty"}</button>
      </form>
      <br />
      <Link to="/admin-dashboard">Back to Dashboard</Link>
    </>
  );
}

export default AddEditFaculty;
