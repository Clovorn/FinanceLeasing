import { getUser } from '@netlify/identity'
import { getStore } from '@netlify/blobs'

const STORE = 'finance-leads'
const KEY = 'all'

const seedLeads = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-0101',
    status: 'pending',
    amount: 50000,
    date: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-0102',
    status: 'approved',
    amount: 75000,
    date: new Date().toISOString(),
  },
]

async function loadLeads(store) {
  const existing = await store.get(KEY, { type: 'json' })
  if (existing) return existing
  await store.setJSON(KEY, seedLeads)
  return seedLeads
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export default async (req) => {
  const user = await getUser()
  if (!user) return jsonResponse({ message: 'Unauthorized' }, 401)

  const isAdmin = user.app_metadata?.roles?.includes('admin')
  const store = getStore(STORE)

  if (req.method === 'GET') {
    const leads = await loadLeads(store)
    return jsonResponse({ leads })
  }

  if (req.method === 'POST') {
    if (!isAdmin) return jsonResponse({ message: 'Admin access required' }, 403)
    const { name, email, phone, status, amount } = await req.json()
    if (!name || !email) return jsonResponse({ message: 'Name and email required' }, 400)

    const leads = await loadLeads(store)
    const newLead = {
      id: leads.length ? Math.max(...leads.map((l) => l.id || 0)) + 1 : 1,
      name,
      email,
      phone: phone || '',
      status: status || 'pending',
      amount: Number(amount) || 0,
      date: new Date().toISOString(),
    }
    leads.push(newLead)
    await store.setJSON(KEY, leads)
    return jsonResponse({ message: 'Lead added', lead: newLead })
  }

  return jsonResponse({ message: 'Method Not Allowed' }, 405)
}
