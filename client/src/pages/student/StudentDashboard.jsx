function StudentDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <>
      <h3>Student Dashboard</h3>
      <h4>Welcome, {user.email}</h4>
    </>
  );
}

export default StudentDashboard;
