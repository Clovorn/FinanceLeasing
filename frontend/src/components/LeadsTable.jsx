import React, { useState } from 'react'
import '../styles/LeadsTable.css'

export default function LeadsTable({ leads, userRole }) {
  const [sortBy, setSortBy] = useState('name')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLeads = leads.filter(lead =>
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.includes(searchTerm)
  )

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === 'name') return a.name?.localeCompare(b.name)
    if (sortBy === 'email') return a.email?.localeCompare(b.email)
    if (sortBy === 'status') return a.status?.localeCompare(b.status)
    return 0
  })

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const text = `Finance Leasing Leads Report:\n${
      sortedLeads.map(l => `${l.name} - ${l.email} - ${l.status}`).join('\n')
    }`
    
    if (navigator.share) {
      navigator.share({ title: 'Leads Report', text })
    } else {
      alert('Share feature not supported')
    }
  }

  return (
    <div className="leads-table-container">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="status">Sort by Status</option>
        </select>

        <button onClick={handlePrint} className="btn-print">🖨️ Print</button>
        <button onClick={handleShare} className="btn-share">📤 Share</button>
      </div>

      {sortedLeads.length === 0 ? (
        <p className="no-data">No leads found</p>
      ) : (
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedLeads.map((lead, index) => (
              <tr key={index}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
                <td><span className={`status ${lead.status}`}>{lead.status}</span></td>
                <td>${lead.amount?.toLocaleString()}</td>
                <td>{new Date(lead.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
