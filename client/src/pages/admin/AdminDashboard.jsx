import { useNavigate, Link } from "react-router-dom";

function AdminDashboard() {
  let userEmail = sessionStorage.getItem("userEmail");

  let navigate = useNavigate();
  let logout = () => {
    sessionStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <>
      <h3>Admin Dashboard</h3>
      <h4>Welcome, {userEmail}</h4>
      <hr />
      <Link to="/admin/view-faculty">Manage Faculty</Link> |<Link to="/admin/manage-faculty">Add Faculty</Link>
      <hr />
      <button value="Logout" onClick={logout}>
        Logout
      </button>
    </>
  );
}

export default AdminDashboard;
