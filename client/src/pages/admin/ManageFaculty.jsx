import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { viewAllFaculty } from "../../services/userService.js";

function ViewFaculty() {
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

  return (
    <>
      <h3>Faculty Management</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}
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
            <th>Update</th>
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
              <td>
                <Link to={`/admin/manage-faculty/${user._id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <Link to="/admin-dashboard">Back to Dashboard</Link>
    </>
  );
}

export default ViewFaculty;
