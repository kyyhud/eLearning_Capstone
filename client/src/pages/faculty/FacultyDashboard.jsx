function FacultyDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <>
      <h3>Faculty Dashboard</h3>
      <h4>Welcome, {user.email}</h4>
    </>
  );
}

export default FacultyDashboard;