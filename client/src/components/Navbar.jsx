import { Link, useNavigate } from "react-router-dom";

function Navbar({ user }) {
  const navigate = useNavigate();

  const typeOfUser = user.typeOfUser;

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="app-nav">
      {typeOfUser === "admin" && (
        <>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/faculty">Faculty</Link>
          <Link to="/admin/faculty/add">Add Faculty</Link>
          <Link to="/admin/students">Students</Link>
          <Link to="/admin/courses">Courses</Link>
          <Link to="/admin/courses/add">Add Course</Link>
        </>
      )}
      {typeOfUser === "faculty" && (
        <>
          <Link to="/faculty/dashboard">Dashboard</Link>
          <Link to="/faculty/courses">My Courses</Link>
          <Link to="/faculty/enrollments">Enrollment Requests</Link>
          <Link to={`/faculty/${user._id}`}>Profile</Link>
          <Link to="/faculty/settings">Settings</Link>
        </>
      )}
      {typeOfUser === "student" && (
        <>
          <Link to="/student/dashboard">Dashboard</Link>
          <Link to="/student/courses">Browse Courses</Link>
          <Link to="/student/courses/my">My Courses</Link>
          <Link to={`/student/${user._id}`}>Profile</Link>
          <Link to="/student/settings">Settings</Link>
        </>
      )}
      <span className="nav-user">
        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
        <span className="nav-user-role"> · {user.typeOfUser}</span>
      </span>
      <Link to="/" onClick={handleLogout}>
        Logout
      </Link>
    </nav>
  );
}

export default Navbar;
