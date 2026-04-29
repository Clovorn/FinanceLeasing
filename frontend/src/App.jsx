import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { getUser, handleAuthCallback, onAuthChange, AUTH_EVENTS } from '@netlify/identity'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe = () => {}

    ;(async () => {
      try {
        await handleAuthCallback()
      } catch {
        // No callback hash present, or callback failed — fall through to getUser
      }
      const current = await getUser()
      setUser(current)
      setLoading(false)

      unsubscribe = onAuthChange((event, u) => {
        if (
          event === AUTH_EVENTS.LOGIN ||
          event === AUTH_EVENTS.USER_UPDATED ||
          event === AUTH_EVENTS.TOKEN_REFRESH
        ) {
          setUser(u)
        } else if (event === AUTH_EVENTS.LOGOUT) {
          setUser(null)
        }
      })
    })()

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}
