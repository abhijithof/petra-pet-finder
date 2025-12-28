-- Diagnostic Query: Check Current Database Structure
-- Run this first to see what tables and columns already exist
-- Then we can create a proper migration based on the results

-- 1. Check if profiles table exists and its structure
SELECT 
    'profiles' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Check all tables in public schema
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 3. Check if subscription-related tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('subscription_plans', 'subscriptions', 'payments') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('subscription_plans', 'subscriptions', 'payments');

-- 4. Check existing RLS policies on profiles table (if it exists)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'profiles';

-- 5. Check if update_updated_at_column function exists
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'update_updated_at_column';

-- 6. Summary: What needs to be created/updated
SELECT 
    'Summary' as section,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles')
        THEN 'profiles table EXISTS'
        ELSE 'profiles table MISSING - needs to be created'
    END as profiles_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'phone')
        THEN 'phone column EXISTS'
        ELSE 'phone column MISSING - needs to be added'
    END as phone_column_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'razorpay_customer_id')
        THEN 'razorpay_customer_id column EXISTS'
        ELSE 'razorpay_customer_id column MISSING - needs to be added'
    END as razorpay_column_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscription_plans')
        THEN 'subscription_plans table EXISTS'
        ELSE 'subscription_plans table MISSING - needs to be created'
    END as subscription_plans_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscriptions')
        THEN 'subscriptions table EXISTS'
        ELSE 'subscriptions table MISSING - needs to be created'
    END as subscriptions_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payments')
        THEN 'payments table EXISTS'
        ELSE 'payments table MISSING - needs to be created'
    END as payments_status;

