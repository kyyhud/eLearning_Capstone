import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login.jsx'
import SignUp from './pages/signUp.jsx'
import AdminDashboard from './pages/adminDashboard.jsx'
import UserDashboard from './pages/userDashboard.jsx'

import './App.css'

function App() {

  return (
    <>
    <h2>eLearning App - Capstone Project</h2>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
    </Routes>
    </>

  )
}


export default App
