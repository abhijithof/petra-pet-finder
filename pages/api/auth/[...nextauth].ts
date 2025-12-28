import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { supabaseAdmin } from '../../../lib/supabase';

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

// Log warnings instead of errors to prevent breaking the build
if (!supabaseUrl || !supabaseSecret) {
  console.warn('Missing Supabase environment variables for NextAuth - will use JWT strategy');
}

if (!googleClientId || !googleClientSecret) {
  console.warn('Missing Google OAuth environment variables - authentication will fail');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId || '',
      clientSecret: googleClientSecret || '',
    }),
  ],
  adapter: supabaseUrl && supabaseSecret
    ? SupabaseAdapter({
        url: supabaseUrl,
        secret: supabaseSecret,
      })
    : undefined,
  callbacks: {
    async jwt({ token, user, account }) {
      // If user is signing in, add user id to token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, user, token }) {
      // Get user ID from either user (database strategy) or token (JWT strategy)
      const userId = (user as any)?.id || (token as any)?.id;
      
      if (session.user && userId) {
        // Type assertion is safe here because we've extended the types
        session.user.id = userId;
        
        // Only fetch from Supabase if admin client is available
        if (supabaseAdmin) {
          try {
            // Fetch user profile from Supabase
            const { data: profile } = await supabaseAdmin
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();

            if (profile) {
              // Fetch active subscription
              const { data: subscription } = await supabaseAdmin
                .from('subscriptions')
                .select('*, subscription_plans(*)')
                .eq('user_id', userId)
                .eq('status', 'active')
                .single();

              session.user.subscription = subscription || null;
            }
          } catch (error) {
            console.error('Error fetching user profile/subscription:', error);
            // Don't fail the session if profile fetch fails
          }
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user.email && user.id) {
        // Only create profile if Supabase admin is available
        if (supabaseAdmin) {
          try {
            // Create or update user profile (safe for existing profiles table)
            const profileData: any = {
              id: user.id,
              email: user.email,
              updated_at: new Date().toISOString(),
            };

            // Add optional fields if they exist in the schema
            if (user.name || (profile as any)?.name) {
              profileData.full_name = user.name || (profile as any)?.name || null;
            }
            if (user.image || (profile as any)?.picture) {
              profileData.avatar_url = user.image || (profile as any)?.picture || null;
            }

            const { error } = await supabaseAdmin
              .from('profiles')
              .upsert(profileData, {
                onConflict: 'id',
              });

            if (error) {
              console.error('Error creating/updating profile:', error);
              console.warn('Continuing sign-in despite profile update error');
            }
          } catch (error) {
            console.error('Error in signIn callback:', error);
            // Don't block sign-in if profile creation fails
          }
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: supabaseUrl && supabaseSecret ? 'database' : 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);

