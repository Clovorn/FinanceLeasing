import React, { useState, useEffect } from 'react'
import { logout } from '@netlify/identity'
import LeadsTable from '../components/LeadsTable'
import FileUpload from '../components/FileUpload'
import '../styles/Dashboard.css'

function getRole(user) {
  return user?.app_metadata?.roles?.includes('admin') ? 'admin' : 'viewer'
}

export default function Dashboard({ user, setUser }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const role = getRole(user)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads', { credentials: 'include' })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.message || 'Failed to load leads')
      }
      const data = await response.json()
      setLeads(data.leads || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      setUser(null)
      window.location.href = '/login'
    }
  }

  const handleFileUpload = (newLeads) => {
    setLeads([...leads, ...newLeads])
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Finance Leasing Dashboard</h1>
        <div className="user-info">
          <span>{user.email} ({role})</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        {role === 'admin' && (
          <FileUpload onUpload={handleFileUpload} />
        )}

        {loading ? (
          <p>Loading leads...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <LeadsTable leads={leads} userRole={role} />
        )}
      </div>
    </div>
  )
}
