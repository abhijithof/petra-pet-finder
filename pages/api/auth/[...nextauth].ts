import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { supabaseAdmin } from '../../../lib/supabase';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    async session({ session, user }) {
      if (session.user && user?.id) {
        // Fetch user profile from Supabase
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        session.user.id = user.id;
        if (profile) {
          // Fetch active subscription
          const { data: subscription } = await supabaseAdmin
            .from('subscriptions')
            .select('*, subscription_plans(*)')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

          (session.user as any).subscription = subscription || null;
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user.email && user.id) {
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
      }
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
};

export default NextAuth(authOptions);

