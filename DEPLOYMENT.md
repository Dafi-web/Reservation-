# Deployment Guide

This guide will help you deploy your Restaurant Menu application online. We'll use **Vercel** (recommended for Next.js) as it's the easiest and most reliable option.

## Prerequisites

- A GitHub account (or GitLab/Bitbucket)
- A MongoDB Atlas account (or your MongoDB connection string)
- A Vercel account (free tier is sufficient)

## Step 1: Prepare Your Code

1. **Make sure your code is ready:**
   ```bash
   npm run build
   ```
   Note: You may see MongoDB connection errors during build - this is normal if MongoDB isn't accessible from your local machine. The app will work fine in production.

2. **Commit your code to Git:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   ```

## Step 2: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to [github.com](https://github.com) and create a new repository
   - Don't initialize it with a README (you already have one)

2. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Sign up/Login to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account (free)

2. **Import your project:**
   - Click "Add New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables:**
   - In the project settings, go to "Environment Variables"
   - Add the following variables:
     ```
     MONGODB_URI=mongodb+srv://your_connection_string
     ADMIN_PASSWORD=your_secure_password
     
     # Optional: SMS Notifications (Twilio)
     TWILIO_ACCOUNT_SID=your_twilio_account_sid
     TWILIO_AUTH_TOKEN=your_twilio_auth_token
     TWILIO_PHONE_NUMBER=+1234567890
     ```
   - **Important:** 
     - Use your actual MongoDB connection string
     - Set a strong admin password (not the default `admin123`)
     - Make sure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs) for Vercel
     - **SMS (Optional)**: Add Twilio credentials if you want SMS confirmations. Get them from [Twilio Console](https://console.twilio.com/)

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)

5. **Seed the database:**
   - Once deployed, visit: `https://your-app.vercel.app/api/seed`
   - Or use curl: `curl -X POST https://your-app.vercel.app/api/seed`
   - This populates your database with initial menu items

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts and add your environment variables when asked.

4. **Set environment variables:**
   ```bash
   vercel env add MONGODB_URI
   vercel env add ADMIN_PASSWORD
   ```

5. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

## Step 4: Configure MongoDB Atlas

1. **Whitelist Vercel IPs:**
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Add `0.0.0.0/0` (allows all IPs) OR add Vercel's IP ranges
   - Click "Confirm"

2. **Verify Database Connection:**
   - Your connection string should look like:
     ```
     mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
     ```

## Step 5: Access Your Deployed App

1. **Your app will be available at:**
   - `https://your-app-name.vercel.app`
   - Vercel provides a free SSL certificate automatically

2. **Test the application:**
   - Visit the homepage to see the menu
   - Make a test reservation
   - Access admin panel at `/admin` (e.g., `https://your-app.vercel.app/en/admin`)
   - Login with your `ADMIN_PASSWORD`

## Step 6: Custom Domain (Optional)

1. **Add a custom domain in Vercel:**
   - Go to Project Settings → Domains
   - Add your domain
   - Follow Vercel's DNS configuration instructions

## Troubleshooting

### Build Errors

- **MongoDB connection errors during build:** This is normal. The app uses dynamic rendering, so it will connect at runtime.

### Runtime Errors

- **"Cannot connect to MongoDB":**
  - Check your `MONGODB_URI` environment variable in Vercel
  - Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
  - Check your MongoDB username/password are correct

- **"Admin password not working":**
  - Verify `ADMIN_PASSWORD` is set correctly in Vercel environment variables
  - Redeploy after adding environment variables

- **"Menu items not showing":**
  - Make sure you've seeded the database by calling `/api/seed`
  - Check MongoDB connection is working

### Environment Variables Not Working

- After adding environment variables in Vercel, you must **redeploy** for them to take effect
- Go to Deployments → Click the three dots → Redeploy

## Alternative Deployment Options

### Netlify

1. Connect your GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Note: Netlify may require additional configuration for Next.js API routes

### Railway

1. Connect your GitHub repo to Railway
2. Railway auto-detects Next.js
3. Add environment variables
4. Deploy automatically

### Self-Hosted (VPS)

1. Set up a VPS (DigitalOcean, AWS EC2, etc.)
2. Install Node.js and npm
3. Clone your repository
4. Install dependencies: `npm install`
5. Set environment variables
6. Build: `npm run build`
7. Start: `npm start`
8. Use PM2 or similar for process management

## Security Recommendations

1. **Change default admin password:**
   - Never use `admin123` in production
   - Use a strong, unique password

2. **MongoDB Security:**
   - Use a dedicated database user (not your admin user)
   - Restrict IP access if possible (though `0.0.0.0/0` is needed for Vercel)
   - Enable MongoDB Atlas authentication

3. **Environment Variables:**
   - Never commit `.env.local` to Git
   - Always use environment variables in your hosting platform

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas connection logs
3. Verify all environment variables are set correctly
4. Ensure database is seeded with menu items

## Next Steps

After deployment:
- Share your app URL with customers
- Monitor reservations in the admin panel
- Consider adding analytics (Google Analytics, Vercel Analytics)
- Set up email notifications for new reservations (future enhancement)
