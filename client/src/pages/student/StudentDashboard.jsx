import { useNavigate, Link } from "react-router-dom";

function StudentDashboard() {
  let userEmail = sessionStorage.getItem("userEmail");

  let navigate = useNavigate();
  let logout = () => {
    sessionStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <>
      <h3>Student Dashboard</h3>
      <h4>Welcome, {userEmail}</h4>
      <hr />
      <Link to="/student/browse-courses">Browse Courses</Link>
      <br />
      <button value="Logout" onClick={logout}>
        Logout
      </button>
    </>
  );
}

export default StudentDashboard;
