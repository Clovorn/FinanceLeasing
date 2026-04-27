import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import authRoutes from './routes/auth.js'
import leadsRoutes from './routes/leads.js'
import { authMiddleware } from './middleware/auth.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cors())
app.use(fileUpload())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/leads', authMiddleware, leadsRoutes)
app.post('/api/upload', authMiddleware, async (req, res) => {
  // This will be handled in the leads controller
  res.status(501).json({ message: 'Upload endpoint not implemented' })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
