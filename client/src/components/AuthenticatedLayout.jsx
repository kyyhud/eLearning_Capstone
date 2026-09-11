import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { getCurrentUser } from "../services/userApi.js";

function AuthenticatedLayout({ allowedRoles }) {
  const [user, setUser] = useState(null);
  const [isCheckingAuthentication, setIsCheckingAuthentication] = useState(true);
  useEffect(() => {
    let cancelled = false;
    const validateAuthentication = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        sessionStorage.removeItem("user");
        if (!cancelled) {
          setIsCheckingAuthentication(false);
        }
        return;
      }
      try {
        const response = await getCurrentUser();
        const currentUser = response.data;
        if (!cancelled) {
          sessionStorage.setItem("user", JSON.stringify(currentUser));
          setUser(currentUser);
        }
      } catch {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsCheckingAuthentication(false);
        }
      }
    };
    validateAuthentication();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isCheckingAuthentication) {
    return <p>Checking authentication...</p>;
  }
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
