# FinanceLeasing
Finance and Leasing Workflow Dashboard with Role-Based Access Control

A full-stack application for managing finance leasing leads with Admin and Viewer access levels.

## Features

### Admin
- ✅ Upload customer leads via CSV/Excel files
- ✅ Add new leads manually
- ✅ Manage and edit lead information
- ✅ View all leads and analytics

### Viewer
- 👁️ View all customer leads
- 🔍 Sort and filter leads
- 🖨️ Print reports
- 📤 Share lead data

## Tech Stack

- **Frontend**: React + Vite, React Router, Axios
- **Backend**: Node.js + Express
- **Database**: Firebase Firestore (configurable)
- **Authentication**: JWT-based with role-based access control
- **File Upload**: CSV and Excel support

## Live Dashboard
**[View the Application](https://ronnocofinance.netlify.app)**

## Local Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Install Dependencies

```bash
# Install all dependencies
npm install

# Or install frontend and backend separately
cd frontend && npm install
cd ../backend && npm install
```

### Setup Environment Variables

Create a `.env` file in the backend directory:

```bash
cp backend/.env.example backend/.env
```

Edit `.env` with your configuration:
```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

### Run Development Server

From the root directory:

```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Or Run Separately

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend  
cd backend
npm run dev
```

## Login Credentials

Use these demo accounts to test the application:

**Admin Account:**
- Email: `admin@example.com`
- Password: `password123`

**Viewer Account:**
- Email: `viewer@example.com`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (not implemented)

### Leads (Authenticated)
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Add a new lead (admin only)
- `POST /api/upload` - Upload CSV/Excel file (admin only)

## File Upload Format

When uploading customer leads via CSV/Excel, use the following columns:
- `name` - Customer name
- `email` - Email address
- `phone` - Phone number
- `status` - Leasing status (pending, approved, rejected)
- `amount` - Leasing amount

Example CSV:
```
name,email,phone,status,amount
John Doe,john@example.com,555-0101,pending,50000
Jane Smith,jane@example.com,555-0102,approved,75000
```

## Deployment

### Frontend (Netlify)
Connected to Netlify. Push to main branch to auto-deploy.

### Backend
Deploy to platforms like:
- Render
- Railway  
- Heroku
- DigitalOcean

## Project Structure

```
FinanceLeasing/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # CSS files
│   │   └── App.jsx
│   └── package.json
├── backend/               # Express server
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Auth middleware
│   │   └── server.js
│   └── package.json
├── netlify.toml          # Netlify configuration
└── package.json          # Root scripts
```

## Future Enhancements

- [ ] Firebase Firestore integration for persistent storage
- [ ] User registration and management
- [ ] Advanced analytics and reporting
- [ ] Email notifications
- [ ] Bulk lease processing
- [ ] Document management system
- [ ] Two-factor authentication

## License

Private - All rights reserved
