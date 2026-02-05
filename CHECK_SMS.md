# Troubleshooting SMS Not Received

If you didn't receive an SMS confirmation, follow these steps:

## Step 1: Check Twilio Configuration

**Check if Twilio is configured:**

1. Look at your server logs when accepting a reservation
2. You should see one of these messages:
   - ✅ `SMS sent successfully!` - SMS was sent
   - ⚠️ `Twilio not configured` - Twilio credentials are missing

**If Twilio is not configured:**

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add these variables:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```
3. Restart your development server: `npm run dev`

## Step 2: Check Phone Number Format

**Phone numbers MUST include country code with +**

✅ **Correct formats:**
- `+1234567890` (US)
- `+251912345678` (Ethiopia)
- `+441234567890` (UK)

❌ **Incorrect formats:**
- `1234567890` (missing +)
- `(123) 456-7890` (has formatting characters)
- `123-456-7890` (missing country code)

**How to fix:**
- When making a reservation, enter phone number with country code
- Example: `+251912345678` instead of `0912345678`

## Step 3: Check Server Logs

**When you accept a reservation, check the terminal/console for:**

1. **Success message:**
   ```
   ✅ SMS sent successfully!
      Message SID: SMxxxxxxxxxxxxx
      To: +1234567890
      Status: queued
   ```

2. **Error messages:**
   ```
   ❌ Error sending SMS:
      Error code: 21211
      Error message: Invalid 'To' Phone Number
   ```

## Step 4: Common Issues

### Issue 1: "Twilio not configured"
**Solution:** Add Twilio credentials to `.env.local` (see Step 1)

### Issue 2: "Invalid phone number"
**Solution:** 
- Ensure phone number includes country code with `+`
- Remove spaces, dashes, parentheses
- Format: `+[country code][number]`

### Issue 3: "Trial account restriction"
**Solution:**
- Twilio trial accounts can only send to verified numbers
- Go to Twilio Console → Phone Numbers → Verified Caller IDs
- Add your phone number for testing

### Issue 4: "Insufficient balance"
**Solution:**
- Check your Twilio account balance
- Add funds if needed

## Step 5: Test Twilio Connection

**Quick test:**

1. Check if environment variables are loaded:
   ```bash
   # In your terminal, run:
   node -e "console.log('SID:', process.env.TWILIO_ACCOUNT_SID ? 'Set' : 'Missing')"
   ```

2. Check server logs when accepting a reservation
3. Look for SMS-related log messages

## Step 6: Verify in Twilio Console

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Monitor** → **Logs** → **Messaging**
3. Check if SMS was attempted
4. Look for error messages or delivery status

## Still Not Working?

1. **Check the reservation phone number:**
   - Go to admin panel
   - Check the phone number format in the reservation
   - Ensure it has country code

2. **Check Twilio account:**
   - Verify account is active
   - Check account balance
   - Verify phone number is active

3. **Check server logs:**
   - Look for detailed error messages
   - Check if SMS function is being called
   - Verify reservation status is "confirmed"

4. **Test with a verified number:**
   - If using Twilio trial, verify your number first
   - Go to Twilio Console → Phone Numbers → Verified Caller IDs

## Need More Help?

- Check `TWILIO_SETUP.md` for complete setup guide
- Review Twilio documentation: https://www.twilio.com/docs
- Check server logs for specific error messages
