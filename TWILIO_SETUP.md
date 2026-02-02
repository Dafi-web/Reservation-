# Twilio SMS Setup Guide

This guide will help you set up Twilio SMS notifications for reservation confirmations.

## Why SMS Notifications?

When an admin accepts a reservation, the customer automatically receives an SMS confirmation with:
- Reservation date and time
- Number of guests
- Restaurant name (Africa Restorante)

## Step 1: Create a Twilio Account

1. Go to [twilio.com](https://www.twilio.com)
2. Sign up for a free account (includes $15.50 free credit for testing)
3. Verify your email and phone number

## Step 2: Get Your Twilio Credentials

1. After logging in, go to the [Twilio Console](https://console.twilio.com/)
2. You'll see your **Account SID** and **Auth Token** on the dashboard
3. Copy these values (you'll need them for environment variables)

## Step 3: Get a Phone Number

1. In the Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Choose a number (you can get a free trial number)
3. Select your country and requirements
4. Click **Buy** (trial accounts get one free number)
5. Copy the phone number (format: +1234567890)

## Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**For Vercel deployment:**
- Go to your Vercel project settings
- Navigate to **Environment Variables**
- Add the three variables above
- Redeploy your application

## Step 5: Test SMS

1. Make a test reservation through your app
2. Accept the reservation in the admin panel
3. Check the phone number - you should receive an SMS!

## SMS Message Format

**Confirmation SMS:**
```
Hello [Name]! Your reservation at Africa Restorante has been confirmed. 
📅 Date: [Formatted Date]
⏰ Time: [Time]
👥 Guests: [Number]
We look forward to serving you!
```

**Rejection SMS:**
```
Hello [Name], we're sorry to inform you that your reservation at Africa Restorante could not be confirmed. 
Reason: [Rejection reason]
Please contact us to make a new reservation. Thank you for your understanding.
```

## Phone Number Format

- Phone numbers must include country code
- Format: `+[country code][number]`
- Examples:
  - US: `+1234567890`
  - UK: `+441234567890`
  - Ethiopia: `+251912345678`

## Troubleshooting

### SMS Not Sending

1. **Check Twilio credentials:**
   - Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are correct
   - Make sure `TWILIO_PHONE_NUMBER` includes country code with `+`

2. **Check phone number format:**
   - Ensure customer phone numbers include country code
   - Format: `+[country code][number]`

3. **Check Twilio Console:**
   - Go to **Monitor** → **Logs** → **Messaging**
   - Look for error messages

4. **Trial Account Limitations:**
   - Trial accounts can only send SMS to verified numbers
   - Verify numbers in Twilio Console → **Phone Numbers** → **Verified Caller IDs**

### Common Errors

- **"Invalid phone number"**: Check phone number format (must include country code)
- **"Unauthorized"**: Check your Account SID and Auth Token
- **"Trial account restriction"**: Verify the recipient phone number in Twilio Console

## Cost

- **Trial Account**: Free $15.50 credit
- **Paid Account**: ~$0.0075 per SMS (varies by country)
- **Free Trial Number**: Can only send to verified numbers

## Security Notes

- Never commit `.env.local` to Git
- Keep your Auth Token secret
- Use environment variables in production
- Consider using Twilio's webhook for delivery status

## Need Help?

- [Twilio Documentation](https://www.twilio.com/docs)
- [Twilio Support](https://support.twilio.com/)
- Check server logs for detailed error messages
