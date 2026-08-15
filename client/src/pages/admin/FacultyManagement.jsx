import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { viewAllFaculty, registerFaculty } from "../../services/userService.js";

function FacultyManagement() {
  const [faculty, setFaculty] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    department: "",
    title: "",
    specialization: "",
  });

  useEffect(() => {
    fetchAllFaculty();
  }, []);

  const fetchAllFaculty = async () => {
    try {
      const response = await viewAllFaculty();
      setFaculty(response);
      setMessage("");
    } catch (error) {
      console.error(error);
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
      const newFaculty = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        bio: formData.bio,
        typeOfUser: "faculty",
        facultyProfile: {
          department: formData.department,
          title: formData.title,
          specialization: formData.specialization,
        },
      };
      await registerFaculty(newFaculty);
      setMessage("");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        bio: "",
        department: "",
        title: "",
        specialization: "",
      });

      fetchAllFaculty();
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
        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Temporary Password" value={formData.password} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} />
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
        <input type="text" name="specialization" placeholder="Specialization" value={formData.specialization} onChange={handleChange} />
        <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange} />
        <button type="submit">Add Faculty</button>
      </form>
      <br />
      <h4>Faculty Members</h4>
      <table border="1">
        <thead>
          <tr>
            <th>Faculty ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Title</th>
            <th>Specialization</th>
          </tr>
        </thead>
        <tbody>
          {faculty.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.facultyProfile?.department || "-"}</td>
              <td>{user.facultyProfile?.title || "-"}</td>
              <td>{user.facultyProfile?.specialization || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <Link to="/admin-dashboard">Back to Dashboard</Link>
    </>
  );
}

export default FacultyManagement;
