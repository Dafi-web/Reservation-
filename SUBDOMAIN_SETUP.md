# Subdomain Setup – Use Your Domain for This App

Use **your domain** so this web app (menu + reservations) is available at e.g. **menu.yourdomain.com** or **book.yourdomain.com**.

## 1. Add the subdomain in Vercel

1. Go to [vercel.com](https://vercel.com) → your project
2. **Settings** → **Domains**
3. Click **Add** (or **Add Domain**)
4. Enter the subdomain you want, e.g. **`menu.yourdomain.com`** (use your real domain instead of `yourdomain.com`)
5. Click **Add**
6. Vercel will show the exact DNS record to add (usually a **CNAME**)

## 2. Add the DNS record at your domain provider

You need **one CNAME record**. Use the **exact value** Vercel shows; often it is:

- **Type:** CNAME  
- **Name / Host:** `menu` (for `menu.yourdomain.com`) — some providers want just `menu`, others `menu.yourdomain.com`  
- **Value / Points to:** `cname.vercel-dns.com`  
- **TTL:** 3600 or default  

**Where to add it (examples):**

- **GoDaddy:** My Products → your domain → **DNS** / **Manage DNS** → Add CNAME
- **Namecheap:** Domain List → your domain → **Manage** → **Advanced DNS** → Add CNAME
- **Cloudflare:** Select your domain → **DNS** → **Records** → Add CNAME
- **Google Domains / Squarespace / other:** Find “DNS” or “Manage DNS” for your domain → Add CNAME with the name and value above

## 3. Wait and check

- DNS can take **5–30 minutes** (sometimes up to 48 hours).
- In Vercel → **Settings** → **Domains**, the subdomain should change to **Valid Configuration**.
- Vercel will enable **HTTPS** automatically.

## 4. Test

- Open **`https://menu.yourdomain.com`** (or your chosen subdomain).
- The app should load. You can use this link as the main URL for this web app.

## Option 2: Using Other Hosting Providers

If you're not using Vercel, the process is similar:

### For Netlify:
1. Add domain in Netlify dashboard
2. Add CNAME record pointing to your Netlify domain

### For Railway/Render:
1. Add custom domain in their dashboard
2. Follow their DNS instructions

## DNS record example

```
Type:   CNAME
Name:   menu          (for menu.yourdomain.com)
Value:  cname.vercel-dns.com
TTL:    3600
```

If your provider does not support CNAME for the root, use the subdomain (e.g. `menu`). Vercel may also offer an **A** record; use the value they show.

## Check that DNS is correct

- **Vercel:** Settings → Domains → status should become **Valid Configuration**.
- **Online:** [dnschecker.org](https://dnschecker.org) or [whatsmydns.net](https://www.whatsmydns.net) — enter `menu.yourdomain.com` and confirm it resolves.

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

## Subdomain name ideas (use your domain)

- `menu.yourdomain.com` – menu + reservations
- `book.yourdomain.com` – booking focus
- `reserve.yourdomain.com` – reservations
- `restaurant.yourdomain.com` – general

No code changes are needed; the app works on the subdomain as soon as DNS and Vercel show valid.

## Security Notes

- Always use HTTPS (Vercel provides this automatically)
- Keep your DNS provider account secure
- Use strong passwords for DNS management

## Need Help?

- **Vercel Docs**: https://vercel.com/docs/concepts/projects/domains
- **DNS Provider Docs**: Check your DNS provider's documentation
- **Check Status**: Vercel dashboard shows domain status

## Quick checklist

- [ ] App deployed on Vercel
- [ ] Added `menu.yourdomain.com` (or your choice) in Vercel → Settings → Domains
- [ ] Added CNAME record at your DNS provider
- [ ] Waited 5–30 min (or up to 48 h) for DNS
- [ ] Vercel shows **Valid Configuration**
- [ ] Opened `https://menu.yourdomain.com` and confirmed the app loads (HTTPS works)
