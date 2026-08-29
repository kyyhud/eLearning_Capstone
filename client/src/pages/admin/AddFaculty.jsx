import { useState } from "react";
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

function AddFaculty() {
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
        phone: formData.phone,
        facultyProfile: {
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
        <label htmlFor="firstName">First Name:</label> 
          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
        <br />
        <label htmlFor="lastName">Last Name:</label>
        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
        <br />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        <br />
        <label htmlFor="phone">Phone:</label>
        <input type="text" id="phone" name="phone" maxLength={13} value={formData.phone} onChange={handleChange} />
        <br />
        <label htmlFor="department">Department:</label>
        <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} />
        <br />
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
        <br />
        <label htmlFor="specialization">Specialization:</label>
        <input type="text" id="specialization" name="specialization" value={formData.specialization} onChange={handleChange} />
        <br />
        <label htmlFor="bio">Bio:</label>
        <textarea id="bio" name="bio" maxLength={500} value={formData.bio} onChange={handleChange} />
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
    </>
  );
}

export default AddFaculty;
