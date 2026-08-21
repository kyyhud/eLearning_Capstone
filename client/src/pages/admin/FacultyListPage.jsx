import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { viewAllFaculty, deleteUser } from "../../services/userService.js";

function FacultyList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [faculty, setFaculty] = useState([]);
  const [message, setMessage] = useState("");

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this faculty member?");
      if (!confirmDelete) return;
      await deleteUser(id);
      fetchAllFaculty();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchAllFaculty();
    if (location.state?.message) {
      setMessage(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const fetchAllFaculty = async () => {
    try {
      const response = await viewAllFaculty();
      setFaculty(response);
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
            <th>Active</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculty.map((user) => (
            <tr key={user._id}>
              <td>{user.facultyProfile?.facultyId || "-"}</td>
              <td>{user.isActive ? "Yes" : "No"}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.phone || "-"}</td>
              <td>{user.facultyProfile?.department || "-"}</td>
              <td>{user.facultyProfile?.title || "-"}</td>
              <td>
                <button onClick={() => navigate(`/admin/faculty/${user._id}`)}>View/Edit</button>|<button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
    </>
  );
}

export default FacultyList;
