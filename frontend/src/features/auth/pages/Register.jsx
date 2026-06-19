import React from 'react'
import {useNavigate,Link} from 'react-router'


const Register = () => {
  const navigate = useNavigate()
   const handleSubmit = (e) => {
    e.preventDefault()

  }
  return (
    <div>
      <main>
        <div className="form-container">
          <h2>Register</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="Username">Username</label>
              <input type="text" placeholder="Enter username" />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="Enter email" />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" placeholder="Enter password" />
            </div>
            <button className="button primary-button">Register</button>
          </form>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </main>
    </div>
  )
}

export default Register
