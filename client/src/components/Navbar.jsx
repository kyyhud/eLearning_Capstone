import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  if (!user) return null;
  const typeOfUser = user.typeOfUser;

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav>
      {typeOfUser === "admin" && (
        <>
          <Link to="/admin/dashboard">Dashboard</Link> { " | " }
          <Link to="/admin/faculty">Faculty</Link> { " | " }
          <Link to="/admin/faculty/add">Add Faculty</Link> { " | " }
        </>
      )}
      {typeOfUser === "faculty" && (
        <>
          <Link to="/faculty/dashboard">Dashboard</Link> { " | " }
          <Link to="/faculty/courses">My Courses</Link> { " | " }
          <Link to={`/faculty/profile/${user._id}`}>Profile</Link> { " | " }
          <Link to="/faculty/settings">Settings</Link> { " | " }
        </>
      )}
      {typeOfUser === "student" && (
        <>
          <Link to="/student/dashboard">Dashboard</Link> { " | " }
          <Link to="/student/browse-courses">Browse Courses</Link> { " | " }
        </>
      )}
      <Link to="/" onClick={handleLogout}>
        Logout
      </Link>
    </nav>
  );
}

export default Navbar;
