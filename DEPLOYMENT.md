# Vercel Deployment Guide

## 🚀 Deploy to Vercel

### Option 1: Automatic Deployment (Recommended)

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

3. **Set Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=santos-bhai
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=santos-bhai.appspot.com
   ```

4. **Deploy:** Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: santosa-bhai-proj
# - Directory: ./
# - Override settings? No
```

### Backend Deployment Options

Since Vercel is for frontend, deploy your backend separately:

#### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Select backend folder
4. Add environment variables from your .env
5. Deploy

#### Option B: Heroku
1. Install Heroku CLI
2. Create Heroku app
3. Add environment variables
4. Deploy with Git subtree

#### Option C: DigitalOcean App Platform
1. Go to DigitalOcean
2. Create new app
3. Connect GitHub
4. Select backend folder
5. Configure environment variables

### Post-Deployment Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on chosen platform
- [ ] Environment variables configured
- [ ] API URL updated in frontend
- [ ] Test student lookup functionality
- [ ] Test email delivery
- [ ] Update CORS settings if needed

### Common Issues

1. **Build Errors:** Check Node.js version compatibility
2. **API Errors:** Verify backend URL and CORS settings
3. **Environment Variables:** Ensure all required vars are set
