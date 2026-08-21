import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllStudents } from "../../services/userService.js";

function StudentList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllStudents();
    if (location.state?.message) {
      setMessage(location.state.message);
      navigate(location.pathname, { replace: true }); // Clear the message from the location state
    }
  }, [location, navigate]);

  const fetchAllStudents = async () => {
    try {
      const response = await getAllStudents();
      setStudents(response);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h3>Student Management</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <h4>Student List</h4>
      <table border="1">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Active</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Field of Study</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((user) => (
            <tr key={user._id}>
              <td>{user.id}</td>
              <td>{user.active ? "Yes" : "No"}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.studentProfile?.fieldOfStudy || "-"}</td>
              <td>
                <button onClick={() => navigate(`/admin/students/${user._id}`)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
