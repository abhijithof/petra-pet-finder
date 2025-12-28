-- Check if NextAuth/Supabase Adapter tables exist
-- Run this in Supabase SQL Editor to verify

SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('users', 'accounts', 'sessions', 'verification_tokens')
        THEN 'EXISTS - Required for NextAuth'
        ELSE 'EXISTS - Custom table'
    END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'accounts', 'sessions', 'verification_tokens')
ORDER BY table_name;

-- If any are missing, the Supabase adapter will create them automatically
-- But only if the adapter is properly initialized with correct env vars

