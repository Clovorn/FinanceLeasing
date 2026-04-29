import React, { useState } from 'react'
import { login, signup, AuthError, MissingIdentityError } from '@netlify/identity'
import '../styles/Login.css'

export default function Login({ setUser }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')

    try {
      if (mode === 'signup') {
        const user = await signup(email, password)
        if (user.emailVerified) {
          setUser(user)
          window.location.href = '/dashboard'
        } else {
          setInfo('Account created. Check your email to confirm before logging in.')
        }
      } else {
        const user = await login(email, password)
        setUser(user)
        window.location.href = '/dashboard'
      }
    } catch (err) {
      if (err instanceof MissingIdentityError) {
        setError(
          'Identity is not enabled in this environment. Run "netlify dev" locally or enable Identity in project settings.'
        )
      } else if (err instanceof AuthError) {
        if (err.status === 401) setError('Invalid email or password.')
        else if (err.status === 403) setError('Signups are not allowed for this site.')
        else if (err.status === 422) setError('Invalid input. Check your email and password.')
        else setError(err.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = (e) => {
    e.preventDefault()
    setMode(mode === 'signup' ? 'login' : 'signup')
    setError('')
    setInfo('')
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Finance Leasing Dashboard</h1>
        <h2>{mode === 'signup' ? 'Create account' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {error && <p className="error">{error}</p>}
          {info && <p className="info">{info}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Working…' : mode === 'signup' ? 'Sign up' : 'Login'}
          </button>
        </form>
        <p className="demo-info">
          {mode === 'signup' ? (
            <>Already have an account? <a href="#" onClick={toggleMode}>Log in</a></>
          ) : (
            <>Need an account? <a href="#" onClick={toggleMode}>Sign up</a></>
          )}
        </p>
      </div>
    </div>
  )
}
