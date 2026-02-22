# Resend + Vercel: Get Email Notifications

**No domain?** Use **Gmail** instead – see **[EMAIL_SETUP_SIMPLE.md](./EMAIL_SETUP_SIMPLE.md)**. Add `GMAIL_USER` and `GMAIL_APP_PASSWORD` in Vercel and you can send to admin and any guest with no domain.

---

If you prefer Resend (or have a domain), follow the steps below.

---

## Step 1: Create a Resend account

1. Go to **[resend.com](https://resend.com)** and sign up (free).
2. Verify your email address.

---

## Step 2: Get your API key

1. In Resend, go to **API Keys** (in the left sidebar or under **Settings**).
2. Click **Create API Key**.
3. Give it a name (e.g. `Ristorante Africa Vercel`).
4. Choose **Sending access** (or Full access if you prefer).
5. Click **Create**.
6. **Copy the API key** (it starts with `re_`). You won’t see it again, so save it somewhere safe.

---

## Step 3: Add the API key in Vercel

1. Go to **[vercel.com](https://vercel.com)** and open your project (the menu/reservations app).
2. Click **Settings** (top menu).
3. In the left sidebar, click **Environment Variables**.
4. Add a new variable:
   - **Name:** `RESEND_API_KEY`
   - **Value:** paste the key you copied (e.g. `re_xxxxxxxxxxxx`)
   - **Environment:** select **Production** (and **Preview** / **Development** if you use them).
5. Click **Save**.

---

## Step 3b: Send to ANY email (admin + any guest)

By default, Resend may only deliver to the **email address you used to sign up**. To deliver to **any address** (admin wediabrhana@gmail.com, and any guest who enters their email), you must **verify a domain** in Resend and send from that domain.

1. In **Resend**, go to **Domains** (left sidebar).
2. Click **Add Domain** and enter your domain (e.g. `yourrestaurant.com` or the domain of your Vercel app, e.g. `your-app.vercel.app` is not a custom domain – use a domain you own).
3. Resend will show **DNS records** (e.g. MX, TXT, CNAME). Add these in your DNS provider (where you bought the domain).
4. Wait until Resend shows the domain as **Verified** (can take a few minutes up to 48 hours).
5. In **Vercel** → **Environment Variables**, add:
   - **Name:** `RESEND_FROM_EMAIL`
   - **Value:** an address on your verified domain, e.g. `Ristorante Africa <noreply@yourdomain.com>` or `noreply@yourdomain.com`
   - **Environment:** Production (and others if needed).
6. **Redeploy** (Step 4). After that, the app will send from your domain and Resend will deliver to **any recipient** (admin and guests).

If you skip this step, emails may only be delivered to the Resend account owner’s email.

---

## Step 4: Redeploy

Environment variables only apply on the **next** deployment.

1. Go to the **Deployments** tab.
2. Open the **⋯** menu on the latest deployment.
3. Click **Redeploy**.
4. Wait for the deployment to finish.

---

## Step 5: Test

1. Open your live site (e.g. `https://your-app.vercel.app`).
2. Go to the **Reservations** page and submit a test reservation (use a real email for the guest if you want to test customer confirmation later).
3. **Admin email:** You should receive an email at **wediabrhana@gmail.com** with the new reservation details.
4. **Customer email:** Log in to the admin panel, find the test reservation, and click **Accept**. If the guest entered an email, they should receive a confirmation email.

---

## Who gets which email?

| Event | Recipient | Email |
|-------|-----------|--------|
| User submits a reservation | Admin | wediabrhana@gmail.com (new reservation alert) |
| User submits a reservation and entered their email | Guest | The email they entered (“We received your request”) |
| Admin accepts a reservation and the guest left an email | Guest | The email they entered (confirmation) |

---

## Troubleshooting

- **Emails only go to the Resend account email, not to admin or guests**
  - Resend restricts delivery until you **verify a domain**. Follow **Step 3b** above: add and verify your domain in Resend, then set `RESEND_FROM_EMAIL` in Vercel (e.g. `noreply@yourdomain.com`) and redeploy. After that, admin (wediabrhana@gmail.com) and any guest email will receive messages.

- **No admin email when someone books**
  - Confirm `RESEND_API_KEY` is set in Vercel (Step 3) and you **redeployed** (Step 4).
  - If you need delivery to wediabrhana@gmail.com (not your Resend signup email), complete **Step 3b** (domain verification + `RESEND_FROM_EMAIL`).

- **No customer “request received” or confirmation when you accept**
  - The guest must have entered a **valid email** on the reservation form (optional field).
  - For delivery to any guest email, complete **Step 3b** (domain verification + `RESEND_FROM_EMAIL`).

- **Resend free tier**
  - You can send a limited number of emails per day on the free plan. For a restaurant, this is usually enough.

---

## Summary

1. Sign up at [resend.com](https://resend.com).
2. Create an API key and copy it.
3. In Vercel → Project → **Settings** → **Environment Variables**, add `RESEND_API_KEY` with that value.
4. **Redeploy** the project from the Deployments tab.
5. Test by making a reservation and checking the admin inbox (and accepting one to test guest confirmation).
