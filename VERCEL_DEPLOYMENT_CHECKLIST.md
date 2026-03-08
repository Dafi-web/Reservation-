# Vercel Deployment Checklist

## ✅ Step 1: Code is Ready
- [x] Code pushed to GitHub: `https://github.com/Dafi-web/Reservation-`
- [x] All changes committed and pushed

## 🚀 Step 2: Deploy on Vercel

### 2.1 Sign Up / Login
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Sign in with your **GitHub account** (recommended)

### 2.2 Import Project
1. Click **"Add New Project"** (or **"New Project"**)
2. Find and select your repository: **`Reservation-`** (or `Dafi-web/Reservation-`)
3. Click **"Import"**

### 2.3 Configure Project
1. **Project Name**: Keep default or change to `africa-restorante-menu`
2. **Framework Preset**: Should auto-detect as "Next.js"
3. **Root Directory**: Leave as `./` (default)
4. **Build Command**: Leave as default (`npm run build`)
5. **Output Directory**: Leave as default (`.next`)

### 2.4 Add Environment Variables ⚠️ IMPORTANT

Click **"Environment Variables"** and add these **3 required variables**:

#### Required Variables:

1. **MONGODB_URI**
   ```
   mongodb+srv://wediabrhana_db_user:yesno1212@cluster0.xgobxlz.mongodb.net/?appName=Cluster0
   ```
   - Environment: Select **Production**, **Preview**, and **Development**

2. **ADMIN_PASSWORD**
   ```
   admin123
   ```
   - ⚠️ **Change this to a secure password!**
   - Environment: Select **Production**, **Preview**, and **Development**

3. **TWILIO_ACCOUNT_SID** (Optional - for SMS)
   ```
   (Leave empty if not using SMS)
   ```
   - Environment: Select **Production**, **Preview**, and **Development**

4. **TWILIO_AUTH_TOKEN** (Optional - for SMS)
   ```
   (Leave empty if not using SMS)
   ```
   - Environment: Select **Production**, **Preview**, and **Development**

5. **TWILIO_PHONE_NUMBER** (Optional - for SMS & admin alerts)
   ```
   (Your Twilio phone number, e.g. +1234567890)
   ```
   - Format: `+1234567890` (with country code). This is the number that **sends** SMS/WhatsApp, not the admin’s number.
   - Environment: Select **Production**, **Preview**, and **Development**

6. **ADMIN_PHONE** (Optional - who receives new-reservation alerts)
   ```
   +31686371240
   ```
   - Admin receives SMS and WhatsApp at this number. Default is +31686371240 if not set.
   - Environment: **Production** (and Preview/Development if you want)

7. **TWILIO_WHATSAPP_NUMBER** (Optional - for admin WhatsApp alerts)
   ```
   +14155238886
   ```
   - Use Twilio’s WhatsApp sandbox number (or your WhatsApp-enabled Twilio number). Get it from [Twilio WhatsApp Sandbox](https://www.twilio.com/docs/whatsapp/sandbox).
   - Environment: **Production** (and others if needed)

8. **RESEND_API_KEY** (Optional - for admin email alerts)
   ```
   re_xxxxxxxxxxxx
   ```
   - Get an API key at [resend.com](https://resend.com). Admin receives new-reservation emails at ristoranteafrica88@gmail.com. To change it, set **ADMIN_EMAIL** in Vercel and redeploy.  
**Guests only receive emails (confirmations, rejections) if you set GMAIL_USER and GMAIL_APP_PASSWORD** in Vercel – see [EMAIL_SETUP_SIMPLE.md](./EMAIL_SETUP_SIMPLE.md). Without Gmail, only the admin gets emails..
   - Environment: **Production** (and others if needed)

**After adding or changing any variable:** go to **Deployments** → open the **⋯** menu on the latest deployment → **Redeploy**. Env vars are applied on the next deploy.

### 2.5 Deploy
1. Click **"Deploy"** button
2. Wait 2-5 minutes for deployment to complete
3. You'll see build logs in real-time

## ✅ Step 3: Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Log in to your account
3. Navigate to **Network Access** (left sidebar)
4. Click **"Add IP Address"**
5. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - Or click **"Add Current IP Address"** if you prefer
6. Click **"Confirm"**

**Why?** Vercel's servers need access to your MongoDB database.

## 🌱 Step 4: Seed the Database

After deployment completes, seed your database with menu items:

### Option A: Using Browser
1. Visit: `https://your-app-name.vercel.app/api/seed`
2. You should see: `{"message":"Menu items seeded successfully"}`

### Option B: Using curl
```bash
curl -X POST https://your-app-name.vercel.app/api/seed
```

**Note**: Only run this once! Running it multiple times will create duplicate menu items.

## 🎉 Step 5: Access Your Live App

Your app will be available at:
- **Homepage**: `https://your-app-name.vercel.app`
- **Reservations**: `https://your-app-name.vercel.app/en/reservations`
- **Admin Panel**: `https://your-app-name.vercel.app/en/admin`
  - Password: The `ADMIN_PASSWORD` you set in Step 2.4

## 🌐 Step 6: Add a Subdomain (e.g. menu.yourdomain.com)

Use **your own domain** so this app is available at e.g. `menu.yourdomain.com` or `book.yourdomain.com`.

### 6.1 Add the subdomain in Vercel
1. Open your project on [vercel.com](https://vercel.com) → **Settings** → **Domains**
2. Click **"Add"** (or **"Add Domain"**)
3. Enter your subdomain, e.g. **`menu.yourdomain.com`** (replace `yourdomain.com` with your real domain)
4. Click **"Add"**
5. Vercel will show the DNS record you need (usually a **CNAME**)

### 6.2 Configure DNS at your domain provider
1. Log in where your domain is managed (GoDaddy, Namecheap, Cloudflare, Google Domains, etc.)
2. Open **DNS** / **Manage DNS** for your domain (`yourdomain.com`)
3. **Add a CNAME record:**
   - **Name / Host:** `menu` (for `menu.yourdomain.com`) or `book`, `reserve`, etc.
   - **Value / Points to:** `cname.vercel-dns.com` (or the exact value Vercel shows)
   - **TTL:** 3600 or default
4. Save the record.

### 6.3 Wait and verify
- Wait **5–30 minutes** (sometimes up to 48 hours) for DNS to update.
- In Vercel → **Settings** → **Domains**, the subdomain should show **"Valid Configuration"**.
- Vercel will issue an SSL certificate automatically (HTTPS).

### 6.4 Test
- Open **`https://menu.yourdomain.com`** (or whatever subdomain you chose).
- Your app should load. Share this link with customers.

**Detailed steps per provider (GoDaddy, Namecheap, Cloudflare):** see **`SUBDOMAIN_SETUP.md`**.

## 🔍 Troubleshooting

### Build Fails
- **Error**: "Cannot connect to MongoDB"
  - **Solution**: This is normal during build. The app uses dynamic rendering, so MongoDB is only accessed at runtime.

### App Shows Blank Page
- **Solution**: 
  1. Check browser console (F12)
  2. Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
  3. Clear browser cache

### Database Connection Error
- **Solution**: 
  1. Verify `MONGODB_URI` is correct in Vercel environment variables
  2. Check MongoDB Atlas Network Access allows `0.0.0.0/0`
  3. Verify MongoDB username/password are correct

### Admin Panel Not Accessible
- **Solution**: 
  1. Verify `ADMIN_PASSWORD` is set in Vercel
  2. Try logging in with the password you set
  3. Clear browser sessionStorage and try again

### SMS Not Working
- **Solution**: 
  1. Verify Twilio credentials are set in Vercel
  2. Check phone number format: `+1234567890` (with country code)
  3. See `TWILIO_SETUP.md` for setup instructions

### Not Getting Admin Notifications (SMS / Email / WhatsApp)
- **Solution**:
  1. In Vercel: **Project** → **Settings** → **Environment Variables**. Add (for **Production**):
     - **SMS**: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, and optionally `ADMIN_PHONE` (e.g. +31686371240).
     - **Email**: `RESEND_API_KEY` (from [resend.com](https://resend.com)).
     - **WhatsApp**: same Twilio SID/Token, plus `TWILIO_WHATSAPP_NUMBER` (e.g. +14155238886). Admin number = `ADMIN_PHONE`; on a Twilio trial, that number must join the WhatsApp sandbox first.
  2. **Redeploy**: **Deployments** → **⋯** on latest → **Redeploy**. Env vars only apply after a new deploy.
  3. Check **Vercel** → **Logs** (or **Functions** tab) after a test reservation; you’ll see either “Admin SMS sent” or a warning listing which variable is missing.

## 📝 Quick Reference

### Environment Variables Summary
```
MONGODB_URI=          (required)
ADMIN_PASSWORD=       (required; change from default!)
TWILIO_ACCOUNT_SID=   (optional – SMS + WhatsApp)
TWILIO_AUTH_TOKEN=    (optional)
TWILIO_PHONE_NUMBER=  (optional – Twilio “from” number for SMS)
ADMIN_PHONE=          (optional – admin receives alerts, default +31686371240)
TWILIO_WHATSAPP_NUMBER= (optional – e.g. +14155238886 for WhatsApp)
RESEND_API_KEY=       (optional – admin email alerts)
```
**Redeploy after changing env vars.**

### Important URLs
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com
- **GitHub Repo**: https://github.com/Dafi-web/Reservation-

## ✅ Deployment Complete!

Once deployed, your Ristorante Africa menu will be live and accessible worldwide!

**Next Steps:**
1. Test all features (menu, reservations, admin)
2. Add a subdomain with your domain (see Step 6 and `SUBDOMAIN_SETUP.md`)
3. Share the link with customers (e.g. `https://menu.yourdomain.com`)
