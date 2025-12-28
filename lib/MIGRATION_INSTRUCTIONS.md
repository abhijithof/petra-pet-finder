# Database Migration Instructions

## Step 1: Check Your Current Database Structure

1. Go to your Supabase project → **SQL Editor**
2. Copy and paste the contents of `lib/check-database-structure.sql`
3. Click **Run**
4. Review the results to see:
   - What tables exist
   - What columns exist in the profiles table
   - What's missing

## Step 2: Run the Migration

Based on the diagnostic results, run the migration script:

1. In **SQL Editor**, copy and paste the contents of `lib/generate-migration-based-on-structure.sql`
2. Click **Run**
3. The script will:
   - ✅ Check if profiles table exists, create it if needed
   - ✅ Add missing columns (phone, razorpay_customer_id) if they don't exist
   - ✅ Create subscription tables (subscription_plans, subscriptions, payments)
   - ✅ Set up RLS policies
   - ✅ Create indexes and triggers

## Step 3: Verify the Migration

Run the diagnostic query again to verify everything was created:

```sql
-- Quick verification
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'subscription_plans', 'subscriptions', 'payments')
ORDER BY table_name;
```

You should see all 4 tables with their column counts.

## Step 4: Insert Default Plans

After migration is complete, run:

```sql
-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features)
SELECT * FROM (VALUES
  (
    'Wag Basic',
    'Perfect for new pet parents',
    299900, -- ₹2,999/month (in paise)
    2999000, -- ₹29,990/year
    '["Unlimited pet guides", "Basic grooming tips", "Email support", "Access to community forum"]'::jsonb
  ),
  (
    'Wag Plus',
    'Most popular plan with premium features',
    429900, -- ₹4,299/month (in paise)
    4299000, -- ₹42,990/year
    '["Everything in Basic", "Premium PDF guides", "Priority support", "Vet consultation (1x/month)", "Discount at partner stores"]'::jsonb
  ),
  (
    'Wag Premium',
    'Complete pet care solution',
    699900, -- ₹6,999/month (in paise)
    6999000, -- ₹69,990/year
    '["Everything in Plus", "Unlimited vet consultations", "24/7 support", "Free grooming sessions", "Premium product discounts", "Personal pet care advisor"]'::jsonb
  )
) AS v(name, description, price_monthly, price_yearly, features)
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscription_plans WHERE name = v.name
);
```

## Troubleshooting

### Error: "relation profiles does not exist"
- The migration script will create it automatically
- Make sure you're running the full `generate-migration-based-on-structure.sql` script

### Error: "column already exists"
- This is safe to ignore - the script checks before adding columns
- The DO blocks will skip if columns already exist

### Error: "policy already exists"
- The script drops existing policies first, then recreates them
- This is safe and won't affect your data

## What Gets Created

### Tables:
- `profiles` - User profiles (extends auth.users)
- `subscription_plans` - Available subscription plans
- `subscriptions` - User subscriptions
- `payments` - Payment history

### Columns Added to profiles (if missing):
- `phone` - User phone number
- `razorpay_customer_id` - Razorpay customer ID

### Security:
- Row Level Security (RLS) enabled on all tables
- Policies for user data access

### Performance:
- Indexes on frequently queried columns
- Triggers for automatic timestamp updates

