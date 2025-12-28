-- Verify NextAuth tables exist
-- Run this in Supabase SQL Editor to check if tables were created

SELECT 
    table_name,
    CASE 
        WHEN table_name = 'accounts' THEN '✅ Required for OAuth accounts'
        WHEN table_name = 'sessions' THEN '✅ Required for user sessions'
        WHEN table_name = 'verification_tokens' THEN '✅ Required for email verification'
        ELSE '❌ Not a NextAuth table'
    END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('accounts', 'sessions', 'verification_tokens')
ORDER BY table_name;

-- If all 3 tables show up, you're good!
-- If any are missing, run the full create-nextauth-tables.sql script

