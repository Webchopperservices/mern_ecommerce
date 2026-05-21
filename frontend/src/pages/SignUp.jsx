import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function SignUp() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const auth = localStorage.getItem('user')
    if (auth) {
      navigate('/')
    }
  }, [navigate])

  const collection = async () => {

  if (!name || !email || !password || !role) {
    setError("All fields are required ❌")
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters 🔒")
    return;
  }

  let result = await fetch('http://localhost:5000/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  result = await result.json()

  // user already exists
  if (result.result === "User already exists") {
    setError("User already exists ❌")
    return;
  }

  // success case
  if (result.auth) {
    setError("")
    
    alert("Registration Successful 🎉 Please login now")

    // 🚀 redirect to login page
    navigate('/login')

  } else {
    setError("Something went wrong ❌")
  }
}

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>

      <h2 className="mb-3">Register</h2>

      {/* ❗ Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      <input
        type='text'
        className="form-control my-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Enter Name'
      />

      <input
        type='email'
        className="form-control my-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Enter Email'
      />

      <input
        type='password'
        className="form-control my-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Enter Password'
      />

      <select
        className="form-control my-2"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">Select Role</option>
        <option value="admin">admin</option>
        <option value="user">user</option>
      </select>

      <button
        type='button'
        className="btn btn-primary w-100 mt-2"
        onClick={collection}
      >
        Register
      </button>
      <span><strong>Existing User? <Link to="/login">Log in</Link></strong></span>
      

    </div>
  )
}

export default SignUp