import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Dog, Cat, Star, ArrowRight, Sparkle } from 'phosphor-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 } as any,
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.55, ease: EASE },
};
const stagger = (i: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay: i * 0.07 },
});

interface Plan {
  id: string;
  name: string;
  label: string;
  monthlyPrice: number;
  yearlyPrice: number;
  highlight: boolean;
  badge?: string;
  description: string;
  features: string[];
  notIncluded?: string[];
}

const DOG_PLANS: Plan[] = [
  {
    id: 'dog-basic',
    name: 'Pup Starter',
    label: 'For casual adopters',
    monthlyPrice: 299,
    yearlyPrice: 2499,
    highlight: false,
    description: 'Everything you need to find and bring home your first dog.',
    features: [
      'Browse unlimited dog listings',
      'Contact up to 5 breeders/month',
      'Basic health certificate verification',
      'Email support',
      'Pet care starter guide (PDF)',
    ],
    notIncluded: [
      'Priority listing access',
      'Home visit scheduling',
      'Vaccination tracking',
    ],
  },
  {
    id: 'dog-pro',
    name: 'Pack Leader',
    label: 'Most popular',
    monthlyPrice: 699,
    yearlyPrice: 5999,
    highlight: true,
    badge: 'Most Popular',
    description: 'Full access for serious dog lovers and first-time parents.',
    features: [
      'Everything in Pup Starter',
      'Unlimited breeder contacts',
      'Priority listing access (24h early)',
      'Home visit scheduling assistance',
      'Vaccination & health record tracker',
      'Dedicated WhatsApp support',
      'Monthly vet Q&A session',
    ],
  },
  {
    id: 'dog-elite',
    name: 'Alpha',
    label: 'White-glove service',
    monthlyPrice: 1499,
    yearlyPrice: 12999,
    highlight: false,
    badge: 'Best Value',
    description: 'Concierge-level support from search to settlement.',
    features: [
      'Everything in Pack Leader',
      'Personal pet consultant assigned',
      'Airport/transport coordination',
      'Microchipping assistance',
      'Insurance tie-up guidance',
      'Annual wellness check reminder',
      'Priority breeder introductions',
    ],
  },
];

const CAT_PLANS: Plan[] = [
  {
    id: 'cat-basic',
    name: 'Kitten Starter',
    label: 'For new cat parents',
    monthlyPrice: 249,
    yearlyPrice: 1999,
    highlight: false,
    description: 'The essentials to find your perfect feline companion.',
    features: [
      'Browse unlimited cat listings',
      'Contact up to 5 breeders/month',
      'Basic health certificate verification',
      'Email support',
      'New cat owner guide (PDF)',
    ],
    notIncluded: [
      'Priority listing access',
      'Grooming partner tie-ups',
      'Health record tracking',
    ],
  },
  {
    id: 'cat-pro',
    name: 'Pride Leader',
    label: 'Most popular',
    monthlyPrice: 599,
    yearlyPrice: 4999,
    highlight: true,
    badge: 'Most Popular',
    description: 'Complete toolkit for dedicated cat lovers.',
    features: [
      'Everything in Kitten Starter',
      'Unlimited breeder contacts',
      'Priority listing access (24h early)',
      'Grooming partner tie-ups',
      'Vaccination & health record tracker',
      'Dedicated WhatsApp support',
      'Monthly vet Q&A session',
    ],
  },
];

const GUARANTEES = [
  {
    icon: '🛡️',
    title: 'Verified Breeders',
    desc: 'Every breeder on our platform is manually verified by our team before listing.',
  },
  {
    icon: '💳',
    title: 'Cancel Anytime',
    desc: 'No long-term lock-in. Cancel your subscription whenever you want.',
  },
  {
    icon: '🏥',
    title: 'Health Assured',
    desc: 'All listed pets come with up-to-date vaccination and health certificates.',
  },
  {
    icon: '⚡',
    title: 'Priority Support',
    desc: 'Pro and Alpha members get dedicated WhatsApp + phone support.',
  },
];

const FAQS = [
  {
    q: 'When will the subscription go live?',
    a: 'We are currently in beta. Subscriptions will launch very soon — join the waitlist and you\'ll be the first to know, with an exclusive early-bird discount.',
  },
  {
    q: 'Can I switch plans after subscribing?',
    a: 'Yes. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately; downgrades apply at your next billing cycle.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept all major UPI apps (GPay, PhonePe, Paytm), credit/debit cards, and net banking via Razorpay — fully secure and encrypted.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes! All new accounts get a 7-day free trial of the Pro plan with no credit card required.',
  },
  {
    q: 'Do you verify the health of pets?',
    a: 'All pets listed on Pet.Ra must have up-to-date vaccination records and a vet health certificate. Our team verifies these documents before any listing goes live.',
  },
];

export default function SubscriptionsPage() {
  const { data: session } = useSession();
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Early Access');
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState(session?.user?.email ?? '');
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');

  const plans = petType === 'dog' ? DOG_PLANS : CAT_PLANS;

  const openWaitlist = (planName?: string) => {
    setSelectedPlan(planName ?? 'Early Access');
    setWaitlistDone(false);
    setWaitlistError('');
    setShowWaitlist(true);
  };

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setWaitlistError('');
    try {
      const res = await fetch('/api/send-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: waitlistName, email: waitlistEmail, plan: selectedPlan }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Something went wrong');
      }
      setWaitlistDone(true);
    } catch (err) {
      setWaitlistError(err instanceof Error ? err.message : 'Failed to join. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const price = (plan: Plan) =>
    billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <>
      <Head>
        <title>Subscription Plans — Pet.Ra</title>
        <meta
          name="description"
          content="Choose a Pet.Ra subscription to find your perfect dog or cat with verified breeders."
        />
      </Head>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#0B0C1E] flex items-center justify-center">
              <span className="text-[#FFD447] text-xs font-black">P</span>
            </span>
            <span className="font-black text-[#0B0C1E] tracking-tight">Pet.Ra</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-[#0B0C1E] transition-colors">Home</Link>
            <Link href="/subscriptions" className="text-[#0B0C1E]">Plans</Link>
            <Link href="/browse" className="hover:text-[#0B0C1E] transition-colors">Browse Pets</Link>
          </nav>

          <div className="flex items-center gap-3">
            {session ? (
              <>
                <span className="hidden sm:block text-sm text-gray-500 truncate max-w-[140px]">
                  {session.user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-500 hover:text-[#0B0C1E] transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn('google', { callbackUrl: '/subscriptions' })}
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#0B0C1E] text-white hover:bg-[#171739] transition-colors"
              >
                Sign in
              </button>
            )}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-[#FFD447] text-[#0B0C1E] hover:bg-[#F5C800] transition-colors"
            >
              Find a Pet <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Coming Soon Banner ── */}
      <div className="bg-[#0B0C1E] text-white py-3 px-6 text-center">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#FFD447] mr-3">
          Beta Launch
        </span>
        <span className="text-sm text-white/70">
          Subscriptions open soon — join the waitlist for early access &amp; 20% off.
        </span>
        <button
          onClick={() => openWaitlist()}
          className="ml-4 text-sm font-semibold text-[#FFD447] underline underline-offset-2 hover:no-underline transition-all"
        >
          Join waitlist →
        </button>
      </div>

      <main className="min-h-screen bg-[#FAFAF8]">
        {/* ── Header ── */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12">
          <motion.div {...fadeUp}>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#30358B] mb-4 block">
              Subscription Plans
            </span>
            <h1 className="text-4xl lg:text-6xl font-black text-[#0B0C1E] tracking-[-0.03em] leading-none mb-4">
              Find your pet,<br />
              <span className="text-[#30358B]">effortlessly.</span>
            </h1>
            <p className="text-gray-500 max-w-md leading-relaxed mt-4">
              One plan. Every verified breeder. Full support from search to homecoming.
            </p>
          </motion.div>

          {/* Pet type + billing toggles */}
          <motion.div {...stagger(1)} className="flex flex-wrap items-center gap-4 mt-10">
            {/* Pet toggle */}
            <div className="flex items-center bg-white border border-black/[0.08] rounded-xl p-1 gap-1">
              {(['dog', 'cat'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setPetType(t)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    petType === t
                      ? 'bg-[#0B0C1E] text-white shadow-sm'
                      : 'text-gray-500 hover:text-[#0B0C1E]'
                  }`}
                >
                  {t === 'dog' ? <Dog size={16} weight="fill" /> : <Cat size={16} weight="fill" />}
                  {t === 'dog' ? 'Dogs' : 'Cats'}
                </button>
              ))}
            </div>

            {/* Billing toggle */}
            <div className="flex items-center bg-white border border-black/[0.08] rounded-xl p-1 gap-1">
              {(['monthly', 'yearly'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    billing === b
                      ? 'bg-[#0B0C1E] text-white shadow-sm'
                      : 'text-gray-500 hover:text-[#0B0C1E]'
                  }`}
                >
                  {b === 'monthly' ? 'Monthly' : 'Yearly'}
                  {b === 'yearly' && (
                    <span className="bg-[#FFD447] text-[#0B0C1E] text-[9px] font-black px-1.5 py-0.5 rounded-full tracking-wide uppercase">
                      Save 20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Plans Grid ── */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={petType}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={`grid gap-6 ${plans.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-3xl'}`}
            >
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  {...stagger(i)}
                  className={`relative rounded-2xl p-8 border flex flex-col ${
                    plan.highlight
                      ? 'bg-[#0B0C1E] border-[#0B0C1E] text-white shadow-2xl shadow-[#0B0C1E]/20 scale-[1.02]'
                      : 'bg-white border-black/[0.08] text-[#0B0C1E]'
                  }`}
                >
                  {plan.badge && (
                    <div
                      className={`absolute -top-3 left-6 text-[10px] font-black tracking-[0.15em] uppercase px-3 py-1 rounded-full ${
                        plan.highlight
                          ? 'bg-[#FFD447] text-[#0B0C1E]'
                          : 'bg-[#0B0C1E] text-white'
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-6">
                    <span
                      className={`font-mono text-[9px] tracking-[0.25em] uppercase mb-2 block ${
                        plan.highlight ? 'text-[#FFD447]' : 'text-[#30358B]'
                      }`}
                    >
                      {plan.label}
                    </span>
                    <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                    <p
                      className={`text-sm mt-1 leading-relaxed ${
                        plan.highlight ? 'text-white/60' : 'text-gray-500'
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black tracking-tight">
                        ₹{price(plan).toLocaleString('en-IN')}
                      </span>
                      <span
                        className={`text-sm ${
                          plan.highlight ? 'text-white/50' : 'text-gray-400'
                        }`}
                      >
                        /{billing === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                    {billing === 'yearly' && (
                      <p
                        className={`text-xs mt-1 ${
                          plan.highlight ? 'text-white/40' : 'text-gray-400'
                        }`}
                      >
                        ≈ ₹{Math.round(plan.yearlyPrice / 12).toLocaleString('en-IN')}/month
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-sm">
                        <Check
                          size={16}
                          weight="bold"
                          className={`flex-shrink-0 mt-0.5 ${
                            plan.highlight ? 'text-[#FFD447]' : 'text-[#30358B]'
                          }`}
                        />
                        <span className={plan.highlight ? 'text-white/80' : 'text-gray-700'}>
                          {f}
                        </span>
                      </li>
                    ))}
                    {plan.notIncluded?.map((f, fi) => (
                      <li
                        key={fi}
                        className={`flex items-start gap-2.5 text-sm ${
                          plan.highlight ? 'text-white/25' : 'text-gray-300'
                        }`}
                      >
                        <X size={16} weight="bold" className="flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => openWaitlist(plan.name)}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                      plan.highlight
                        ? 'bg-[#FFD447] text-[#0B0C1E] hover:bg-[#F5C800]'
                        : 'bg-[#0B0C1E] text-white hover:bg-[#171739]'
                    }`}
                  >
                    Join Waitlist — {plan.name}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ── Guarantees ── */}
        <section className="border-t border-black/[0.06] bg-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              {...fadeUp}
              className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-10 mb-12 border-b border-black/[0.07]"
            >
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#30358B] mb-4 block">
                  Our Promise
                </span>
                <h2 className="text-4xl font-black text-[#0B0C1E] tracking-[-0.02em] leading-none">
                  Every plan includes
                </h2>
              </div>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed lg:text-right">
                We stand behind every interaction on Pet.Ra — from first browse to final adoption.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.05] rounded-2xl overflow-hidden">
              {GUARANTEES.map((g, i) => (
                <motion.div
                  key={g.title}
                  {...stagger(i)}
                  className="bg-white p-8"
                >
                  <div className="text-3xl mb-4">{g.icon}</div>
                  <h3 className="font-black text-[#0B0C1E] mb-2">{g.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{g.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="bg-[#FAFAF8] py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp} className="mb-12">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#30358B] mb-4 block">
                Happy Families
              </span>
              <h2 className="text-4xl font-black text-[#0B0C1E] tracking-[-0.02em] leading-none">
                They found their perfect pet
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Priya Menon',
                  city: 'Kochi',
                  pet: 'Golden Retriever',
                  quote:
                    'Found our Buddy within a week. The breeder verification gave us so much confidence — everything was exactly as described.',
                },
                {
                  name: 'Arjun Nair',
                  city: 'Bangalore',
                  pet: 'Persian Cat',
                  quote:
                    'The Pro plan was worth every rupee. The WhatsApp support team was incredibly helpful during the entire process.',
                },
                {
                  name: 'Sneha Thomas',
                  city: 'Chennai',
                  pet: 'Labrador',
                  quote:
                    'We\'d tried other platforms before and always felt uncertain. Pet.Ra\'s health verification made all the difference.',
                },
              ].map((t, i) => (
                <motion.div
                  key={t.name}
                  {...stagger(i)}
                  className="bg-white rounded-2xl p-8 border border-black/[0.06]"
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} size={14} weight="fill" className="text-[#FFD447]" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0B0C1E]/10 flex items-center justify-center text-sm font-black text-[#0B0C1E]">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0B0C1E]">{t.name}</p>
                      <p className="text-xs text-gray-400">
                        {t.city} · {t.pet}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white border-t border-black/[0.06] py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeUp} className="mb-12">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#30358B] mb-4 block">
                FAQ
              </span>
              <h2 className="text-4xl font-black text-[#0B0C1E] tracking-[-0.02em] leading-none">
                Common questions
              </h2>
            </motion.div>

            <div className="divide-y divide-black/[0.06]">
              {FAQS.map((faq, i) => (
                <motion.details
                  key={faq.q}
                  {...stagger(i)}
                  className="group py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between font-semibold text-[#0B0C1E] select-none">
                    {faq.q}
                    <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-45 transition-transform duration-200 text-xl leading-none">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="bg-[#0B0C1E] py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div {...fadeUp}>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#FFD447] mb-6 block">
                Early Access
              </span>
              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-[-0.03em] leading-tight mb-4">
                Be the first to know<br />when we launch.
              </h2>
              <p className="text-white/50 text-sm mb-8">
                Waitlist members get 20% off their first 3 months, no credit card needed.
              </p>
              <button
                onClick={() => openWaitlist()}
                className="inline-flex items-center gap-2 bg-[#FFD447] text-[#0B0C1E] font-bold px-8 py-4 rounded-xl hover:bg-[#F5C800] transition-colors text-sm"
              >
                <Sparkle size={16} weight="fill" />
                Join the Waitlist
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Waitlist Modal ── */}
      <AnimatePresence>
        {showWaitlist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowWaitlist(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => { setShowWaitlist(false); setWaitlistDone(false); setWaitlistError(''); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>

              {!waitlistDone ? (
                <>
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#30358B] mb-3 block">
                    Early Access
                  </span>
                  <h3 className="text-2xl font-black text-[#0B0C1E] tracking-tight mb-1">
                    Join the waitlist
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    Get 20% off your first 3 months. No spam, ever.
                  </p>
                  {selectedPlan !== 'Early Access' && (
                    <p className="text-xs font-semibold text-[#30358B] mb-4">
                      Plan: {selectedPlan}
                    </p>
                  )}
                  {waitlistError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                      {waitlistError}
                    </div>
                  )}
                  <form onSubmit={handleWaitlist} className="space-y-4 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Your name
                      </label>
                      <input
                        type="text"
                        required
                        value={waitlistName}
                        onChange={(e) => setWaitlistName(e.target.value)}
                        placeholder="Arjun Nair"
                        className="w-full border border-black/[0.12] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0B0C1E] transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Email address
                      </label>
                      <input
                        type="email"
                        required
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full border border-black/[0.12] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0B0C1E] transition-all outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#0B0C1E] text-white font-bold py-3.5 rounded-xl text-sm hover:bg-[#171739] transition-colors disabled:opacity-60"
                    >
                      {submitting ? 'Joining...' : 'Secure my spot →'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-2xl font-black text-[#0B0C1E] mb-2">You're on the list!</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    We'll email you at <strong>{waitlistEmail}</strong> the moment we launch — with your 20% discount code.
                  </p>
                  <button
                    onClick={() => { setShowWaitlist(false); setWaitlistDone(false); setWaitlistError(''); }}
                    className="bg-[#FFD447] text-[#0B0C1E] font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#F5C800] transition-colors"
                  >
                    Back to plans
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
