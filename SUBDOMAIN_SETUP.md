# Subdomain Setup Guide - menu.dafitech.org

This guide will help you set up a subdomain for your Ristorante Africa menu application.

## Option 1: Using Vercel (Recommended)

### Step 1: Deploy to Vercel (if not already done)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository: `https://github.com/Dafi-web/Reservation-`
3. Deploy the project

### Step 2: Add Custom Domain in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your subdomain: `menu.dafitech.org`
5. Click **Add**

### Step 3: Configure DNS Records

Vercel will show you DNS records to add. You need to add a **CNAME record**:

**DNS Configuration:**
- **Type**: CNAME
- **Name**: `menu` (or `menu.dafitech.org` depending on your DNS provider)
- **Value**: `cname.vercel-dns.com` (or the value Vercel provides)
- **TTL**: 3600 (or default)

### Step 4: Where to Add DNS Records

**Common DNS Providers:**

1. **GoDaddy:**
   - Log in to GoDaddy
   - Go to **My Products** → **DNS**
   - Find your `dafitech.org` domain
   - Click **Manage DNS**
   - Add new CNAME record with values above

2. **Namecheap:**
   - Log in to Namecheap
   - Go to **Domain List** → Select `dafitech.org`
   - Click **Manage** → **Advanced DNS**
   - Add new CNAME record

3. **Cloudflare:**
   - Log in to Cloudflare
   - Select `dafitech.org` domain
   - Go to **DNS** → **Records**
   - Add CNAME record

4. **Other Providers:**
   - Look for "DNS Management" or "DNS Settings"
   - Add CNAME record with values from Vercel

### Step 5: Wait for DNS Propagation

- DNS changes can take 5 minutes to 48 hours
- Usually takes 5-30 minutes
- Vercel will show "Valid Configuration" when ready

### Step 6: SSL Certificate

- Vercel automatically provides SSL (HTTPS) for your domain
- No additional setup needed
- Your site will be available at `https://menu.dafitech.org`

## Option 2: Using Other Hosting Providers

If you're not using Vercel, the process is similar:

### For Netlify:
1. Add domain in Netlify dashboard
2. Add CNAME record pointing to your Netlify domain

### For Railway/Render:
1. Add custom domain in their dashboard
2. Follow their DNS instructions

## DNS Record Examples

### CNAME Record (Most Common)
```
Type: CNAME
Name: menu
Value: cname.vercel-dns.com
TTL: 3600
```

### A Record (Alternative - if CNAME not supported)
```
Type: A
Name: menu
Value: 76.76.21.21 (Vercel's IP - check Vercel for current IPs)
TTL: 3600
```

## Verify DNS Configuration

**Check if DNS is configured correctly:**

1. **Using Command Line:**
   ```bash
   nslookup menu.dafitech.org
   # or
   dig menu.dafitech.org
   ```

2. **Online Tools:**
   - https://dnschecker.org
   - https://www.whatsmydns.net
   - Enter `menu.dafitech.org` and check if it resolves

3. **In Vercel:**
   - Go to Settings → Domains
   - Status should show "Valid Configuration" when ready

## Common Issues

### Issue 1: "Invalid Configuration"
- **Solution**: Double-check DNS records match Vercel's requirements
- Ensure CNAME value is exactly as shown in Vercel

### Issue 2: "DNS Not Propagated"
- **Solution**: Wait 5-30 minutes, then check again
- DNS changes can take up to 48 hours (rare)

### Issue 3: "Domain Already in Use"
- **Solution**: Remove domain from other projects first
- Check if subdomain is used elsewhere

### Issue 4: "SSL Certificate Pending"
- **Solution**: Wait 5-10 minutes after DNS is configured
- Vercel automatically provisions SSL certificates

## Recommended Subdomain Names

Choose one that fits your needs:
- `menu.dafitech.org` - Simple and clear
- `restaurant.dafitech.org` - More descriptive
- `africa.dafitech.org` - Brand-focused
- `book.dafitech.org` - Reservation-focused
- `reserve.dafitech.org` - Action-oriented

## After Setup

Once your subdomain is working:

1. **Update your app** (if needed):
   - The app will automatically work on the new domain
   - No code changes needed

2. **Test the subdomain:**
   - Visit `https://menu.dafitech.org`
   - Test all features (menu, reservations, admin)

3. **Share the link:**
   - Share `https://menu.dafitech.org` with customers
   - Update any marketing materials

## Security Notes

- Always use HTTPS (Vercel provides this automatically)
- Keep your DNS provider account secure
- Use strong passwords for DNS management

## Need Help?

- **Vercel Docs**: https://vercel.com/docs/concepts/projects/domains
- **DNS Provider Docs**: Check your DNS provider's documentation
- **Check Status**: Vercel dashboard shows domain status

## Quick Checklist

- [ ] Project deployed on Vercel
- [ ] Added `menu.dafitech.org` in Vercel Domains
- [ ] Added CNAME record in DNS provider
- [ ] Waited for DNS propagation (5-30 min)
- [ ] Verified domain shows "Valid Configuration" in Vercel
- [ ] Tested `https://menu.dafitech.org` in browser
- [ ] SSL certificate is active (HTTPS works)
