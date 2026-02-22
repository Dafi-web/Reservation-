# Resend + Vercel: Get Email Notifications

Follow these steps to receive **admin emails** when users make reservations, and **customer confirmation emails** when you accept a booking.

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
3. **Admin email:** You should receive an email at **fikrselina@gmail.com** with the new reservation details.
4. **Customer email:** Log in to the admin panel, find the test reservation, and click **Accept**. If the guest entered an email, they should receive a confirmation email.

---

## Who gets which email?

| Event | Recipient | Email |
|-------|-----------|--------|
| User submits a reservation | Admin | fikrselina@gmail.com (new reservation alert) |
| Admin accepts a reservation and the guest left an email | Guest | The email they entered on the form (confirmation) |

---

## Troubleshooting

- **No admin email when someone books**
  - Confirm `RESEND_API_KEY` is set in Vercel (Step 3) and you **redeployed** (Step 4).
  - In Vercel, open **Logs** or **Functions** and trigger a test reservation. Look for `[Reservation] Admin email sent` or a warning about `RESEND_API_KEY`.

- **No customer confirmation when you accept**
  - The guest must have entered an **email** on the reservation form (optional field).
  - `RESEND_API_KEY` must be set and the app redeployed.

- **Resend free tier**
  - You can send a limited number of emails per day on the free plan. For a restaurant, this is usually enough.

---

## Summary

1. Sign up at [resend.com](https://resend.com).
2. Create an API key and copy it.
3. In Vercel → Project → **Settings** → **Environment Variables**, add `RESEND_API_KEY` with that value.
4. **Redeploy** the project from the Deployments tab.
5. Test by making a reservation and checking the admin inbox (and accepting one to test guest confirmation).
