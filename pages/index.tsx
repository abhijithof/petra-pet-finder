import { useState, FormEvent, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Check, Dog, Cat, Lock, HeartStraight, ClockCounterClockwise, CheckCircle } from 'phosphor-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 } as any,
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.55, ease: EASE },
};

const stagger = (i: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay: i * 0.08 },
});

export default function Home() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const breedSuggestions: { [key: string]: string[] } = {
    dog: [
      'Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'Beagle', 'Bulldog',
      'Poodle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dachshund',
      'Siberian Husky', 'Great Dane', 'Doberman', 'Shih Tzu', 'Pug',
      'Cocker Spaniel', 'Pomeranian', 'Chihuahua', 'Border Collie', 'Dalmatian',
      'Indie Dog', 'Indian Pariah Dog', 'Rajapalayam', 'Chippiparai', 'Mudhol Hound'
    ],
    cat: [
      'Persian', 'Maine Coon', 'Siamese', 'Bengal', 'Ragdoll',
      'British Shorthair', 'Sphynx', 'Scottish Fold', 'Birman', 'Russian Blue',
      'American Shorthair', 'Himalayan', 'Exotic Shorthair', 'Abyssinian', 'Bombay',
      'Indian Street Cat', 'Indie Cat', 'Mixed Breed'
    ],
    other: [
      'Parrot', 'Lovebird', 'Cockatiel', 'Goldfish', 'Betta Fish',
      'Turtle', 'Hamster', 'Guinea Pig', 'Rabbit', 'Aquarium Fish'
    ]
  };

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: 'Kochi',
    petType: '', breed: '', ageRange: '', budget: '',
    temperament: [] as string[], notes: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [waitlistData, setWaitlistData] = useState({ name: '', email: '', phone: '' });
  const [productNotifyEmail, setProductNotifyEmail] = useState('');
  const [isWaitlistSubmitting, setIsWaitlistSubmitting] = useState(false);
  const [isProductNotifySubmitting, setIsProductNotifySubmitting] = useState(false);
  const [plansPetType, setPlansPetType] = useState<'dog' | 'cat'>('dog');

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === 'petType') {
      setFormData(prev => ({ ...prev, [name]: value, breed: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) setFormErrors((prev: any) => ({ ...prev, [name]: '' }));
  };

  const handleTemperamentChange = (temp: string) => {
    setFormData(prev => ({
      ...prev,
      temperament: prev.temperament.includes(temp)
        ? prev.temperament.filter(t => t !== temp)
        : [...prev.temperament, temp]
    }));
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.petType) errors.petType = 'Please select a pet type';
    if (!formData.ageRange) errors.ageRange = 'Please select an age range';
    if (!formData.budget.trim()) errors.budget = 'Budget is required';
    return errors;
  };

  const handlePetFinderSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setIsSubmitting(true);
    try {
      const payload = {
        fullName: formData.name, email: formData.email, phone: formData.phone,
        petType: formData.petType, breedSizePreference: formData.breed || 'Not specified',
        genderPreference: 'No preference', agePreference: formData.ageRange,
        budgetRange: parseInt(formData.budget.replace(/[^0-9]/g, '')) || 0,
        location: formData.city,
        additionalNotes: `Temperament: ${formData.temperament.join(', ') || 'Not specified'}\n\nAdditional Notes:\n${formData.notes || 'None'}`,
        captcha: 'verified'
      };
      const response = await fetch('/api/send-pet-request', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to submit request');
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', email: '', phone: '', city: 'Kochi', petType: '', breed: '', ageRange: '', budget: '', temperament: [], notes: '' });
    } catch (error) {
      setIsSubmitting(false);
      alert('Failed to submit request. Please try again or contact us at Petragroupofficial@gmail.com');
    }
  };

  const scrollToPetFinder = () => document.getElementById('pet-finder-section')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToSubscriptions = () => document.getElementById('subscription-plans-section')?.scrollIntoView({ behavior: 'smooth' });
  const openWaitlistModal = (plan: string) => { setSelectedPlan(plan); setShowWaitlistModal(true); };
  const openProductModal = (product: string) => { setSelectedProduct(product); setShowProductModal(true); };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFD447]/40 ${
      formErrors[field] ? 'border-red-400 bg-red-50' : formData[field as keyof typeof formData] ? 'border-[#30358B]/30 bg-blue-50/20' : 'border-gray-200 focus:border-[#FFD447]'
    }`;

  return (
    <>
      <Head>
        <title>Pet.Ra - Pet Subscription Plans, Pet Finder & Pet Care Services in Kochi</title>
        <meta name="title" content="Pet.Ra - Pet Subscription Plans, Pet Finder & Pet Care Services in Kochi" />
        <meta name="description" content="Pet.Ra offers monthly pet subscription plans, verified pet finder services, grooming, vet care, and premium pet supplies in Kochi. Find your perfect pet from trusted breeders in 24 hours. Wag & Purr subscription plans available." />
        <meta name="keywords" content="Pet.Ra, petra pets, pet subscription plans, pet finder Kochi, pet care subscription, dog subscription plans, cat subscription plans, pet grooming Kochi, verified pet breeders, pet supplies Kochi, monthly pet care, wag subscription, purr subscription, pet services Kerala" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="Pet.Ra" />
        <link rel="canonical" href="https://thepetra.in" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thepetra.in/" />
        <meta property="og:title" content="Pet.Ra - Pet Subscription Plans & Pet Finder Services in Kochi" />
        <meta property="og:description" content="Monthly pet subscription plans with grooming, vet care & supplies. Find verified pets in 24 hours. Trusted by pet parents in Kochi." />
        <meta property="og:image" content="https://thepetra.in/petra-logo-blue-2.png" />
        <meta property="og:site_name" content="Pet.Ra" />
        <meta property="og:locale" content="en_IN" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://thepetra.in/" />
        <meta property="twitter:title" content="Pet.Ra - Pet Subscription Plans & Pet Finder Services in Kochi" />
        <meta property="twitter:description" content="Monthly pet subscription plans with grooming, vet care & supplies. Find verified pets in 24 hours." />
        <meta property="twitter:image" content="https://thepetra.in/petra-logo-blue-2.png" />
        <meta name="geo.region" content="IN-KL" />
        <meta name="geo.placename" content="Kochi" />
        <meta name="geo.position" content="9.9312;76.2673" />
        <meta name="ICBM" content="9.9312, 76.2673" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "LocalBusiness",
          "name": "Pet.Ra", "image": "https://thepetra.in/petra-logo-blue-2.png",
          "description": "Pet subscription plans, pet finder services, grooming, vet care, and premium pet supplies in Kochi",
          "address": { "@type": "PostalAddress", "addressLocality": "Kochi", "addressRegion": "Kerala", "postalCode": "682013", "addressCountry": "IN" },
          "geo": { "@type": "GeoCoordinates", "latitude": 9.9312, "longitude": 76.2673 },
          "url": "https://thepetra.in", "telephone": "+917736935388", "email": "Petragroupofficial@gmail.com",
          "priceRange": "₹₹", "openingHours": "Mo-Su 09:00-20:00",
          "sameAs": ["https://www.instagram.com/thepetra.in", "https://www.linkedin.com/company/pet-ra/"]
        })}</script>
      </Head>

      <div className="min-h-screen bg-white font-sans">

        {/* ── NAV ── */}
        <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B0C1E]/95 backdrop-blur-md border-b border-white/[0.07] shadow-xl' : ''}`}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
            <Link href="/">
              <img src="/petra-logo-blue-2.png" alt="Pet.Ra" className="h-9 w-auto" />
            </Link>
            <div className="flex items-center gap-2">
              {status === 'authenticated' ? (
                <>
                  <Link href="/dashboard">
                    <span className="px-4 py-2 text-white/80 hover:text-white text-sm font-medium transition-colors">Dashboard</span>
                  </Link>
                  <Link href="/subscriptions">
                    <span className="px-4 py-2 text-white/80 hover:text-white text-sm font-medium transition-colors">Plans</span>
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-2 text-white/60 hover:text-white text-sm font-medium transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/signin">
                  <span className="px-4 py-2 text-white/70 hover:text-white text-sm font-medium transition-colors">Sign In</span>
                </Link>
              )}
              <button
                onClick={scrollToPetFinder}
                className="ml-2 px-5 py-2.5 bg-[#FFD447] text-[#0B0C1E] text-sm font-bold rounded-full hover:bg-[#F5C800] transition-all duration-200 shadow-lg shadow-[#FFD447]/20"
              >
                Find Your Pet
              </button>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex items-center bg-[#0B0C1E] overflow-hidden pt-20">
          <div className="absolute inset-0 dot-grid" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#30358B]/20 via-transparent to-[#FFD447]/5" />

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-24 lg:py-32 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Left */}
              <div className="space-y-8">
                <motion.div {...stagger(0)}>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD447]/10 border border-[#FFD447]/20 rounded-full">
                    <span className="w-1.5 h-1.5 bg-[#FFD447] rounded-full animate-pulse" />
                    <span className="section-label text-[#FFD447]">Verified Pet Finder · Kochi</span>
                  </span>
                </motion.div>

                <motion.h1 {...stagger(1)} className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight text-balance">
                  Find your perfect companion.
                </motion.h1>

                <motion.p {...stagger(2)} className="text-lg text-white/60 leading-relaxed max-w-xl">
                  Every pet comes from screened, ethical breeders with verified health records. We connect you with the right companion for your family — in 24 hours.
                </motion.p>

                {/* Stats */}
                <motion.div {...stagger(3)} className="flex flex-wrap gap-8 pt-2">
                  {[
                    { num: '200+', label: 'Families matched' },
                    { num: '24h', label: 'Match guarantee' },
                    { num: '100%', label: 'Verified breeders' },
                  ].map(({ num, label }) => (
                    <div key={label}>
                      <div className="text-3xl font-extrabold text-[#FFD447]">{num}</div>
                      <div className="text-sm text-white/50 mt-0.5">{label}</div>
                    </div>
                  ))}
                </motion.div>

                {/* CTAs */}
                <motion.div {...stagger(4)} className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={scrollToPetFinder}
                    className="px-8 py-4 bg-[#FFD447] text-[#0B0C1E] font-bold rounded-full text-base hover:bg-[#F5C800] transition-all duration-200 shadow-2xl shadow-[#FFD447]/25 hover:shadow-[#FFD447]/40 hover:-translate-y-0.5"
                  >
                    Start Pet Finder →
                  </button>
                  <button
                    onClick={scrollToSubscriptions}
                    className="px-8 py-4 border border-white/15 text-white/80 font-semibold rounded-full text-base hover:bg-white/5 hover:border-white/25 transition-all duration-200"
                  >
                    View Care Plans
                  </button>
                </motion.div>
              </div>

              {/* Right — hero image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="hidden lg:block relative"
              >
                <div className="absolute -inset-4 bg-[#FFD447]/10 rounded-3xl blur-2xl" />
                <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/10">
                  <img
                    src="/noelle-hkk_YVE2EG0-unsplash.jpg"
                    alt="Happy pet with loving family"
                    className="w-full h-auto object-cover"
                  />
                  {/* Floating card */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#FFD447] rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={18} weight="bold" className="text-[#0B0C1E]" />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">Health-verified match</div>
                        <div className="text-white/50 text-xs">Vaccination records included</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── PET PARENT GUIDE ── */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <motion.div {...fadeUp} className="max-w-2xl mb-16">
              <span className="section-label text-[#30358B] mb-4 block">Pet Parent Guide</span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0B0C1E] tracking-tight leading-none mb-5">
                New to pet parenting?
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                Get personalised breed recommendations and care guides tailored to your lifestyle — before you even adopt.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  tag: '2–3 min', tagColor: 'bg-violet-100 text-violet-700',
                  badge: 'Recommended',
                  icon: (
                    <svg className="w-6 h-6 text-[#0B0C1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'Full Assessment',
                  desc: 'Comprehensive readiness check with readiness score, breed recommendations & personalised checklist.',
                  items: ['Readiness Score', 'Pet Recommendations', 'Preparation Checklist'],
                  href: '/pet-parent-guide?flow=assessment',
                  cta: 'Get My Score',
                  dark: true,
                },
                {
                  tag: '30 sec', tagColor: 'bg-emerald-100 text-emerald-700',
                  badge: null,
                  icon: (
                    <svg className="w-6 h-6 text-[#0B0C1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  title: 'Quick Quiz',
                  desc: '3 questions for instant breed recommendations. Fast, simple, and surprisingly accurate.',
                  items: ['Fast & Simple', 'Breed Matches', 'Care Guide'],
                  href: '/pet-parent-guide?flow=quiz',
                  cta: 'Start Quiz',
                  dark: false,
                },
                {
                  tag: 'Instant', tagColor: 'bg-sky-100 text-sky-700',
                  badge: null,
                  icon: (
                    <svg className="w-6 h-6 text-[#0B0C1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                  title: 'Enter Breed',
                  desc: 'Already have a pet? Get a breed-specific care guide tailored to their age and needs.',
                  items: ['Breed-Specific Tips', 'Age-Appropriate', 'Kerala-Focused'],
                  href: '/pet-parent-guide?flow=direct',
                  cta: 'Enter Details',
                  dark: false,
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  {...stagger(i)}
                  className={`relative group rounded-2xl p-7 flex flex-col border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                    card.dark
                      ? 'bg-[#0B0C1E] border-white/10 hover:border-[#FFD447]/30'
                      : 'bg-white border-black/[0.07] hover:border-[#30358B]/20'
                  }`}
                >
                  {card.badge && (
                    <span className="absolute top-5 right-5 px-3 py-1 bg-[#FFD447] text-[#0B0C1E] text-xs font-bold rounded-full">
                      {card.badge}
                    </span>
                  )}

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${card.dark ? 'bg-[#FFD447]' : 'bg-gray-100'}`}>
                    {card.icon}
                  </div>

                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold mb-4 w-fit ${card.tagColor}`}>
                    {card.tag}
                  </span>

                  <h3 className={`text-xl font-bold mb-2 ${card.dark ? 'text-white' : 'text-[#0B0C1E]'}`}>{card.title}</h3>
                  <p className={`text-sm leading-relaxed mb-5 flex-grow ${card.dark ? 'text-white/60' : 'text-gray-500'}`}>{card.desc}</p>

                  <ul className="space-y-1.5 mb-6">
                    {card.items.map(item => (
                      <li key={item} className={`flex items-center gap-2 text-xs ${card.dark ? 'text-white/50' : 'text-gray-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${card.dark ? 'bg-[#FFD447]' : 'bg-[#30358B]'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={card.href}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                      card.dark
                        ? 'bg-[#FFD447] text-[#0B0C1E] hover:bg-[#F5C800]'
                        : 'bg-[#0B0C1E] text-white hover:bg-[#171739]'
                    }`}
                  >
                    {card.cta}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-24 lg:py-32 bg-[#F7F8FC]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-20">
              <span className="section-label text-[#30358B] mb-4 block">Process</span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0B0C1E] tracking-tight leading-none mb-5">
                How it works
              </h2>
              <p className="text-lg text-gray-500">Three simple steps to find your perfect companion.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  num: '01',
                  title: 'Share Your Requirements',
                  desc: 'Tell us about your lifestyle, living space, preferences, and the kind of pet you\'re looking for.',
                  icon: (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  ),
                },
                {
                  num: '02',
                  title: 'We Search & Verify',
                  desc: 'Our team screens breeders, verifies health records, temperament, and checks every detail for quality.',
                  icon: (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                },
                {
                  num: '03',
                  title: 'Get Matches in 24 Hours',
                  desc: 'Receive curated pet profiles with photos, health records, and breeder information — ready to meet.',
                  icon: (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ),
                },
              ].map((step, i) => (
                <motion.div key={step.num} {...stagger(i)} className="relative">
                  <div className="bg-white rounded-2xl p-8 border border-black/[0.06] hover:border-[#30358B]/20 hover:shadow-xl transition-all duration-300 group h-full">
                    <div className="text-[7rem] font-black text-black/[0.04] leading-none mb-4 select-none">
                      {step.num}
                    </div>
                    <div className="w-14 h-14 bg-[#0B0C1E] rounded-2xl flex items-center justify-center text-[#FFD447] mb-6 group-hover:bg-[#30358B] transition-colors duration-300">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#0B0C1E] mb-3">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PET FINDER FORM ── */}
        <section id="pet-finder-section" className="py-24 lg:py-32 bg-white">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="section-label text-[#30358B] mb-4 block">Pet Finder</span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0B0C1E] tracking-tight leading-none mb-5">
                Tell us what you&apos;re looking for
              </h2>
              <p className="text-lg text-gray-500">Fill out the form and receive curated pet matches within 24 hours.</p>
            </motion.div>

            {!showSuccess ? (
              <motion.div {...fadeUp} className="bg-white rounded-2xl border border-black/[0.07] shadow-xl overflow-hidden">
                <form onSubmit={handlePetFinderSubmit} className="p-8 md:p-10 space-y-8">

                  {/* Contact Info */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                      <div className="w-7 h-7 bg-[#FFD447] rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#0B0C1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0B0C1E]">Contact Information</div>
                        <div className="text-xs text-gray-400">We'll use this to send you pet matches</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={inputClass('name')} placeholder="Your full name" />
                        {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email <span className="text-red-400">*</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass('email')} placeholder="your@email.com" />
                        {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone <span className="text-red-400">*</span></label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass('phone')} placeholder="+91 98765 43210" />
                        {formErrors.phone && <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Location</label>
                        <div className="relative">
                          <input type="text" name="city" value={formData.city} readOnly className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-[#FFD447] text-[#0B0C1E] text-xs font-bold rounded-md">Kochi only</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pet Preferences */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                      <div className="w-7 h-7 bg-[#FFD447] rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#0B0C1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0B0C1E]">Pet Preferences</div>
                        <div className="text-xs text-gray-400">Tell us what kind of pet you're looking for</div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pet Type <span className="text-red-400">*</span></label>
                      <select name="petType" value={formData.petType} onChange={handleInputChange} className={`${inputClass('petType')} cursor-pointer`}>
                        <option value="">Select pet type…</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="other">Other Pets</option>
                      </select>
                      {formErrors.petType && <p className="mt-1 text-xs text-red-500">{formErrors.petType}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Breed Preference</label>
                        <input
                          type="text" name="breed" value={formData.breed} onChange={handleInputChange}
                          list="breed-suggestions"
                          disabled={!formData.petType}
                          className={`${inputClass('breed')} ${!formData.petType ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                          placeholder={
                            formData.petType === 'dog' ? 'e.g., Golden Retriever…' :
                            formData.petType === 'cat' ? 'e.g., Persian…' :
                            formData.petType === 'other' ? 'e.g., Parrot…' : 'Select pet type first'
                          }
                        />
                        <datalist id="breed-suggestions">
                          {formData.petType && breedSuggestions[formData.petType]?.map(b => <option key={b} value={b} />)}
                        </datalist>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Age Range <span className="text-red-400">*</span></label>
                        <select name="ageRange" value={formData.ageRange} onChange={handleInputChange} className={`${inputClass('ageRange')} cursor-pointer`}>
                          <option value="">Select age range…</option>
                          <option value="0-6months">0–6 months (Puppy/Kitten)</option>
                          <option value="6months-2years">6 months – 2 years (Young)</option>
                          <option value="2-7years">2–7 years (Adult)</option>
                          <option value="7+years">7+ years (Senior)</option>
                        </select>
                        {formErrors.ageRange && <p className="mt-1 text-xs text-red-500">{formErrors.ageRange}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Budget (₹) <span className="text-red-400">*</span></label>
                      <input type="text" name="budget" value={formData.budget} onChange={handleInputChange} className={inputClass('budget')} placeholder="e.g., 10,000 – 50,000 or 25,000" />
                      {formErrors.budget && <p className="mt-1 text-xs text-red-500">{formErrors.budget}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-3">Temperament Preferences</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                        {['child-friendly', 'active', 'calm', 'playful', 'guard dog', 'lap pet'].map(temp => (
                          <label key={temp} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                            formData.temperament.includes(temp) ? 'border-[#FFD447] bg-[#FFD447]/8 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <input type="checkbox" checked={formData.temperament.includes(temp)} onChange={() => handleTemperamentChange(temp)} className="w-4 h-4 accent-[#FFD447]" />
                            <span className="text-sm text-gray-700 capitalize">{temp}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Additional Notes</label>
                      <textarea
                        name="notes" value={formData.notes} onChange={handleInputChange} rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD447]/40 focus:border-[#FFD447] transition-all resize-none"
                        placeholder="Tell us about your living situation, any special requirements, or questions…"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="submit" disabled={isSubmitting}
                      className="w-full py-4 bg-[#0B0C1E] text-white font-bold rounded-xl hover:bg-[#171739] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Finding your perfect pet…
                        </>
                      ) : (
                        <>
                          Get Matches in 24 Hours
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-400">Your information is 100% secure · Verified breeders only · No spam, ever</p>
                  </div>

                </form>
              </motion.div>
            ) : (
              <motion.div {...fadeUp} className="bg-white rounded-2xl border border-black/[0.07] shadow-xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-5 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#0B0C1E] mb-3">Request Received</h3>
                <p className="text-gray-500 mb-8">We&apos;ll send curated matches within 24 hours to <strong className="text-[#0B0C1E]">{formData.email}</strong></p>
                <button onClick={() => setShowSuccess(false)} className="px-6 py-3 bg-[#FFD447] text-[#0B0C1E] font-bold rounded-full hover:bg-[#F5C800] transition-all">
                  Submit Another Request
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* ── TRUST ── */}
        <section className="py-24 lg:py-32 bg-[#0B0C1E]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <motion.div {...fadeUp} className="text-center max-w-xl mx-auto mb-16">
              <span className="section-label text-[#FFD447] mb-4 block">Why Pet.Ra</span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">
                Built on trust
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: <CheckCircle size={28} weight="bold" />, title: 'Verified Breeders', desc: 'Every breeder is screened for ethics, health standards, and proper care.' },
                { icon: <HeartStraight size={28} weight="fill" />, title: 'Health Guarantee', desc: 'Complete medical records, vaccination history, and health certificates included.' },
                { icon: <ClockCounterClockwise size={28} weight="bold" />, title: '24-hr Match', desc: 'We find the right pet based on your lifestyle, preferences, and space.' },
                { icon: <Lock size={28} weight="fill" />, title: 'Secure Payments', desc: 'Fully protected transactions with transparent pricing and zero hidden fees.' },
              ].map((item, i) => (
                <motion.div key={item.title} {...stagger(i)} className="group p-7 rounded-2xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] hover:border-[#FFD447]/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-[#FFD447]/10 rounded-xl flex items-center justify-center text-[#FFD447] mb-5 group-hover:bg-[#FFD447]/20 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SUBSCRIPTION PLANS ── */}
        <section id="subscription-plans-section" className="py-24 lg:py-32 bg-[#FFD447]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="section-label text-[#0B0C1E]/50 mb-4 block">Care Plans</span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0B0C1E] tracking-tight leading-none mb-4">
                Monthly care plans
              </h2>
              <p className="text-[#0B0C1E]/60 text-lg mb-8">Comprehensive pet care packages. <strong className="text-[#0B0C1E]">Coming soon.</strong></p>

              <div className="inline-flex items-center bg-[#0B0C1E]/10 rounded-full p-1.5 backdrop-blur-sm">
                {(['dog', 'cat'] as const).map(type => (
                  <button key={type} onClick={() => setPlansPetType(type)} className={`px-8 py-2.5 rounded-full font-bold transition-all duration-200 flex items-center gap-2 text-sm ${plansPetType === type ? 'bg-[#0B0C1E] text-white shadow-lg' : 'text-[#0B0C1E]/60 hover:text-[#0B0C1E]'}`}>
                    {type === 'dog' ? <Dog size={18} weight="fill" /> : <Cat size={18} weight="fill" />}
                    {type === 'dog' ? 'Dogs' : 'Cats'}
                  </button>
                ))}
              </div>
            </motion.div>

            {plansPetType === 'dog' && (
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'WAG ESSENTIALS', price: '₹1,599 / ₹1,699 / ₹1,799', size: 'Small / Medium / Big Dogs', dark: false,
                    desc: 'Affordable starter pack offering all core pet care needs for dogs.',
                    features: ['Pure Paws Essentials Grooming Pack (nail & ear care)', '5% Discount at all partner stores', '30 min walks by trusted agents'],
                  },
                  {
                    name: 'WAG PLUS', price: '₹4,299 / ₹4,399 / ₹4,599', size: 'Small / Medium / Big Dogs', dark: true, popular: true,
                    desc: 'Value-packed with more activity and care. Best for active families.',
                    features: ['8 walks/month · 30 min each', 'Gloss & Glow Grooming Pack', '10% Discount at partner stores', 'Classic Delight hamper (₹600+)', 'Televet consultation (2x)', 'Clinic visit (1x)'],
                  },
                  {
                    name: 'WAG ELITE', price: '₹6,099 / ₹6,299 / ₹6,599', size: 'Small / Medium / Big Dogs', dark: false,
                    desc: 'Premium tier for the most pampered pups. Maximum service and gifts.',
                    features: ['12 walks/month · 30 min each', 'Radiance Royale Grooming Pack', '12% Discount at partner stores', 'Deluxe Delight hamper (₹1000+)', 'Televet consultation (1x)', 'Clinic visit (1x)', 'Pickup Service (1x)'],
                  },
                ].map((plan, i) => (
                  <motion.div key={plan.name} {...stagger(i)} className={`relative rounded-2xl p-8 flex flex-col border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${plan.dark ? 'bg-[#0B0C1E] border-[#0B0C1E]' : 'bg-white border-black/[0.07]'} ${(plan as any).popular ? 'md:scale-[1.04]' : ''}`}>
                    {(plan as any).popular && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FFD447] text-[#0B0C1E] text-xs font-black rounded-full">POPULAR</span>
                    )}
                    <div className={`text-xs font-black tracking-widest uppercase mb-2 ${plan.dark ? 'text-[#FFD447]' : 'text-[#30358B]'}`}>{plan.name}</div>
                    <p className={`text-sm mb-6 leading-relaxed ${plan.dark ? 'text-white/50' : 'text-gray-400'}`}>{plan.desc}</p>
                    <ul className="space-y-2.5 mb-8 flex-grow">
                      {plan.features.map(f => (
                        <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.dark ? 'text-white/80' : 'text-gray-600'}`}>
                          <Check size={16} weight="bold" className={`flex-shrink-0 mt-0.5 ${plan.dark ? 'text-[#FFD447]' : 'text-emerald-500'}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mb-6">
                      <div className={`text-xl font-extrabold ${plan.dark ? 'text-[#FFD447]' : 'text-[#0B0C1E]'}`}>{plan.price}</div>
                      <div className={`text-xs mt-1 ${plan.dark ? 'text-white/40' : 'text-gray-400'}`}>{plan.size}</div>
                    </div>
                    <button onClick={() => openWaitlistModal(plan.name)} className={`w-full py-3 rounded-full font-bold text-sm transition-all duration-200 ${plan.dark ? 'bg-[#FFD447] text-[#0B0C1E] hover:bg-[#F5C800]' : 'bg-[#0B0C1E] text-white hover:bg-[#171739]'}`}>
                      Join Waitlist
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {plansPetType === 'cat' && (
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {[
                  {
                    name: 'PURR BASIC', price: '₹2,699', size: 'For all cats', dark: false,
                    desc: 'Reliable care starter for cats — grooming, medical attention, and treats.',
                    features: ['Beginner-Friendly Pack', 'Gloss & Glow Grooming Pack (bath, nail & ear)', '10% Discount at partner stores', 'Classic Delight hamper (₹600+)', 'Televet consultation (1x)', 'Clinic visit (1x)'],
                  },
                  {
                    name: 'PURR ADVANCED', price: '₹4,699', size: 'For all cats', dark: true, popular: true,
                    desc: 'Premium feline package — maximum grooming, deluxe play, and telehealth access.',
                    features: ['Advanced care for higher-end cats', 'Radiance Royale Grooming Pack (bath, nail & ear)', '12% Discount at partner stores', 'Deluxe Delight hamper (₹1000+)', 'Televet consultation (1x)', 'Clinic visit (1x)', 'Pickup Service (1x)'],
                  },
                ].map((plan, i) => (
                  <motion.div key={plan.name} {...stagger(i)} className={`relative rounded-2xl p-8 flex flex-col border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${plan.dark ? 'bg-[#0B0C1E] border-[#0B0C1E]' : 'bg-white border-black/[0.07]'}`}>
                    {(plan as any).popular && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FFD447] text-[#0B0C1E] text-xs font-black rounded-full">POPULAR</span>
                    )}
                    <div className={`text-xs font-black tracking-widest uppercase mb-2 ${plan.dark ? 'text-[#FFD447]' : 'text-[#30358B]'}`}>{plan.name}</div>
                    <p className={`text-sm mb-6 leading-relaxed ${plan.dark ? 'text-white/50' : 'text-gray-400'}`}>{plan.desc}</p>
                    <ul className="space-y-2.5 mb-8 flex-grow">
                      {plan.features.map(f => (
                        <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.dark ? 'text-white/80' : 'text-gray-600'}`}>
                          <Check size={16} weight="bold" className={`flex-shrink-0 mt-0.5 ${plan.dark ? 'text-[#FFD447]' : 'text-emerald-500'}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mb-6">
                      <div className={`text-2xl font-extrabold ${plan.dark ? 'text-[#FFD447]' : 'text-[#0B0C1E]'}`}>{plan.price}</div>
                      <div className={`text-xs mt-1 ${plan.dark ? 'text-white/40' : 'text-gray-400'}`}>{plan.size}</div>
                    </div>
                    <button onClick={() => openWaitlistModal(plan.name)} className={`w-full py-3 rounded-full font-bold text-sm transition-all duration-200 ${plan.dark ? 'bg-[#FFD447] text-[#0B0C1E] hover:bg-[#F5C800]' : 'bg-[#0B0C1E] text-white hover:bg-[#171739]'}`}>
                      Join Waitlist
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── PET ESSENTIALS ── */}
        <section className="py-24 lg:py-32 bg-[#F7F8FC]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <motion.div {...fadeUp} className="text-center max-w-xl mx-auto mb-16">
              <span className="section-label text-[#30358B] mb-4 block">Essentials</span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0B0C1E] tracking-tight leading-none mb-4">
                Premium pet essentials
              </h2>
              <p className="text-gray-500">Quality products for your pet. <span className="font-semibold text-[#0B0C1E]">Launching soon.</span></p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                { label: 'Food', desc: 'Premium nutrition for every life stage', icon: '🍖' },
                { label: 'Accessories', desc: 'Toys, collars, beds & more', icon: '🎾' },
                { label: 'Health', desc: 'Supplements, vitamins & care', icon: '💊' },
              ].map((item, i) => (
                <motion.div key={item.label} {...stagger(i)} className="relative bg-white rounded-2xl p-8 border border-black/[0.06] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group">
                  <span className="absolute top-5 right-5 px-2.5 py-1 bg-[#FFD447] text-[#0B0C1E] text-xs font-bold rounded-full">COMING SOON</span>
                  <div className="text-4xl mb-5">{item.icon}</div>
                  <h3 className="text-xl font-bold text-[#0B0C1E] mb-2">{item.label}</h3>
                  <p className="text-gray-400 text-sm mb-6">{item.desc}</p>
                  <button onClick={() => openProductModal(item.label)} className="px-5 py-2.5 bg-[#0B0C1E] text-white text-sm font-semibold rounded-full hover:bg-[#171739] transition-all">
                    Notify Me
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <motion.div {...fadeUp} className="text-center max-w-xl mx-auto mb-16">
              <span className="section-label text-[#30358B] mb-4 block">Testimonials</span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0B0C1E] tracking-tight leading-none">
                Loved by pet parents
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Priya Anandh', location: 'Edappaly', text: '"Pet.Ra found us a Golden Retriever in 18 hours. The breeder was verified, and Bruno is healthy and happy!"', initials: 'PA', dark: true },
                { name: 'Rohan Riju', location: 'Palarivattom', text: '"Amazing service! Got 4 Persian kitten profiles with complete health records. Very professional team."', initials: 'RR', dark: false },
                { name: 'Max V', location: 'Koonammavu', text: '"As a first-time pet parent, Pet.Ra\'s guidance was invaluable. Found the perfect Beagle for our family!"', initials: 'MV', dark: true },
              ].map((t, i) => (
                <motion.div key={t.name} {...stagger(i)} className="bg-white border border-black/[0.07] rounded-2xl p-7 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                  <svg className="w-8 h-8 text-[#FFD447] mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-600 leading-relaxed mb-6 text-sm">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${t.dark ? 'bg-[#0B0C1E] text-[#FFD447]' : 'bg-[#FFD447] text-[#0B0C1E]'}`}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-bold text-[#0B0C1E] text-sm">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.location}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-[#0B0C1E] border-t border-white/[0.06] py-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              <div>
                <img src="/petra-logo-blue-2.png" alt="Pet.Ra" className="h-9 w-auto mb-4" />
                <p className="text-sm text-white/40 leading-relaxed">Connecting families with healthy, verified pets from ethical breeders in Kochi.</p>
              </div>
              <div>
                <h5 className="text-xs font-bold tracking-widest uppercase text-white/30 mb-5">Services</h5>
                <ul className="space-y-3">
                  {['Pet Finder', 'Care Plans', 'Pet Essentials', 'AI Preview'].map(item => (
                    <li key={item}><a href="#" className="text-sm text-white/50 hover:text-[#FFD447] transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-bold tracking-widest uppercase text-white/30 mb-5">Company</h5>
                <ul className="space-y-3">
                  {['About Us', 'How It Works', 'Contact'].map(item => (
                    <li key={item}><a href="#" className="text-sm text-white/50 hover:text-[#FFD447] transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-bold tracking-widest uppercase text-white/30 mb-5">Contact</h5>
                <div className="space-y-3">
                  <a href="mailto:Petragroupofficial@gmail.com" className="text-sm text-white/50 hover:text-[#FFD447] transition-colors block">Petragroupofficial@gmail.com</a>
                  <a href="tel:+917736935388" className="text-sm text-white/50 hover:text-[#FFD447] transition-colors block">+91 77369 35388</a>
                </div>
                <div className="flex gap-4 mt-5">
                  <a href="https://instagram.com/thepetra.in" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#FFD447] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/pet-ra/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#FFD447] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-white/25">© 2025 Pet.Ra — We love pets. All rights reserved.</p>
              <p className="text-xs text-white/25">Kochi, Kerala, India</p>
            </div>
          </div>
        </footer>

        {/* ── WAITLIST MODAL ── */}
        {showWaitlistModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowWaitlistModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-[#0B0C1E] px-8 py-7 relative">
                <button onClick={() => setShowWaitlistModal(false)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="w-12 h-12 bg-[#FFD447] rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#0B0C1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white">Join Waitlist</h3>
                <p className="text-white/50 text-sm mt-1">{selectedPlan} Plan · Early access pricing</p>
              </div>
              <form onSubmit={async e => {
                e.preventDefault(); setIsWaitlistSubmitting(true);
                try {
                  const response = await fetch('/api/send-waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: waitlistData.name, email: waitlistData.email, phone: waitlistData.phone, plan: selectedPlan }) });
                  const result = await response.json();
                  if (!response.ok) throw new Error(result.message || 'Failed');
                  alert(`Thanks for joining the ${selectedPlan} waitlist! Check your email for confirmation.`);
                  setWaitlistData({ name: '', email: '', phone: '' }); setShowWaitlistModal(false);
                } catch { alert('Failed to join waitlist. Please try again or contact Petragroupofficial@gmail.com'); }
                finally { setIsWaitlistSubmitting(false); }
              }} className="p-8 space-y-4">
                {[{ id: 'wl-name', label: 'Full Name', req: true, type: 'text', val: waitlistData.name, key: 'name', ph: 'Your name' }, { id: 'wl-email', label: 'Email', req: true, type: 'email', val: waitlistData.email, key: 'email', ph: 'your@email.com' }, { id: 'wl-phone', label: 'Phone', req: false, type: 'tel', val: waitlistData.phone, key: 'phone', ph: '+91 98765 43210 (optional)' }].map(f => (
                  <div key={f.id}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label} {f.req && <span className="text-red-400">*</span>}</label>
                    <input type={f.type} required={f.req} value={f.val} onChange={e => setWaitlistData(prev => ({ ...prev, [f.key]: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD447]/40 focus:border-[#FFD447] transition-all" placeholder={f.ph} />
                  </div>
                ))}
                <button type="submit" disabled={isWaitlistSubmitting} className="w-full py-3.5 bg-[#FFD447] text-[#0B0C1E] font-bold rounded-xl hover:bg-[#F5C800] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {isWaitlistSubmitting ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Joining…</> : 'Join Waitlist'}
                </button>
                <p className="text-center text-xs text-gray-400">No spam · Early access updates only</p>
              </form>
            </motion.div>
          </div>
        )}

        {/* ── PRODUCT MODAL ── */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowProductModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-[#0B0C1E] px-8 py-7 relative">
                <button onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="w-12 h-12 bg-[#FFD447] rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#0B0C1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white">Get Notified</h3>
                <p className="text-white/50 text-sm mt-1">{selectedProduct} Products · Be first to know</p>
              </div>
              <form onSubmit={async e => {
                e.preventDefault(); setIsProductNotifySubmitting(true);
                try {
                  const response = await fetch('/api/send-product-notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: productNotifyEmail, product: selectedProduct }) });
                  const result = await response.json();
                  if (!response.ok) throw new Error(result.message || 'Failed');
                  alert(`Thanks! We'll notify you when ${selectedProduct} products launch.`);
                  setProductNotifyEmail(''); setShowProductModal(false);
                } catch { alert('Failed. Please try again or contact Petragroupofficial@gmail.com'); }
                finally { setIsProductNotifySubmitting(false); }
              }} className="p-8 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                  <input type="email" required value={productNotifyEmail} onChange={e => setProductNotifyEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD447]/40 focus:border-[#FFD447] transition-all" placeholder="your@email.com" />
                </div>
                <button type="submit" disabled={isProductNotifySubmitting} className="w-full py-3.5 bg-[#FFD447] text-[#0B0C1E] font-bold rounded-xl hover:bg-[#F5C800] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {isProductNotifySubmitting ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Submitting…</> : 'Notify Me'}
                </button>
                <p className="text-center text-xs text-gray-400">We respect your inbox — product updates only</p>
              </form>
            </motion.div>
          </div>
        )}

      </div>
    </>
  );
}
