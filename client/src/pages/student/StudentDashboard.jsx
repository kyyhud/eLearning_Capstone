import { Outlet, useNavigate } from 'react-router-dom';

function StudentDashboard() {

  let userEmail = sessionStorage.getItem("userEmail");

  let navigate = useNavigate();
  let logout = () => {
    sessionStorage.removeItem("userEmail");
    navigate('/login');
  }

  return (
    <>
      <h3>Student Dashboard</h3>
      <h4>Welcome, {userEmail}</h4>
      <hr />
      <a href="/student/browse-courses">Browse Courses</a>
      <br />
      <div>
      <Outlet />
      </div>
      <button value="Logout" onClick={logout}>Logout</button>
    </>
  );
}

export default StudentDashboard;