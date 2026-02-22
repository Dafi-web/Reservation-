# Email setup (simple – no domain)

Use **one Gmail account** to send all emails. No domain and no Resend needed. Admin and any guest can receive emails.

---

## Step 1: Create a Gmail App Password

1. Use a Gmail account (e.g. **wediabrhana@gmail.com** or a separate one for the restaurant).
2. Go to [Google Account](https://myaccount.google.com) → **Security**.
3. Turn on **2-Step Verification** if it’s not already on.
4. Go to **Security** → **2-Step Verification** → **App passwords** (or search “App passwords”).
5. Create an app password:
   - App: **Mail**
   - Device: **Other** → name it e.g. “Ristorante Africa”
6. Copy the **16-character password** (no spaces).

---

## Step 2: Add in Vercel

1. Open your project on [vercel.com](https://vercel.com) → **Settings** → **Environment Variables**.
2. Add:

   | Name | Value | Environment |
   |------|--------|-------------|
   | `GMAIL_USER` | Your full Gmail address (e.g. wediabrhana@gmail.com) | Production (and others if needed) |
   | `GMAIL_APP_PASSWORD` | The 16-character app password from Step 1 | Production (and others if needed) |
   | `ADMIN_EMAIL` | Optional. Who gets admin alerts. Default: wediabrhana@gmail.com | Production (optional) |

3. Click **Save**.

---

## Step 3: Redeploy

1. **Deployments** → **⋯** on latest → **Redeploy**.
2. Wait for the deploy to finish.

---

## Who gets what

- **User submits a reservation**  
  - **Admin** (wediabrhana@gmail.com) gets “New reservation” email.  
  - **Guest** gets “We received your request” email (if they entered their email on the form).

- **Admin accepts a reservation**  
  - **Guest** gets “Your reservation is confirmed” email (if they entered their email).

All of these are sent **from** your Gmail address and can be delivered to **any** email (no domain needed).

---

## Troubleshooting

- **“Username and Password not accepted”**  
  Use an **App Password**, not your normal Gmail password. Create one in Google Account → Security → App passwords.

- **No emails at all**  
  Check that `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set in Vercel and you **redeployed** after adding them.

- **Admin email**  
  By default the code sends admin notifications to **wediabrhana@gmail.com**. You can use the same Gmail for sending and receiving, or set `ADMIN_EMAIL` to another address.
