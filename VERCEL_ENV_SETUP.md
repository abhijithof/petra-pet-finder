# Fix 500 Error on Sign In - Vercel Environment Variables

## The Problem

You're getting a 500 Internal Server Error when trying to sign in. This is almost certainly because **environment variables are missing in Vercel**.

## Quick Fix

### Step 1: Check Your Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Make sure ALL these variables are set:

**Required Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=https://thepetra.in
NEXTAUTH_SECRET=your_nextauth_secret_here
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
GMAIL_USER=Pet.Ra'sgroupofficial@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

### Step 2: Set Environment for Production

For each variable, make sure:
- ✅ **Environment** is set to **Production** (or **All**)
- ✅ The value is correct (no extra spaces)
- ✅ Click **Save** after adding each variable

### Step 3: Redeploy

After adding all variables:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a rebuild

## Test Your Environment Variables

I've created a test endpoint. Visit:
```
https://thepetra.in/api/auth/check-env
```

This will show you which environment variables are missing.

## Common Issues

### Issue 1: Variables Not Set for Production
- **Fix**: Make sure each variable has "Production" selected in the Environment dropdown

### Issue 2: Wrong NEXTAUTH_URL
- **Fix**: Should be `https://thepetra.in` (your production domain), not `http://localhost:3000`

### Issue 3: Missing Supabase Service Role Key
- **Fix**: Get it from Supabase Dashboard → Settings → API → service_role key

### Issue 4: Google OAuth Redirect URI
- **Fix**: Make sure Google Cloud Console has `https://thepetra.in/api/auth/callback/google` as an authorized redirect URI

## Verify After Fix

1. Visit `https://thepetra.in/api/auth/check-env` - should show `status: "ok"`
2. Try signing in again
3. Check Vercel logs if it still fails: **Deployments** → Click deployment → **Functions** tab

## Still Not Working?

Check Vercel Function Logs:
1. Go to **Deployments** → Latest deployment
2. Click **Functions** tab
3. Look for errors in `/api/auth/[...nextauth]`
4. The logs will show exactly which variable is missing

