import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock } from 'phosphor-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function AdminSignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { error } = router.query;

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/mamman');
    }
  }, [status, session, router]);

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/mamman', redirect: true });
  };

  return (
    <>
      <Head>
        <title>Admin Sign In — Pet.Ra</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-[#0B0C1E] flex flex-col items-center justify-center px-4">
        <Link
          href="/"
          className="absolute top-6 left-6 font-mono text-[10px] tracking-[0.25em] uppercase text-white/30 hover:text-white/60 transition-colors"
        >
          ← Pet.Ra
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10 justify-center">
            <div className="w-9 h-9 rounded-full bg-[#FFD447] flex items-center justify-center">
              <Lock size={16} weight="bold" className="text-[#0B0C1E]" />
            </div>
            <span className="font-black text-white text-lg tracking-tight">Admin Portal</span>
          </div>

          <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-8">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#FFD447] mb-3 block">
              Restricted Access
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight mb-1">
              Admin Sign In
            </h1>
            <p className="text-sm text-white/40 mb-8">
              Only authorised Pet.Ra admins can access this portal.
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-900/30 border border-red-500/30 rounded-xl text-sm text-red-400">
                Authentication failed. Only admin accounts are allowed.
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white rounded-xl hover:bg-gray-100 transition-colors font-semibold text-sm text-[#0B0C1E] shadow-sm"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <p className="mt-5 text-center text-xs text-white/25">
              Sign-in is logged. Unauthorised access attempts are recorded.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-white/25">
            Not an admin?{' '}
            <Link href="/auth/signin" className="text-white/50 hover:text-white transition-colors underline">
              User sign-in
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
