import { Link } from "react-router-dom";

function AdminDashboard() {
  const userEmail = sessionStorage.getItem("userEmail");

  return (
    <>
      <h3>Admin Dashboard</h3>
      <h4>Welcome, {userEmail}</h4>
    </>
  );
}

export default AdminDashboard;
