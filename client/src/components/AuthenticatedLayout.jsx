import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function AuthenticatedLayout({ allowedRoles }) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.typeOfUser)) {
    return <Navigate to={`/${user.typeOfUser}/dashboard`} replace />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default AuthenticatedLayout;
