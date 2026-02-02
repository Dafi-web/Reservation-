# Quick Deployment Guide

## 🚀 Deploy to Vercel in 5 Minutes

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Add **Environment Variables**:
   - `MONGODB_URI` = `mongodb+srv://wediabrhana_db_user:yesno1212@cluster0.xgobxlz.mongodb.net/?appName=Cluster0`
   - `ADMIN_PASSWORD` = `your_secure_password` (change from default!)
5. Click **"Deploy"**

### Step 3: Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (or add `0.0.0.0/0`)
5. Click **"Confirm"**

### Step 4: Seed Your Database

After deployment, visit:
```
https://your-app.vercel.app/api/seed
```

Or use curl:
```bash
curl -X POST https://your-app.vercel.app/api/seed
```

### Step 5: Access Your App

- **Homepage**: `https://your-app.vercel.app`
- **Admin Panel**: `https://your-app.vercel.app/en/admin`
- **Password**: The `ADMIN_PASSWORD` you set in Step 2

## ✅ That's it! Your app is live!

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
