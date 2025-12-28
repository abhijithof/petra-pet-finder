# Razorpay Webhook Setup Guide

## For Local Development (Using ngrok)

### Step 1: Install ngrok
```bash
# Mac
brew install ngrok

# Or download from https://ngrok.com/download
```

### Step 2: Start your dev server
```bash
npm run dev
```

### Step 3: Start ngrok in another terminal
```bash
ngrok http 3000
```

You'll get a URL like: `https://abc123.ngrok.io`

### Step 4: Set up Razorpay Webhook

1. Go to Razorpay Dashboard → **Settings** → **Webhooks**
2. Click **Create Webhook** or **Add New Webhook**
3. Fill in:
   - **Webhook URL**: `https://abc123.ngrok.io/api/subscriptions/webhook`
     (Replace `abc123` with your actual ngrok URL)
   - **Secret**: Enter a strong secret (e.g., `Abhijith@kumar123` or generate one)
   - **Alert Email**: Your email for webhook failure alerts
4. **Select Events** - Check these:
   - ✅ `subscription.activated`
   - ✅ `subscription.charged`
   - ✅ `subscription.cancelled`
   - ✅ `subscription.paused`
   - ✅ `subscription.resumed`
   - ✅ `payment.captured`
   - ✅ `payment.failed`
5. Click **Create Webhook**
6. Copy the **Webhook Secret** and add it to `.env.local`:
   ```env
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_razorpay
   ```

## For Production

1. Use your production URL instead of ngrok:
   - **Webhook URL**: `https://yourdomain.com/api/subscriptions/webhook`
2. Follow the same steps above

## Important Notes

⚠️ **Keep ngrok running** while testing webhooks locally. If you restart ngrok, you'll get a new URL and need to update the webhook in Razorpay.

⚠️ **Webhook Secret** - This is different from your Razorpay Key Secret. You'll get it after creating the webhook.

## Testing Webhooks

After setting up:
1. Create a test subscription
2. Check your Supabase `subscriptions` table - status should update via webhook
3. Check Razorpay Dashboard → **Webhooks** → **Logs** to see webhook deliveries

## Troubleshooting

### Webhook not receiving events
- Make sure ngrok is running
- Verify webhook URL in Razorpay matches ngrok URL exactly
- Check webhook secret matches in `.env.local`
- Restart your dev server after updating `.env.local`

### "Hostname not allowed" error
- Make sure you're using the actual ngrok URL, not the placeholder
- The URL should start with `https://` and end with `.ngrok.io`

