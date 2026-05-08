import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { CreditCard, Calendar, ArrowRight, BookOpen } from 'phosphor-react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE },
};
const stagger = (i: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay: i * 0.07 },
});

interface Subscription {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  subscription_plans: {
    name: string;
    description: string;
    price_monthly: number;
    features: string[];
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
      return;
    }
    if (status === 'authenticated') {
      fetchSubscription();
    }
  }, [status, router]);

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/subscriptions/my-subscription');
      const data = await res.json();
      setSubscription(data.subscription);
    } catch (err) {
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0B0C1E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard — Pet.Ra</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-black/[0.06]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#0B0C1E] flex items-center justify-center">
              <span className="text-[#FFD447] text-xs font-black">P</span>
            </span>
            <span className="font-black text-[#0B0C1E] tracking-tight">Pet.Ra</span>
          </Link>

          <div className="flex items-center gap-4">
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name ?? 'User'}
                className="w-8 h-8 rounded-full ring-2 ring-black/[0.06]"
              />
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm font-medium text-gray-500 hover:text-[#0B0C1E] transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-[#FAFAF8] py-14 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Greeting */}
          <motion.div {...fadeUp} className="mb-12">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#30358B] mb-3 block">
              My Account
            </span>
            <h1 className="text-4xl font-black text-[#0B0C1E] tracking-[-0.02em] leading-none">
              Welcome back,{' '}
              <span className="text-[#30358B]">{session?.user?.name?.split(' ')[0] ?? 'there'}</span>
            </h1>
            <p className="text-sm text-gray-400 mt-2">{session?.user?.email}</p>
          </motion.div>

          {/* Subscription card */}
          {subscription ? (
            <motion.div
              {...stagger(1)}
              className="bg-[#0B0C1E] rounded-2xl p-8 mb-8 text-white"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#FFD447] mb-2 block">
                    Active Plan
                  </span>
                  <h2 className="text-2xl font-black tracking-tight">
                    {subscription.subscription_plans.name}
                  </h2>
                  <p className="text-white/50 text-sm mt-1">
                    {subscription.subscription_plans.description}
                  </p>
                </div>
                <span className="bg-green-400/20 text-green-300 text-xs font-semibold px-3 py-1 rounded-full border border-green-400/30 capitalize">
                  {subscription.status}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/[0.05] rounded-xl p-4">
                  <Calendar size={18} className="text-[#FFD447] mb-2" />
                  <p className="text-xs text-white/40 mb-0.5">Current Period</p>
                  <p className="text-sm font-semibold text-white">
                    {formatDate(subscription.current_period_start)} →{' '}
                    {formatDate(subscription.current_period_end)}
                  </p>
                </div>
                <div className="bg-white/[0.05] rounded-xl p-4">
                  <CreditCard size={18} className="text-[#FFD447] mb-2" />
                  <p className="text-xs text-white/40 mb-0.5">Monthly Rate</p>
                  <p className="text-sm font-semibold text-white">
                    ₹{(subscription.subscription_plans.price_monthly / 100).toLocaleString('en-IN')}
                    /month
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-white/40 mb-3 uppercase tracking-wider font-mono">
                  Included features
                </p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {(subscription.subscription_plans.features as string[]).map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                      <span className="w-1.5 h-1.5 bg-[#FFD447] rounded-full flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              {...stagger(1)}
              className="bg-white border border-black/[0.08] rounded-2xl p-10 mb-8 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#FAFAF8] border border-black/[0.07] flex items-center justify-center mx-auto mb-4">
                <CreditCard size={24} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-black text-[#0B0C1E] mb-2">No active subscription</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                Subscribe to a plan to unlock priority access, verified breeder contacts, and more.
              </p>
              <Link
                href="/subscriptions"
                className="inline-flex items-center gap-2 bg-[#FFD447] text-[#0B0C1E] font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#F5C800] transition-colors"
              >
                Browse Plans <ArrowRight size={14} weight="bold" />
              </Link>
            </motion.div>
          )}

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: <CreditCard size={22} />,
                title: 'Manage Subscription',
                desc: 'View or upgrade your current plan.',
                href: '/subscriptions',
              },
              {
                icon: <BookOpen size={22} />,
                title: 'Pet Parent Guide',
                desc: 'Personalised care guides for your pet.',
                href: '/pet-parent-guide',
              },
            ].map((item, i) => (
              <motion.div key={item.title} {...stagger(i + 2)}>
                <Link
                  href={item.href}
                  className="flex items-start gap-4 bg-white border border-black/[0.07] rounded-2xl p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFD447]/10 flex items-center justify-center text-[#0B0C1E] flex-shrink-0 group-hover:bg-[#FFD447] transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0B0C1E] mb-0.5">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
