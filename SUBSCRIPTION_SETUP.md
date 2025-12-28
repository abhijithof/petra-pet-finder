# Subscription System Setup Guide

This guide will help you set up the complete subscription system with Google OAuth, Supabase, and Razorpay recurring payments.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Razorpay Account**: Sign up at [razorpay.com](https://razorpay.com)
3. **Google Cloud Console**: Access at [console.cloud.google.com](https://console.cloud.google.com)

## Step 1: Set Up Supabase

### 1.1 Use Your Existing Supabase Project
✅ **You already have a Supabase project for your mobile app - we'll use the same one!**

This is perfect because:
- Users can share authentication between web and mobile
- All user data stays in one place
- No need to manage multiple projects

### 1.2 Run Database Schema (Safe for Existing Projects)
1. Go to your existing Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `lib/supabase-schema-safe.sql` (use the safe version!)
4. Click **Run** to execute the schema

**Note:** The safe schema will:
- ✅ Add subscription tables without breaking existing ones
- ✅ Add new columns to your existing `profiles` table (if it exists)
- ✅ Create new tables only if they don't exist
- ✅ Won't delete or modify your existing mobile app data

### 1.3 Get Your Existing Credentials
1. Go to your Supabase project → **Settings** → **API**
2. Copy the following (you might already have these):
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 1.4 Insert Initial Subscription Plans
Run this SQL in the SQL Editor to create default plans:

```sql
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features) VALUES
(
  'Wag Basic',
  'Perfect for new pet parents',
  2999, -- ₹29.99/month
  29990, -- ₹299.90/year (save 20%)
  '["Unlimited pet guides", "Basic grooming tips", "Email support", "Access to community forum"]'::jsonb
),
(
  'Wag Plus',
  'Most popular plan with premium features',
  4299, -- ₹42.99/month
  42990, -- ₹429.90/year (save 20%)
  '["Everything in Basic", "Premium PDF guides", "Priority support", "Vet consultation (1x/month)", "Discount at partner stores"]'::jsonb
),
(
  'Wag Premium',
  'Complete pet care solution',
  6999, -- ₹69.99/month
  69990, -- ₹699.90/year (save 20%)
  '["Everything in Plus", "Unlimited vet consultations", "24/7 support", "Free grooming sessions", "Premium product discounts", "Personal pet care advisor"]'::jsonb
);
```

## Step 2: Set Up Google OAuth

### 2.1 Create OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the **Client ID** and **Client Secret**

### 2.2 Enable Google+ API
1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API" and enable it

## Step 3: Set Up Razorpay

### 3.1 Create Razorpay Account
1. Sign up at [razorpay.com](https://razorpay.com)
2. Complete KYC verification (required for live mode)

### 3.2 Get API Keys
1. Go to **Settings** → **API Keys**
2. Generate **Test Keys** (for development)
3. Copy:
   - **Key ID** → `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`

### 3.3 Set Up Webhooks
1. Go to **Settings** → **Webhooks**
2. Add a new webhook with URL: `https://yourdomain.com/api/subscriptions/webhook`
3. Select events:
   - `subscription.activated`
   - `subscription.charged`
   - `subscription.cancelled`
   - `subscription.paused`
   - `subscription.resumed`
   - `payment.captured`
   - `payment.failed`
4. Copy the **Webhook Secret** → `RAZORPAY_WEBHOOK_SECRET`

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Fill in all the values in `.env.local`:
   ```env
   # Supabase
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
   ```

3. Generate `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Run the Application

```bash
npm run dev
```

## Step 7: Test the Flow

1. **Sign In**: Go to `http://localhost:3000/auth/signin`
2. **Browse Plans**: Go to `http://localhost:3000/subscriptions`
3. **Subscribe**: Click "Subscribe Now" on any plan
4. **Complete Payment**: Use Razorpay test cards:
   - Success: `4111 1111 1111 1111`
   - Failure: `4000 0000 0000 0002`
5. **View Dashboard**: Go to `http://localhost:3000/dashboard`

## Troubleshooting

### "Module not found: razorpay"
- Run `npm install razorpay`
- Restart the dev server

### "Unauthorized" errors
- Check that all environment variables are set correctly
- Verify Supabase RLS policies are set up
- Ensure Google OAuth redirect URI matches exactly

### Webhook not receiving events
- Verify webhook URL is accessible (use ngrok for local testing)
- Check webhook secret matches in Razorpay dashboard
- Verify webhook events are enabled

### Subscription not activating
- Check Razorpay dashboard for subscription status
- Verify webhook is receiving events
- Check Supabase logs for errors

## Production Deployment

1. Update `NEXTAUTH_URL` to your production domain
2. Use Razorpay **Live Keys** instead of test keys
3. Update Google OAuth redirect URI to production URL
4. Set up production Supabase project
5. Configure production webhook URL in Razorpay

## Security Notes

- Never commit `.env.local` to git
- Keep `SUPABASE_SERVICE_ROLE_KEY` and `RAZORPAY_KEY_SECRET` secret
- Use environment variables in production (Vercel, Netlify, etc.)
- Enable RLS policies in Supabase for data security

