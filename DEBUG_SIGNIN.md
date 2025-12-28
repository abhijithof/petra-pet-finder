# Debug Sign-In Issues

## The Problem

After clicking "Sign in with Google" and completing OAuth, you're redirected back to the sign-in page instead of being logged in.

## Possible Causes

1. **Supabase Adapter Not Working** - If environment variables are missing, the adapter is `undefined`
2. **Session Not Being Created** - Database strategy requires the adapter to work
3. **Session Callback Error** - An error in the session callback might be preventing session creation

## Debug Steps

### Step 1: Check Environment Variables

Visit: `https://www.thepetra.in/api/auth/check-env`

This will show which environment variables are missing.

### Step 2: Test Session Creation

Visit: `https://www.thepetra.in/api/auth/test-session`

This will show if a session exists after sign-in.

### Step 3: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on latest deployment
3. Go to **Functions** tab
4. Look for `/api/auth/[...nextauth]`
5. Check for errors during sign-in

### Step 4: Check Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Try to sign in
4. Look for any errors

## Common Issues & Fixes

### Issue 1: Adapter is Undefined

**Symptom**: Session strategy is 'database' but adapter is undefined

**Fix**: Make sure these are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The code will fall back to JWT strategy if adapter is undefined, but you need to redeploy.

### Issue 2: Session Callback Error

**Symptom**: Session callback throws an error, preventing session creation

**Fix**: Check Vercel logs for errors in the session callback. The code now handles errors gracefully.

### Issue 3: Database Tables Missing

**Symptom**: Supabase adapter can't create sessions because tables don't exist

**Fix**: Make sure you've run the database migration in Supabase. The adapter needs these tables:
- `users`
- `accounts`
- `sessions`
- `verification_tokens`

These are created automatically by the Supabase adapter, but only if the adapter is properly initialized.

## Quick Test

After signing in, check:

1. **Session exists?** Visit `/api/auth/test-session`
2. **User in database?** Check Supabase `auth.users` table
3. **Session in database?** Check Supabase `public.sessions` table (if using database strategy)

## Fallback Solution

If the database strategy isn't working, the code will automatically fall back to JWT strategy when the adapter is undefined. However, you need to:

1. Make sure `NEXTAUTH_SECRET` is set in Vercel
2. Redeploy after setting environment variables

