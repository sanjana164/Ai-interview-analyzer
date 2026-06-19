import { useState } from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const { loading, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  if (loading) {
    return (
      <main className='loading-screen'>
        <div className='loader-container'>
          <div className='character'>
            <div className='character__head'>
              <div className='character__eyes'>
                <div className='character__eye'></div>
                <div className='character__eye'></div>
              </div>
              <div className='character__mouth'></div>
            </div>
            <div className='character__body'></div>
            <div className='character__arms'>
              <div className='character__arm'></div>
              <div className='character__arm'></div>
            </div>
          </div>
          <div className='loading-bar-container'></div>
          <p className='loading-text'>Loading</p>
        </div>
      </main>
    )
  }

  return (
    <div>
      <main>
        <div className="form-container">
          <h2>Login</h2>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter email" />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter password" />
            </div>
            <button className="button primary-button">Login</button>
          </form>
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </main>
    </div>
  )
}

export default Login