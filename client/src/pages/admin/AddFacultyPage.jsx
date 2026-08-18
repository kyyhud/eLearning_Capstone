import { useState } from "react";
import { Link } from "react-router-dom";
import { registerFaculty } from "../../services/userService.js";

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

function AddFacultyPage() {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(emptyForm);

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
        password: formData.password,
        isActive: formData.isActive,
        facultyProfile: {
          phone: formData.phone,
          department: formData.department,
          title: formData.title,
          specialization: formData.specialization,
          bio: formData.bio,
        },
      };
      await registerFaculty(facultyData);
      setMessage("Faculty member added successfully.");
      setFormData(emptyForm);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  return (
    <>
      <h3>Faculty Management</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <h4>Add Faculty Member</h4>
      <form onSubmit={handleSubmit}>
        First Name: <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        <br />
        Last Name: <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        <br />
        Email: <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        <br />
        Password: <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        <br />
        Phone: <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        <br />
        Department: <input type="text" name="department" value={formData.department} onChange={handleChange} />
        <br />
        Title: <input type="text" name="title" value={formData.title} onChange={handleChange} />
        <br />
        Specialization: <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} />
        <br />
        Bio: <textarea name="bio" value={formData.bio} onChange={handleChange} />
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
          />
        </label>
        <br />
        <button type="submit">Add Faculty</button>
      </form>
      <br />
      <Link to="/admin/faculty-list">Show Faculty List</Link>
      {" | "}
      <Link to="/admin-dashboard">Back to Dashboard</Link>
    </>
  );
}

export default AddFacultyPage;
