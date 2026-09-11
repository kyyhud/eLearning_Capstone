import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { viewAllFaculty, deleteUser } from "../../services/userApi.js";

function FacultyList() {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [message, setMessage] = useState("");
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  useEffect(() => {
    const fetchAllFaculty = async () => {
      try {
        const response = await viewAllFaculty();
        setFaculty(response.data);
      } catch (error) {
        setMessage(error.message);
      }
    };
    fetchAllFaculty();
  }, []);

  const handleDelete = async () => {
    if (!facultyToDelete) return;
    setMessage("");
    try {
      await deleteUser(facultyToDelete._id);
      setFaculty((currentFaculty) => currentFaculty.filter((user) => user._id !== facultyToDelete._id));
      setFacultyToDelete(null);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <h3>Faculty Management</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}
      {facultyToDelete && (
        <div className="confirmation-dialog" role="dialog" aria-labelledby="delete-faculty-heading">
          <h4 id="delete-faculty-heading">Delete faculty member?</h4>
          <p>
            Are you sure you want to delete {facultyToDelete.firstName} {facultyToDelete.lastName}? This action cannot be undone.
          </p>
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
          <button type="button" onClick={() => setFacultyToDelete(null)}>
            Cancel
          </button>
        </div>
      )}
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
          {[...faculty]
            .sort((a, b) => a.facultyProfile?.facultyId - b.facultyProfile?.facultyId)
            .map((user) => (
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
                  <button onClick={() => navigate(`/faculty/${user._id}`)}>View/Edit</button>|<button onClick={() => setFacultyToDelete(user)}>Delete</button>
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
