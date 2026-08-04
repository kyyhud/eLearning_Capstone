import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService.js";

function SignUp() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [typeOfUser, setTypeOfUser] = useState("");
  let [msg, setMsg] = useState("");
  let navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMsg("Passwords do not match.");
      return;
    }
    let newUser = { email, password, typeOfUser };
    try {
      let result = await registerUser(newUser);
      if (result.success) {
        setMsg("User registered successfully. Please login.");
        setEmail("");
        setPassword("");
        setTypeOfUser("");
        setConfirmPassword("");
      }
    } catch (error) {
      setMsg(error.response?.data?.error || "Sign up failed. Please try again.");
    }
  };

  return (
    <>
      <h3>Sign Up Page</h3>
      <span style={{ color: "red" }}>{msg}</span>
      <form onSubmit={signUp}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <br />
        <select value={typeOfUser} onChange={(e) => setTypeOfUser(e.target.value)}>
          <option value="">Select User Type</option>
          <option value="admin">Admin</option>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>
        <br />
        <button type="submit">Sign Up</button>
      </form>
      <hr />
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </>
  );
}

export default SignUp;
