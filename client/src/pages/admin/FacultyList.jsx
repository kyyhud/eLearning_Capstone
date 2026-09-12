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
      {message && <p className="error-message">{message}</p>}
      {facultyToDelete && (
        <div className="confirmation-dialog" role="dialog" aria-labelledby="delete-faculty-heading">
          <h4 id="delete-faculty-heading">Delete faculty member?</h4>
          <p>
            Are you sure you want to delete {facultyToDelete.firstName} {facultyToDelete.lastName}? This action cannot be undone.
          </p>
          <div className="dialog-actions">
            <button className="button-danger" type="button" onClick={handleDelete}>
              Delete
            </button>
            <button className="button-secondary" type="button" onClick={() => setFacultyToDelete(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <h4>Faculty Members</h4>
      <table className="data-table" border="1">
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
                <td>
                  <span className={`status-badge ${user.isActive ? "status-active" : "status-inactive"}`}>{user.isActive ? "Yes" : "No"}</span>
                </td>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.phone || "-"}</td>
                <td>{user.facultyProfile?.department || "-"}</td>
                <td>{user.facultyProfile?.title || "-"}</td>
                <td>
                  <div className="table-actions">
                    <button onClick={() => navigate(`/faculty/${user._id}`)}>View/Edit</button>
                    <button className="button-danger" onClick={() => setFacultyToDelete(user)}>
                      Delete
                    </button>
                  </div>
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
