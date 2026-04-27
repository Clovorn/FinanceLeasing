# Quick Start Guide

Get the Finance Leasing Dashboard running locally in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- npm or yarn
- Git (already done)

## Installation

### 1. Clone or navigate to repository
```bash
cd /workspaces/FinanceLeasing
```

### 2. Install dependencies
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend && npm install

# Backend dependencies
cd ../backend && npm install
```

### 3. Run the application

From the root directory:
```bash
npm run dev
```

This will start both servers:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

Or run separately:
```bash
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Backend
cd backend && npm run dev
```

## Login & Test

1. Open browser: http://localhost:3000
2. Use demo credentials:
   - Email: `admin@example.com`
   - Password: `password123`

### Admin Features to Test
- ✅ Upload a CSV file with customer leads
- ✅ Add new leads manually
- ✅ View all leads in the table

### Viewer Features to Test
- 👁️ View all leads (read-only)
- 🔍 Sort by Name, Email, or Status
- 📄 Print reports
- 📤 Share lead data
- 🔎 Search for specific leads

## Sample CSV File

Create a file `leads.csv` to test uploads:

```csv
name,email,phone,status,amount
John Doe,john@example.com,555-0101,pending,50000
Jane Smith,jane@example.com,555-0102,approved,75000
Bob Wilson,bob@example.com,555-0103,rejected,30000
```

Then upload it from the admin dashboard.

## Project Structure

```
FinanceLeasing/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # LeadsTable, FileUpload
│   │   ├── pages/        # Login, Dashboard
│   │   └── styles/       # CSS files
│   └── package.json
├── backend/              # Express API
│   ├── src/
│   │   ├── routes/       # auth, leads
│   │   ├── controllers/  # Business logic
│   │   └── middleware/   # Authentication
│   └── package.json
└── package.json         # Root scripts
```

## Available Scripts

### Frontend
```bash
cd frontend

npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Build for production (creates dist/)
npm run preview  # Preview production build
```

### Backend
```bash
cd backend

npm run dev      # Start dev server with auto-reload
npm start        # Start production server
```

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module not found errors
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API requests failing
- Check backend is running on http://localhost:5000
- Check browser console for errors (F12)
- Verify JWT token is being sent in Authorization header

### Database not receiving data
- Currently using in-memory storage (data resets on restart)
- To persist data, connect to Firebase (see DEPLOYMENT.md)

## Next Steps

1. ✅ **Test locally** - Verify all features work
2. 📝 **Customize** - Add your branding, modify colors, add fields
3. 🚀 **Deploy** - Follow [DEPLOYMENT.md](DEPLOYMENT.md)
4. 📊 **Add Features** - See README.md for future enhancements

## API Endpoints (for reference)

```bash
# Login
POST http://localhost:5000/api/auth/login
Body: { "email": "admin@example.com", "password": "password123" }

# Get all leads
GET http://localhost:5000/api/leads
Header: Authorization: Bearer <token>

# Add a lead (admin only)
POST http://localhost:5000/api/leads
Header: Authorization: Bearer <token>
Body: { "name": "John", "email": "john@example.com", "phone": "555-1234", "amount": 50000 }

# Upload file (admin only)
POST http://localhost:5000/api/upload
Header: Authorization: Bearer <token>
Body: FormData with file
```

## Getting Help

1. Check README.md for full documentation
2. Check DEPLOYMENT.md for production setup
3. Review source code comments
4. Test with sample data first
