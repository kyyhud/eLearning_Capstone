import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents, deleteUser } from "../../services/userApi.js";

function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const response = await getAllStudents();
        setStudents(response.data);
      } catch (error) {
        setMessage(error.message);
      }
    };
    fetchAllStudents();
  }, []);

  const handleDelete = async () => {
    if (!studentToDelete) return;
    setMessage("");
    try {
      await deleteUser(studentToDelete._id);
      setStudents((currentStudents) => currentStudents.filter((user) => user._id !== studentToDelete._id));
      setStudentToDelete(null);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h3>Student Management</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}
      {studentToDelete && (
        <div className="confirmation-dialog" role="dialog" aria-labelledby="delete-student-heading">
          <h4 id="delete-student-heading">Delete student?</h4>
          <p>
            Are you sure you want to delete {studentToDelete.firstName} {studentToDelete.lastName}? This action cannot be undone.
          </p>
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
          <button type="button" onClick={() => setStudentToDelete(null)}>
            Cancel
          </button>
        </div>
      )}
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
                  <button onClick={() => navigate(`/student/${user._id}`)}>View/Edit</button>|<button onClick={() => setStudentToDelete(user)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
