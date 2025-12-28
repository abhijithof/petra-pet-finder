# Using Your Existing Supabase Project

Perfect! You're using your existing Supabase project that you already use for your mobile app. This is the best approach because:

✅ **Shared Authentication** - Users can sign in on web and mobile with the same account  
✅ **Unified Data** - All user data in one place  
✅ **No Duplication** - No need to sync data between projects  

## Quick Setup Steps

### 1. Run the Safe Schema Migration (2 minutes)

1. Go to your existing Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `lib/supabase-schema-safe.sql`
4. Click **Run** to execute

**What this does:**
- ✅ Adds subscription-related tables (`subscription_plans`, `subscriptions`, `payments`)
- ✅ Adds new columns to your existing `profiles` table (`phone`, `razorpay_customer_id`)
- ✅ Sets up Row Level Security policies
- ✅ **Won't break or delete your existing mobile app data**

### 2. Insert Default Subscription Plans (1 minute)

1. Still in **SQL Editor**
2. Copy and paste the contents of `lib/insert-default-plans.sql`
3. Click **Run**

This creates 3 default plans (Wag Basic, Wag Plus, Wag Premium).

### 3. Get Your Credentials (Already have these!)

Since you're using your existing project, you likely already have these:

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Update Your `.env.local`

Add these to your existing `.env.local`:

```env
# Supabase (use your existing project credentials)
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

## Compatibility with Your Mobile App

The schema is designed to be compatible:

- **Profiles Table**: Adds new columns but doesn't modify existing ones
- **New Tables**: Subscription tables are separate and won't conflict
- **RLS Policies**: Only adds new policies, won't affect existing ones
- **Auth**: Uses the same `auth.users` table your mobile app uses

## What If My Profiles Table Has Different Columns?

No problem! The code handles this gracefully:

- Uses optional chaining (`profile?.full_name`) so missing columns won't break
- The upsert only updates columns that exist
- New columns are added safely with `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`

## Testing

1. Sign in with Google at `/auth/signin`
2. Browse plans at `/subscriptions`
3. Subscribe to a plan
4. Check your dashboard at `/dashboard`

Your mobile app users can also subscribe through the web, and their subscription will be visible in both apps!

## Need Help?

If you encounter any issues:
1. Check that the schema migration ran successfully
2. Verify your RLS policies are set up correctly
3. Make sure your service role key has proper permissions

The safe schema script is idempotent - you can run it multiple times without issues.

