# How to Get Supabase Service Role Key

## Steps:

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project (the one you're using for your mobile app)
3. Go to **Settings** (gear icon in left sidebar)
4. Click on **API** in the settings menu
5. Scroll down to find **Project API keys**
6. You'll see two keys:
   - **anon** `public` - This is what you already have (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** `secret` - This is what you need (SUPABASE_SERVICE_ROLE_KEY)

7. Click the **eye icon** or **reveal** button next to `service_role` key
8. Copy the key (it starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
9. Add it to your `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## ⚠️ Security Warning

The **service_role** key has admin privileges and can bypass Row Level Security (RLS). 

- ✅ **Safe to use in**: Server-side code only (API routes)
- ❌ **Never expose**: In client-side code or browser
- ❌ **Never commit**: To git (already in .gitignore)

This key is needed for:
- Creating user profiles during OAuth sign-in
- Admin operations in API routes
- Webhook processing

## Quick Check

After adding the key, your `.env.local` should have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your service role key - different!)
```

