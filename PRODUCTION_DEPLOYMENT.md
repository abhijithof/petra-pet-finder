# Production Deployment Checklist

## ✅ Integration Complete

All subscription features have been integrated into the main website:

### What's Been Integrated:

1. **Main Navigation** (`pages/index.tsx`)
   - ✅ Sign In button (when not authenticated)
   - ✅ Dashboard & Subscriptions links (when authenticated)
   - ✅ Sign Out button
   - ✅ All subscription plan buttons now link to `/subscriptions`

2. **Subscription Plans Section**
   - ✅ All "Join Waitlist" buttons replaced with "Subscribe Now" / "View Plans"
   - ✅ Buttons link to `/subscriptions` page
   - ✅ Shows different text based on authentication status

3. **Pet Parent Guide** (`pages/pet-parent-guide/index.tsx`)
   - ✅ Subscription status check on page load
   - ✅ PDF generation checks subscription status
   - ✅ Free PDF download for subscription members
   - ✅ Subscribe button for non-members

4. **PDF Generation API** (`pages/api/generate-pdf.ts`)
   - ✅ Checks user subscription from database
   - ✅ Allows free PDFs for active subscribers
   - ✅ Requires payment for non-subscribers

## 🚀 Pre-Production Checklist

### 1. Environment Variables

Update your production `.env.local` or hosting platform environment variables:

```env
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# NextAuth (Production)
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_production_secret
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret

# Razorpay (Production - Use LIVE keys!)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_live_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_WEBHOOK_SECRET=your_production_webhook_secret

# Gmail
GMAIL_USER=Pet.Ra'sgroupofficial@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Update OAuth 2.0 Client ID:
   - Add production redirect URI: `https://yourdomain.com/api/auth/callback/google`
   - Keep test URIs for development

### 3. Razorpay Setup

1. Switch to **Live Mode** in Razorpay Dashboard
2. Get **Live API Keys** (not test keys)
3. Set up production webhook:
   - URL: `https://yourdomain.com/api/subscriptions/webhook`
   - Select all subscription and payment events
   - Copy webhook secret

### 4. Supabase

1. Verify all tables exist (run migration if needed)
2. Verify RLS policies are active
3. Test database connections

### 5. Build & Test

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Check for errors
npm run lint
```

## 📋 Production URLs

After deployment, verify these routes work:

- ✅ `/` - Home page with subscription plans
- ✅ `/auth/signin` - Google sign-in
- ✅ `/subscriptions` - Browse and subscribe to plans
- ✅ `/dashboard` - User dashboard with subscription status
- ✅ `/pet-parent-guide` - Pet guide with subscription checks
- ✅ `/petfinder` - Pet finder form
- ✅ `/api/subscriptions/webhook` - Razorpay webhook endpoint

## 🔒 Security Checklist

- [ ] All environment variables are set in production
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is kept secret
- [ ] `RAZORPAY_KEY_SECRET` is kept secret
- [ ] Webhook secret is configured
- [ ] HTTPS is enabled (required for OAuth)
- [ ] CORS is properly configured
- [ ] RLS policies are active in Supabase

## 🧪 Testing Checklist

Before going live, test:

- [ ] Sign in with Google works
- [ ] Subscription plans page loads
- [ ] Can create a subscription
- [ ] Razorpay payment flow works
- [ ] Webhook receives events
- [ ] Dashboard shows subscription status
- [ ] PDF generation works for subscribers
- [ ] PDF generation requires payment for non-subscribers
- [ ] Navigation links work correctly
- [ ] Sign out works

## 🐛 Common Issues

### OAuth Redirect Error
- **Fix**: Add production URL to Google Cloud Console redirect URIs

### Webhook Not Working
- **Fix**: Verify webhook URL in Razorpay matches production URL exactly
- **Fix**: Check webhook secret matches in environment variables

### Subscription Not Showing
- **Fix**: Check Supabase RLS policies
- **Fix**: Verify webhook is updating subscription status

### PDF Generation Failing
- **Fix**: Check subscription status in database
- **Fix**: Verify user is authenticated

## 📊 Monitoring

After deployment, monitor:

1. **Razorpay Dashboard** - Check payment success rates
2. **Supabase Dashboard** - Monitor database queries and errors
3. **Application Logs** - Check for API errors
4. **Webhook Logs** - Verify webhooks are being received

## 🎉 You're Ready!

Once all checks pass, your subscription system is live and ready for users!

