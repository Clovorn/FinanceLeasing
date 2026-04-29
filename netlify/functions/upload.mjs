import { getUser } from '@netlify/identity'
import { getStore } from '@netlify/blobs'
import { parse as parseCsv } from 'csv-parse/sync'
import * as XLSX from 'xlsx'

const STORE = 'finance-leads'
const KEY = 'all'

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export default async (req) => {
  if (req.method !== 'POST') return jsonResponse({ message: 'Method Not Allowed' }, 405)

  const user = await getUser()
  if (!user) return jsonResponse({ message: 'Unauthorized' }, 401)
  if (!user.app_metadata?.roles?.includes('admin')) {
    return jsonResponse({ message: 'Admin access required' }, 403)
  }

  let form
  try {
    form = await req.formData()
  } catch {
    return jsonResponse({ message: 'Invalid form data' }, 400)
  }

  const file = form.get('file')
  if (!file || typeof file === 'string') {
    return jsonResponse({ message: 'No file uploaded' }, 400)
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = (file.name || '').toLowerCase()
  let parsed = []

  try {
    if (fileName.endsWith('.csv')) {
      parsed = parseCsv(buffer.toString('utf8'), { columns: true, skip_empty_lines: true })
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      parsed = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
    } else {
      return jsonResponse({ message: 'Only CSV and Excel files are supported' }, 400)
    }
  } catch (err) {
    return jsonResponse({ message: 'Failed to parse file', error: err.message }, 400)
  }

  const store = getStore(STORE)
  const existing = (await store.get(KEY, { type: 'json' })) || []
  const startId = existing.length ? Math.max(...existing.map((l) => l.id || 0)) + 1 : 1

  const newLeads = parsed.map((row, i) => ({
    id: startId + i,
    name: row.name || 'Unknown',
    email: row.email || '',
    phone: row.phone || '',
    status: row.status || 'pending',
    amount: parseFloat(row.amount) || 0,
    date: new Date().toISOString(),
  }))

  await store.setJSON(KEY, [...existing, ...newLeads])

  return jsonResponse({ message: 'File uploaded successfully', leads: newLeads })
}
