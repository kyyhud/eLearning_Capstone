import { useState } from 'react'

function SignUp() {
let [email, setEmail] = useState('');
let [password, setPassword] = useState('');
let [typeOfUser, setTypeOfUser] = useState('');
let msg = '';

  return (
    <>
      <h3>Sign Up Page</h3>
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
        <button type='submit'>Sign Up</button>
      </form>
      <hr />
      <p>Already have an account? <a href='/login'>Login</a></p>
    </>
  )
}

export default SignUp;