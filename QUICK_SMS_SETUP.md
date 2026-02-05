# Quick SMS Setup - 5 Minutes

## Why you didn't receive SMS

**Most likely reason:** Twilio is not configured yet.

## Quick Setup (5 minutes)

### 1. Get Twilio Account (2 minutes)

1. Go to https://www.twilio.com/try-twilio
2. Sign up (free - includes $15.50 credit)
3. Verify your email

### 2. Get Your Credentials (1 minute)

After signing up, you'll see:
- **Account SID** (starts with `AC...`)
- **Auth Token** (click to reveal)
- **Phone Number** (get a free trial number)

### 3. Add to Your Project (2 minutes)

**For Local Development:**

1. Create `.env.local` file in project root:
   ```bash
   touch .env.local
   ```

2. Add these lines:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```

3. Replace with your actual values from Twilio Console

4. Restart server:
   ```bash
   npm run dev
   ```

**For Production (Vercel):**

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the three variables above
3. Redeploy

### 4. Test (1 minute)

1. Make a test reservation with your phone number
2. Accept it in admin panel
3. Check your phone - you should receive SMS!

## Phone Number Format

**IMPORTANT:** Phone numbers must include country code with `+`

✅ **Correct:**
- `+251912345678` (Ethiopia)
- `+1234567890` (US)
- `+441234567890` (UK)

❌ **Wrong:**
- `0912345678` (missing + and country code)
- `1234567890` (missing +)

## Check if it's working

**Look at your server terminal/console when accepting a reservation:**

✅ **Success:**
```
✅ SMS sent successfully!
   Message SID: SMxxxxxxxxxxxxx
   To: +251912345678
```

❌ **Not configured:**
```
⚠️ Twilio not configured. SMS will not be sent.
   Missing: TWILIO_ACCOUNT_SID TWILIO_AUTH_TOKEN TWILIO_PHONE_NUMBER
```

## Trial Account Note

If using Twilio trial account:
- Can only send to **verified phone numbers**
- Go to Twilio Console → Phone Numbers → Verified Caller IDs
- Add your phone number for testing

## Still not working?

See `CHECK_SMS.md` for detailed troubleshooting.
