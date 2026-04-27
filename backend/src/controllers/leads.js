import csv from 'csv-parse/sync'
import xlsx from 'xlsx'

// Mock database (in production, use real database/Firebase)
let leadsDatabase = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-0101',
    status: 'pending',
    amount: 50000,
    date: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-0102',
    status: 'approved',
    amount: 75000,
    date: new Date().toISOString()
  }
]

export async function getLeads(req, res) {
  try {
    res.json({ leads: leadsDatabase })
  } catch (error) {
    res.status(500).json({ message: 'Failed to get leads', error: error.message })
  }
}

export async function addLead(req, res) {
  try {
    const { name, email, phone, status, amount } = req.body

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email required' })
    }

    const newLead = {
      id: leadsDatabase.length + 1,
      name,
      email,
      phone: phone || '',
      status: status || 'pending',
      amount: amount || 0,
      date: new Date().toISOString()
    }

    leadsDatabase.push(newLead)
    res.json({ message: 'Lead added', lead: newLead })
  } catch (error) {
    res.status(500).json({ message: 'Failed to add lead', error: error.message })
  }
}

export async function uploadFile(req, res) {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const file = req.files.file
    const fileName = file.name
    let leads = []

    if (fileName.endsWith('.csv')) {
      const csvData = file.data.toString('utf8')
      leads = csv.parse(csvData, { columns: true })
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const workbook = xlsx.read(file.data, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      leads = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])
    } else {
      return res.status(400).json({ message: 'Only CSV and Excel files are supported' })
    }

    // Format and add leads to database
    const formattedLeads = leads.map((lead, index) => ({
      id: leadsDatabase.length + index + 1,
      name: lead.name || 'Unknown',
      email: lead.email || '',
      phone: lead.phone || '',
      status: lead.status || 'pending',
      amount: parseFloat(lead.amount) || 0,
      date: new Date().toISOString()
    }))

    leadsDatabase = [...leadsDatabase, ...formattedLeads]

    res.json({
      message: 'File uploaded successfully',
      leads: formattedLeads
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload file', error: error.message })
  }
}
