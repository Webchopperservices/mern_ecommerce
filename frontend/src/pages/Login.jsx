import React, { useState, useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {

    const auth = JSON.parse(localStorage.getItem('user'));

    if (auth) {

      if (auth.role === "admin") {
        navigate("/home");
      } else {
        navigate("/");
      }

    }

  }, [navigate]);

  const handleLogin = async () => {

    // 🔥 validation
    if (!email || !password) {
      setError("Please enter email and password ❌")
      return;
    }

    let result = await fetch("http://localhost:5000/login", {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    result = await result.json();

    console.log(result);

    // 🔥 backend response handling
    if (result.auth) {

      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.auth);

      if (result.user.role === "admin") {
        navigate("/home");
      } else {
        navigate("/");
      }

    } else {
      setError(result.result || "Invalid Email or Password ❌");
    }
  }
  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>

      <h2 className="mb-3">Login</h2>

      {/* ❗ Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

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

      <button
        type='button'
        className="btn btn-primary w-100 mt-2"
        onClick={handleLogin}
      >
        Login
      </button>
      <span><strong>New User Create? <Link to="/signup">Sign Up</Link></strong></span>
      

    </div>
  )
}

export default Login
