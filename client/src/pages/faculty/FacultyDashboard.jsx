import { useNavigate, Link } from "react-router-dom";

function FacultyDashboard() {
  let user = JSON.parse(sessionStorage.getItem("user"));

  let navigate = useNavigate();
  let logout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <h3>Faculty Dashboard</h3>
      <h4>Welcome, {user.email}</h4>
      <hr />
      <Link to="/faculty/courses">View Courses</Link>
      <Link to={`/faculty/faculty-profile/${user._id}`}>View/Edit Profile</Link>
      <hr />
      <button value="Logout" onClick={logout}>
        Logout
      </button>
    </>
  );
}

export default FacultyDashboard;