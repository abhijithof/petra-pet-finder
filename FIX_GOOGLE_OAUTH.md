# Fix Google OAuth Redirect URI Mismatch

## The Problem
You're getting `Error 400: redirect_uri_mismatch` because the redirect URI in Google Cloud Console doesn't match what your app is sending.

## The Solution

### Step 1: Check Your Current Port
Your app is running on **port 3001** (as shown in terminal: "Port 3000 is in use, trying 3001 instead").

### Step 2: Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID (the one you created)
4. Under **Authorized redirect URIs**, add these URIs:

   **For Development:**
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google
   http://localhost:3002/api/auth/callback/google
   ```

   **For Production:**
   ```
   https://www.thepetra.in/api/auth/callback/google
   https://thepetra.in/api/auth/callback/google
   ```

   **Important:** Add BOTH www and non-www versions!

5. Click **Save**
6. Wait 1-2 minutes for changes to propagate

### Step 3: Update Your .env.local

Make sure `NEXTAUTH_URL` matches your current port:

```env
NEXTAUTH_URL=http://localhost:3001
```

Or if you want it to work on any port, you can use:
```env
NEXTAUTH_URL=http://localhost:3000
```

But make sure you add both ports to Google Cloud Console.

### Step 4: Restart Your Dev Server

After updating Google Cloud Console:
1. Stop your dev server (Ctrl+C)
2. Restart it: `npm run dev`
3. Try signing in again

## Why This Happens

- Next.js automatically tries the next available port if 3000 is busy
- Google OAuth requires **exact match** of redirect URIs
- You need to register all possible ports you might use

## Quick Fix

The fastest solution is to:
1. Add `http://localhost:3001/api/auth/callback/google` to Google Cloud Console
2. Update `.env.local` to have `NEXTAUTH_URL=http://localhost:3001`
3. Restart the dev server

## Alternative: Force Port 3000

If you want to always use port 3000, kill whatever is using it:

```bash
# Find what's using port 3000
lsof -ti:3000

# Kill it
kill -9 $(lsof -ti:3000)

# Then restart your dev server
npm run dev
```

Then make sure Google Cloud Console has `http://localhost:3000/api/auth/callback/google` registered.

