import React, { useRef } from 'react'
import axios from 'axios'
import '../styles/FileUpload.css'

export default function FileUpload({ onUpload }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Get token from localStorage
    const token = localStorage.getItem('token')

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      onUpload(response.data.leads || [])
      alert('File uploaded successfully!')
      fileInputRef.current.value = ''
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="file-upload-container">
      <h2>Upload Customer Leads</h2>
      <div className="upload-area">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <label>
          📁 Click to upload CSV or Excel file
        </label>
        {uploading && <p>Uploading...</p>}
        {error && <p className="error">{error}</p>}
      </div>
      <p className="file-info">Expected columns: name, email, phone, status, amount</p>
    </div>
  )
}
