import express from 'express'
import { adminOnly } from '../middleware/auth.js'
import { uploadFile, getLeads, addLead } from '../controllers/leads.js'

const router = express.Router()

// Get all leads (all authenticated users)
router.get('/', getLeads)

// Add a single lead (admin only)
router.post('/', adminOnly, addLead)

// Upload file (admin only)
router.post('/upload', adminOnly, uploadFile)

export default router
