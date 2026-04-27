import express from 'express'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Mock user database (in production, use real database)
const users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: '$2a$10$qYBr0M8w.L9n03fJPCo6duqPKy2gQMzvB4xQjQfCx8x7iNVXQs8.O', // password123 hashed
    role: 'admin'
  },
  {
    id: 2,
    email: 'viewer@example.com',
    password: '$2a$10$qYBr0M8w.L9n03fJPCo6duqPKy2gQMzvB4xQjQfCx8x7iNVXQs8.O', // password123 hashed
    role: 'viewer'
  }
]

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const passwordMatch = await bcryptjs.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message })
  }
})

router.post('/register', async (req, res) => {
  res.status(501).json({ message: 'Registration not implemented' })
})

export default router
