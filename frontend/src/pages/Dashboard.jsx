import React, { useState, useEffect } from 'react'
import axios from 'axios'
import LeadsTable from '../components/LeadsTable'
import FileUpload from '../components/FileUpload'
import '../styles/Dashboard.css'

export default function Dashboard({ user, setUser }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLeads(response.data.leads || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    window.location.href = '/login'
  }

  const handleFileUpload = (newLeads) => {
    setLeads([...leads, ...newLeads])
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Finance Leasing Dashboard</h1>
        <div className="user-info">
          <span>{user.email} ({user.role})</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        {user.role === 'admin' && (
          <FileUpload onUpload={handleFileUpload} />
        )}

        {loading ? (
          <p>Loading leads...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <LeadsTable leads={leads} userRole={user.role} />
        )}
      </div>
    </div>
  )
}
