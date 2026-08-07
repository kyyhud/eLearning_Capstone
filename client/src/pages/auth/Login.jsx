import { useState } from "react";
import { loginUser } from "../../services/userService.js";
import { useNavigate } from "react-router-dom";

function Login() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [typeOfUser, setTypeOfUser] = useState("");
  let navigate = useNavigate();
  let [msg, setMsg] = useState("");

  const signIn = async (e) => {
    e.preventDefault();
    let login = { email, password, typeOfUser };
    try {
      let result = await loginUser(login);
      sessionStorage.setItem("userEmail", email);
      if (result.success) {
        if (typeOfUser === "admin") {
          navigate("/admin-dashboard");
        } else if (typeOfUser === "faculty") {
          navigate("/faculty-dashboard");
        } else if (typeOfUser === "student") {
          navigate("/student-dashboard");
        }
        setEmail("");
        setPassword("");
        setTypeOfUser("");
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
        <select value={typeOfUser} onChange={(e) => setTypeOfUser(e.target.value)}>
          <option value="">Select User Type</option>
          <option value="admin">Admin</option>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>
        <br />
        <button type="submit">Login</button>
      </form>
      <hr />
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </>
  );
}

export default Login;
