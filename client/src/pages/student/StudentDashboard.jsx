import { useNavigate } from 'react-router-dom';

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
      <button value="Logout" onClick={logout}>Logout</button>
    </>
  );
}

export default StudentDashboard;