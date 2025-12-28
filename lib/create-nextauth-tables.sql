-- Create NextAuth tables for Supabase adapter
-- These tables are required by @auth/supabase-adapter
-- Run this in Supabase SQL Editor if you get schema errors

-- Accounts table (stores OAuth provider accounts)
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

-- Sessions table (stores user sessions)
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification tokens table (for email verification, etc.)
CREATE TABLE IF NOT EXISTS public.verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_session_token_idx ON public.sessions(session_token);

-- Enable Row Level Security (RLS)
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accounts
DROP POLICY IF EXISTS "Users can view their own accounts" ON public.accounts;
CREATE POLICY "Users can view their own accounts"
  ON public.accounts FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.sessions;
CREATE POLICY "Users can view their own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own sessions" ON public.sessions;
CREATE POLICY "Users can delete their own sessions"
  ON public.sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Note: The Supabase adapter uses service_role key which bypasses RLS
-- These policies are for additional security if needed

