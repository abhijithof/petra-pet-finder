# Next Steps After Database Setup ✅

Great! Your database is set up. Now let's configure the rest:

## ✅ Completed
- [x] Database schema created
- [x] Subscription plans inserted

## 🔧 Next Steps

### 1. Set Up Google OAuth (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (Add your production URL later: `https://yourdomain.com/api/auth/callback/google`)
7. Copy the **Client ID** and **Client Secret**

### 2. Set Up Razorpay (5 minutes)

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign in or create account
3. Go to **Settings** → **API Keys**
4. Generate **Test Keys** (for development)
5. Copy:
   - **Key ID** → `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`
6. Set up webhook (for local testing, use ngrok):
   - Go to **Settings** → **Webhooks**
   - Add webhook URL: `https://your-ngrok-url.ngrok.io/api/subscriptions/webhook`
   - Select events:
     - `subscription.activated`
     - `subscription.charged`
     - `subscription.cancelled`
     - `subscription.paused`
     - `subscription.resumed`
     - `payment.captured`
     - `payment.failed`
   - Copy the **Webhook Secret** → `RAZORPAY_WEBHOOK_SECRET`

### 3. Configure Environment Variables (2 minutes)

1. Make sure you have `.env.local` file (copy from `env.example` if needed)
2. Add all the credentials:

```env
# Supabase (you already have these from your existing project)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx

# Existing Gmail config (if you have it)
GMAIL_USER=Pet.Ra'sgroupofficial@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

3. Generate `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

### 4. Test Locally (Optional - for webhook testing)

If you want to test webhooks locally:

1. Install ngrok: `brew install ngrok` (Mac) or download from ngrok.com
2. Start your dev server: `npm run dev`
3. In another terminal, run: `ngrok http 3000`
4. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
5. Use this URL in Razorpay webhook settings: `https://abc123.ngrok.io/api/subscriptions/webhook`

### 5. Start the Application

```bash
npm run dev
```

### 6. Test the Flow

1. **Sign In**: Go to `http://localhost:3000/auth/signin`
   - Click "Continue with Google"
   - Sign in with your Google account

2. **Browse Plans**: Go to `http://localhost:3000/subscriptions`
   - You should see 3 plans (Wag Basic, Wag Plus, Wag Premium)
   - Toggle between Monthly/Yearly

3. **Subscribe**: Click "Subscribe Now" on any plan
   - You'll be redirected to Razorpay checkout
   - Use test card: `4111 1111 1111 1111` (any future expiry, any CVV)
   - Complete the payment

4. **View Dashboard**: Go to `http://localhost:3000/dashboard`
   - You should see your active subscription

## 🎯 Quick Checklist

- [ ] Google OAuth credentials created
- [ ] Razorpay test keys generated
- [ ] Razorpay webhook configured (use ngrok for local)
- [ ] All environment variables added to `.env.local`
- [ ] `NEXTAUTH_SECRET` generated
- [ ] Dev server running (`npm run dev`)
- [ ] Tested sign-in flow
- [ ] Tested subscription flow
- [ ] Verified dashboard shows subscription

## 🐛 Troubleshooting

### "Module not found: razorpay"
- Run: `npm install razorpay`
- Restart dev server

### "Unauthorized" errors
- Check all environment variables are set
- Verify Supabase credentials are correct
- Make sure RLS policies are set up (they should be from migration)

### Webhook not working
- Make sure ngrok is running
- Verify webhook URL in Razorpay matches ngrok URL
- Check webhook secret matches in `.env.local`

### Google OAuth not working
- Verify redirect URI matches exactly: `http://localhost:3000/api/auth/callback/google`
- Check Client ID and Secret are correct
- Make sure Google+ API is enabled

## 🚀 You're Ready!

Once everything is configured, your subscription system is fully functional!

