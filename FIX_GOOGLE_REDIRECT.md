# Fix Google OAuth Redirect URI Mismatch

## The Error

You're seeing: **Error 400: redirect_uri_mismatch**

The redirect URI `https://www.thepetra.in/api/auth/callback/google` is not registered in Google Cloud Console.

## Quick Fix (2 minutes)

### Step 1: Go to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create one if needed)
3. Navigate to **APIs & Services** → **Credentials**

### Step 2: Edit Your OAuth 2.0 Client

1. Find your OAuth 2.0 Client ID (the one with Client ID: `388769718271-6vcmterf7796qsugik6uvnq14a9g3bi8`)
2. Click on it to edit

### Step 3: Add Authorized Redirect URIs

In the **Authorized redirect URIs** section, add these URIs:

```
https://www.thepetra.in/api/auth/callback/google
https://thepetra.in/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

**Important Notes:**
- ✅ Add BOTH `www.thepetra.in` AND `thepetra.in` (without www)
- ✅ Keep localhost URIs for development
- ✅ The URI must match EXACTLY (including https/http, www/no-www)
- ✅ No trailing slashes

### Step 4: Save

1. Click **Save** at the bottom
2. Wait a few seconds for changes to propagate

### Step 5: Test

1. Go back to your website: `https://www.thepetra.in/auth/signin`
2. Try signing in with Google again
3. It should work now!

## Why Both www and non-www?

Your domain might redirect between `www.thepetra.in` and `thepetra.in`. To be safe, add both:
- `https://www.thepetra.in/api/auth/callback/google`
- `https://thepetra.in/api/auth/callback/google`

## Still Not Working?

### Check Your NEXTAUTH_URL

Make sure your Vercel environment variable `NEXTAUTH_URL` matches your actual domain:

```env
NEXTAUTH_URL=https://www.thepetra.in
```

Or if you use non-www:
```env
NEXTAUTH_URL=https://thepetra.in
```

### Verify the Redirect URI

The error message shows exactly what redirect URI is being used:
```
redirect_uri=https://www.thepetra.in/api/auth/callback/google
```

Make sure this EXACT string is in your Google Cloud Console (case-sensitive, must match exactly).

### Common Mistakes

❌ **Wrong**: `https://thepetra.in/api/auth/callback/google/` (trailing slash)
✅ **Correct**: `https://thepetra.in/api/auth/callback/google`

❌ **Wrong**: `http://www.thepetra.in/api/auth/callback/google` (http instead of https)
✅ **Correct**: `https://www.thepetra.in/api/auth/callback/google`

❌ **Wrong**: `https://thepetra.in/api/auth/callback/Google` (wrong case)
✅ **Correct**: `https://thepetra.in/api/auth/callback/google`

## After Fixing

Once you add the redirect URI and save:
1. Wait 1-2 minutes for Google to update
2. Try signing in again
3. It should redirect properly now!

