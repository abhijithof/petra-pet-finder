# Exact Steps to Fix Google OAuth Redirect URI

## Current Error
**Error 400: redirect_uri_mismatch**

Your app is trying to use: `https://www.thepetra.in/api/auth/callback/google`

## Step-by-Step Fix

### Step 1: Go to Google Cloud Console
1. Open [Google Cloud Console](https://console.cloud.google.com)
2. Make sure you're in the correct project
3. Go to **APIs & Services** → **Credentials** (left sidebar)

### Step 2: Find Your OAuth Client
1. Look for **OAuth 2.0 Client IDs** section
2. Find your OAuth 2.0 Client ID (the one you created)
3. Click on the **pencil icon** (Edit) or click the client name

### Step 3: Add Redirect URIs (EXACT COPY-PASTE)

In the **Authorized redirect URIs** field, add these EXACTLY (one per line):

```
https://www.thepetra.in/api/auth/callback/google
https://thepetra.in/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

**CRITICAL:**
- ✅ Copy-paste exactly (no extra spaces)
- ✅ Must include `https://` (not `http://` for production)
- ✅ Must include `/api/auth/callback/google` at the end
- ✅ NO trailing slash
- ✅ Add BOTH www and non-www versions

### Step 4: Save
1. Scroll down and click **SAVE**
2. Wait 2-3 minutes for Google to update (this is important!)

### Step 5: Check Vercel Environment Variable

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Find `NEXTAUTH_URL`
5. Make sure it's set to: `https://www.thepetra.in` (or `https://thepetra.in` if you prefer non-www)
6. Make sure it's set for **Production** environment
7. If you changed it, **redeploy** your app

### Step 6: Test Again
1. Wait 2-3 minutes after saving in Google Cloud Console
2. Go to: `https://www.thepetra.in/auth/signin`
3. Click "Sign in with Google"
4. It should work now!

## Verification Checklist

Before testing, verify:

- [ ] Redirect URI added in Google Cloud Console: `https://www.thepetra.in/api/auth/callback/google`
- [ ] Redirect URI added: `https://thepetra.in/api/auth/callback/google`
- [ ] Clicked **SAVE** in Google Cloud Console
- [ ] Waited 2-3 minutes after saving
- [ ] `NEXTAUTH_URL` in Vercel is `https://www.thepetra.in` (or `https://thepetra.in`)
- [ ] `NEXTAUTH_URL` is set for **Production** environment
- [ ] Redeployed after changing `NEXTAUTH_URL` (if you changed it)

## Common Mistakes

❌ **Wrong**: `https://www.thepetra.in/api/auth/callback/google/` (trailing slash)
✅ **Correct**: `https://www.thepetra.in/api/auth/callback/google`

❌ **Wrong**: `http://www.thepetra.in/api/auth/callback/google` (http instead of https)
✅ **Correct**: `https://www.thepetra.in/api/auth/callback/google`

❌ **Wrong**: `https://thepetra.in/api/auth/callback/Google` (capital G)
✅ **Correct**: `https://thepetra.in/api/auth/callback/google`

❌ **Wrong**: `www.thepetra.in/api/auth/callback/google` (missing https://)
✅ **Correct**: `https://www.thepetra.in/api/auth/callback/google`

## Still Not Working?

### Check What Redirect URI is Actually Being Sent

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to sign in
4. Look for the request to `accounts.google.com`
5. Check the `redirect_uri` parameter in the URL
6. Make sure this EXACT string is in Google Cloud Console

### Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on latest deployment
3. Go to **Functions** tab
4. Look for errors in `/api/auth/[...nextauth]`
5. Check for any environment variable issues

### Double-Check NEXTAUTH_URL

The `NEXTAUTH_URL` must match your actual domain:
- If your site is `https://www.thepetra.in` → `NEXTAUTH_URL=https://www.thepetra.in`
- If your site is `https://thepetra.in` → `NEXTAUTH_URL=https://thepetra.in`

## Quick Test

After adding the redirect URI, you can test if it's working by visiting:
```
https://www.thepetra.in/api/auth/callback/google?error=test
```

If you see a NextAuth error page (not a 404), then the route is working and the issue is just the redirect URI not being registered yet.

