# Deployment Guide

This guide covers deploying the EverGlow E-Commerce platform using **Vercel** (frontend) and **Render/Railway** (backend).

---

## Prerequisites

- [GitHub account](https://github.com) with the project pushed
- [Vercel account](https://vercel.com)
- [Render account](https://render.com) or [Railway account](https://railway.app)
- [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas) (free tier)

---

## Part 1: MongoDB Setup (Database)

### Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up
2. Create a free cluster (M0)
3. Create a database user:
   - Username: `admin`
   - Password: `your_db_password` (remember this!)
4. Network Access: Add IP `0.0.0.0/0` (allows all IPs)
5. Get connection string:
   ```
   mongodb+srv://admin:your_db_password@cluster0.xyzabc.mongodb.net/ecommerce
   ```

---

## Part 2: Backend Deployment (Render)

### Option A: Deploy on Render

1. **Create Render Account**
   - Go to [render.com](https://render.com) and sign up with GitHub

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `everglow-backend`
     - Root Directory: `backend`
     - Build Command: `npm install`
     - Start Command: `node server.js`

3. **Environment Variables**
   Add these in Render dashboard:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://admin:your_db_password@cluster0.xyzabc.mongodb.net/ecommerce
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://your-frontend.vercel.app
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM="EverGlow Beauty" <noreply@everglow.com>
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Get your backend URL: `https://everglow-backend.onrender.com`

### Option B: Deploy on Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app) and sign up

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select the repository
   - Set root directory to `backend`

3. **Environment Variables**
   Add same variables as Render above

4. **Deploy**
   - Click "Deploy"
   - Get your backend URL from the deployed service

---

## Part 3: Frontend Deployment (Vercel)

### Deploy Next.js Frontend

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure**
   - Framework Preset: `Next.js`
   - Root Directory: `frontend` (or keep empty if frontend is root)
   - Build Command: `next build` (or leave empty)
   - Output Directory: `.next` (or leave empty)

4. **Environment Variables**
   Add these:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

   > Note: Replace `https://your-backend-url.onrender.com` with your actual backend URL from Part 2

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (~2-3 minutes)

6. **Get Your Live URL**
   - Example: `https://everglow-ecommerce.vercel.app`

---

## Part 4: Update Configuration

### Update Backend Environment Variables

In your Render/Railway dashboard, make sure:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

### Update Frontend Environment Variables

If you deployed frontend first, update your backend to allow the frontend URL.

In Render/Railway backend settings, verify:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## Part 5: Verify Deployment

### Test Your Live Site

1. **Frontend**: Visit `https://your-frontend.vercel.app`
2. **Backend API**: Visit `https://your-backend.onrender.com/api/products`
   - Should return JSON data
3. **Register**: Try creating a new account
4. **Login**: Try logging in

### Common Issues

| Issue | Solution |
|-------|----------|
| API not loading | Check if backend is deployed and URL is correct |
| CORS errors | Ensure `FRONTEND_URL` is set in backend env vars |
| Database connection | Check MongoDB Atlas network access (IP whitelist) |
| Images not loading | Check image URLs in database point to valid URLs |

---

## Updating Your Live Site

Whenever you push changes to GitHub:

1. **Frontend**: Vercel auto-deploys on push to main
2. **Backend**: Render/Railway auto-deploys on push to main

To trigger manual deploys:
- Vercel: Go to Deployments → Click "Redeploy"
- Render: Go to Dashboard → Click "Create Deploy" → "Deploy last commit"

---

## Domain Configuration (Optional)

### Add Custom Domain to Vercel

1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `everglow.com`)
3. Update DNS records as instructed by Vercel

### Add Custom Domain to Render

1. Go to Render Dashboard → Your Backend Service → Settings → Custom Domains
2. Add your domain
3. Update DNS records

---

## Security Notes

1. **Never commit `.env` files to GitHub**
2. **Use strong JWT_SECRET** (random 32+ character string)
3. **Use App Passwords for Gmail** (not regular passwords)
4. **Restrict MongoDB IP** when going to production (or use VPC)

---

## Cost Estimate

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| MongoDB Atlas | ✅ Up to 512MB | ~$0.08/GB |
| Vercel | ✅ 100GB bandwidth | $20/100GB |
| Render | ✅ 750 hours/month | $7/month |
| Railway | ✅ $5 credit/month | $5/plan |

For a small e-commerce site, you can run completely **free** on the tiers above!

---

## Need Help?

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
