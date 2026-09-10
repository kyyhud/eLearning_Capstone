import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllStudents, deleteUser } from "../../services/userApi.js";

function StudentList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState(location.state?.message || "");

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const response = await getAllStudents();
        setStudents(response.data);
      } catch (error) {
        console.error(error);
        setMessage(error.message);
      }
    };
    fetchAllStudents();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: {} }); // Clear the message from the location state
    }
  }, [location.pathname, location.state?.message, navigate]);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this student?");
      if (!confirmDelete) return;
      await deleteUser(id);
      setStudents((currentStudents) => currentStudents.filter((user) => user._id !== id));
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
          {[...students]
            .sort((a, b) => a.studentProfile?.studentId - b.studentProfile?.studentId)
            .map((user) => (
              <tr key={user._id}>
                <td>{user.studentProfile?.studentId || "-"}</td>
                <td>{user.isActive ? "Yes" : "No"}</td>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.studentProfile?.fieldOfStudy || "-"}</td>
                <td>
                  <button onClick={() => navigate(`/student/${user._id}`)}>View/Edit</button>|<button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
