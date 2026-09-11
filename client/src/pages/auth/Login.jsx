import { useState } from "react";
import { loginUser } from "../../services/userApi.js";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const signIn = async (e) => {
    e.preventDefault();
    const login = { email, password };
    try {
      const result = await loginUser(login);
      if (result.success) {
        const { token, user } = result.data;
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("token", token);
        const userType = user.typeOfUser;
        if (userType === "admin") {
          navigate("/admin/dashboard");
        } else if (userType === "faculty") {
          navigate("/faculty/dashboard");
        } else if (userType === "student") {
          navigate("/student/dashboard");
        }
        setEmail("");
        setPassword("");
        setMsg("");
      }
    } catch (error) {
      setMsg(error.response?.data?.error || "Invalid credentials. Please try again.");
    }
  };

  return (
    <>
      <h3>Login Page</h3>
      <span style={{ color: "red" }}>{msg}</span>
      <form onSubmit={signIn}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button type="submit">Login</button>
      </form>
      <hr />
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </>
  );
}

export default Login;
