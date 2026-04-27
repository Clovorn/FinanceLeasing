# Deployment Guide

## Overview
This project consists of:
- **Frontend**: React application deployed on Netlify
- **Backend**: Express API server deployed on Render/Railway/Heroku
- **Database**: Connected to Firebase Firestore or your database of choice

## Frontend Deployment (Netlify)

### Prerequisites
- GitHub repository connected (already done ✓)
- Netlify account

### Steps
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository (Clovorn/FinanceLeasing)
4. Configure build settings:
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/dist`
5. Click "Deploy site"

## Backend Deployment (Render)

### Step 1: Prepare Backend

Create a `backend/.env` file with:
```
PORT=5000
JWT_SECRET=your-production-secret-key-here
```

### Step 2: Deploy to Render

1. Create account at [https://render.com](https://render.com)
2. Click "New+" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: finance-leasing-api
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables from your `.env` file
6. Click "Create Web Service"

### Alternative: Railway

1. Go to [https://railway.app](https://railway.app)
2. Create new project from GitHub
3. Select your repository
4. Add plugin/service for Node.js
5. Add environment variables
6. Deploy

## Update Frontend API URL

Once backend is deployed, update the frontend API proxy:

Edit `frontend/vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'https://your-backend-url.com',
    changeOrigin: true,
  }
}
```

Or set it via environment variable in frontend `.env`:
```
VITE_API_URL=https://your-backend-url.com
```

## Database Setup (Firebase)

### Setup Firebase Firestore

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable Firestore Database
4. Create service account credentials
5. Add to backend `.env`:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

### Create Collection: leads

Structure:
```
leads/
  {docId}
    - name: string
    - email: string
    - phone: string
    - status: string (pending, approved, rejected)
    - amount: number
    - date: timestamp
    - createdBy: string (user email)
```

## Monitoring & Logs

### Netlify
- Dashboard → Deploys → Click deployment → view logs
- Settings → Build & deploy → Deploy log

### Render
- Dashboard → Service → Logs tab

### Backend Health Check
```bash
curl https://your-backend-url.com/api/health
```

Should return:
```json
{"status": "OK"}
```

## Troubleshooting

### "Cannot find module" errors
- Run `npm install` in the affected directory
- Check node_modules are not gitignored

### CORS errors
- Backend must have CORS enabled (✓ already configured)
- Frontend API URL must match backend domain

### Database connection fails
- Verify environment variables are set
- Check Firebase credentials are valid
- Ensure Firestore is enabled in Firebase console

### Files not uploading
- Check backend file upload directory has write permissions
- Verify multer configuration (uses express-fileupload)
- Check file size limits

## Production Checklist

- [ ] Change JWT_SECRET to secure random string
- [ ] Enable HTTPS (automatic on Netlify/Render)
- [ ] Set proper CORS origins (not *)
- [ ] Configure database backups
- [ ] Set up monitoring/error tracking
- [ ] Enable rate limiting on API
- [ ] Add environment-specific configs
- [ ] Document API endpoints
- [ ] Test file upload with real data
- [ ] Verify authentication works in production

## Useful Commands

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Check for security vulnerabilities
npm audit

# Update dependencies
npm update
```

## Support

For issues or questions, check:
1. Original GitHub repo: https://github.com/Clovorn/FinanceLeasing
2. README.md for full documentation
3. Backend logs on deployment platform
4. Browser console for frontend errors
