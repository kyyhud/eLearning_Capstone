import { useState } from "react";
import { Link } from "react-router-dom";
import { studentSignUp } from "../../services/userService.js";

function StudentSignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  const signUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMsg("Passwords do not match.");
      return;
    }
    const newUser = { firstName, lastName, email, password };
    try {
      const result = await studentSignUp(newUser);
      if (result.success) {
        setMsg("Student account created successfully. Please login.");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setMsg(error.response?.data?.error || "Sign up failed. Please try again.");
    }
  };

  return (
    <>
      <h3>Student Sign Up Page</h3>
      <span style={{ color: "red" }}>{msg}</span>
      <form onSubmit={signUp}>
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <br />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <br />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <br />
        <button type="submit">Sign Up</button>
      </form>
      <hr />
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </>
  );
}

export default StudentSignUpPage;
