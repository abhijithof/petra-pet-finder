-- Insert default subscription plans
-- Run this after running supabase-schema-safe.sql

-- Only insert if plans don't exist (safe to run multiple times)
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features)
SELECT * FROM (VALUES
  (
    'Wag Basic',
    'Perfect for new pet parents',
    299900, -- ₹2,999/month (in paise)
    2999000, -- ₹29,990/year (save ~17%)
    '["Unlimited pet guides", "Basic grooming tips", "Email support", "Access to community forum"]'::jsonb
  ),
  (
    'Wag Plus',
    'Most popular plan with premium features',
    429900, -- ₹4,299/month (in paise)
    4299000, -- ₹42,990/year (save ~17%)
    '["Everything in Basic", "Premium PDF guides", "Priority support", "Vet consultation (1x/month)", "Discount at partner stores"]'::jsonb
  ),
  (
    'Wag Premium',
    'Complete pet care solution',
    699900, -- ₹6,999/month (in paise)
    6999000, -- ₹69,990/year (save ~17%)
    '["Everything in Plus", "Unlimited vet consultations", "24/7 support", "Free grooming sessions", "Premium product discounts", "Personal pet care advisor"]'::jsonb
  )
) AS v(name, description, price_monthly, price_yearly, features)
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscription_plans WHERE name = v.name
);

