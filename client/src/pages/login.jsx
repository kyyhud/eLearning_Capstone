import { useState } from 'react';

function Login() {
let [email, setEmail] = useState('');
let [password, setPassword] = useState('');
let [typeOfUser, setTypeOfUser] = useState('');
let msg = '';

  return (
    <>
      <h3>Login Page</h3>
      <form> 
        <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} /><br />
        <select value={typeOfUser} onChange={(e) => setTypeOfUser(e.target.value)}>
          <option value=''>Select User Type</option>
          <option value='admin'>Admin</option>
          <option value='faculty'>Faculty</option>
          <option value='student'>Student</option>
        </select>
        <br />
        <button type='submit'>Login</button>
      </form>
      <hr />
      <p>Don't have an account? <a href='/signup'>Sign Up</a></p>
    </>
  )
}

export default Login;