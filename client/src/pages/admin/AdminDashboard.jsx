import { Link } from "react-router-dom";

function AdminDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <>
      <h3>Admin Dashboard</h3>
      <h4>Welcome, {user?.email}</h4>
    </>
  );
}

export default AdminDashboard;
