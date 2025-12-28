# Quick Start: Subscription System

## What's Been Set Up

✅ **Google OAuth Authentication** - Users can sign in with Google  
✅ **Supabase Backend** - Database for users, subscriptions, and payments  
✅ **Razorpay Subscriptions** - Recurring payment system with autopay  
✅ **Subscription Plans** - Monthly and yearly billing options  
✅ **User Dashboard** - View subscription status and manage account  
✅ **Webhook Integration** - Automatic subscription status updates  

## Key Files Created

### Backend
- `lib/supabase.ts` - Supabase client configuration
- `lib/supabase-schema.sql` - Database schema (run this in Supabase SQL Editor)
- `lib/auth.ts` - Authentication helpers
- `pages/api/auth/[...nextauth].ts` - NextAuth configuration with Google OAuth
- `pages/api/subscriptions/create.ts` - Create new subscriptions
- `pages/api/subscriptions/webhook.ts` - Handle Razorpay webhooks
- `pages/api/subscriptions/my-subscription.ts` - Get user's subscription
- `pages/api/subscriptions/plans.ts` - Get available plans

### Frontend
- `pages/auth/signin.tsx` - Google sign-in page
- `pages/subscriptions/index.tsx` - Browse and subscribe to plans
- `pages/dashboard.tsx` - User dashboard with subscription info

## Next Steps

1. **Set up Supabase** (2 minutes - using your existing project!)
   - Use your existing Supabase project (the one for your mobile app)
   - Run `lib/supabase-schema-safe.sql` in SQL Editor (safe for existing projects)
   - Insert default plans (see SUBSCRIPTION_SETUP.md)
   - Get API keys from Settings → API (you might already have these)

2. **Set up Google OAuth** (5 minutes)
   - Go to Google Cloud Console
   - Create OAuth credentials
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`

3. **Set up Razorpay** (5 minutes)
   - Create account at razorpay.com
   - Get test API keys
   - Set up webhook (use ngrok for local testing)

4. **Configure Environment** (2 minutes)
   - Copy `env.example` to `.env.local`
   - Fill in all credentials
   - Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`

5. **Test the Flow**
   - Sign in at `/auth/signin`
   - Browse plans at `/subscriptions`
   - Subscribe to a plan
   - View dashboard at `/dashboard`

## Routes

- `/auth/signin` - Sign in with Google
- `/subscriptions` - Browse and subscribe to plans
- `/dashboard` - User dashboard (requires auth)
- `/api/subscriptions/webhook` - Razorpay webhook endpoint

## Environment Variables Needed

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_WEBHOOK_SECRET=
```

## Testing Locally

1. Start dev server: `npm run dev`
2. Use ngrok for webhook testing: `ngrok http 3000`
3. Update Razorpay webhook URL to ngrok URL
4. Use Razorpay test cards for payments

For detailed setup instructions, see `SUBSCRIPTION_SETUP.md`.

