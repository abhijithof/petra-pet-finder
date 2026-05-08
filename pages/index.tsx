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
    `w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFD447]/30 ${
      formErrors[field] ? 'border-red-300 bg-red-50' : formData[field as keyof typeof formData] ? 'border-[#30358B]/20 bg-blue-50/10' : 'border-gray-100 focus:border-[#FFD447]/50'
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
        <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/98 backdrop-blur-sm border-b border-black/[0.06]' : ''}`}>
          <div className="max-w-6xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
            <Link href="/">
              <img src="/petra-logo-blue-2.png" alt="Pet.Ra" className="h-8 w-auto" />
            </Link>
            <div className="flex items-center gap-1">
              {status === 'authenticated' ? (
                <>
                  <Link href="/dashboard">
                    <span className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? 'text-black/60 hover:text-black' : 'text-white/60 hover:text-white'}`}>Dashboard</span>
                  </Link>
                  <Link href="/subscriptions">
                    <span className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? 'text-black/60 hover:text-black' : 'text-white/60 hover:text-white'}`}>Plans</span>
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? 'text-black/40 hover:text-black' : 'text-white/40 hover:text-white'}`}>
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/signin">
                  <span className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? 'text-black/60 hover:text-black' : 'text-white/60 hover:text-white'}`}>Sign In</span>
                </Link>
              )}
              <button
                onClick={scrollToPetFinder}
                className="ml-4 px-5 py-2 bg-[#FFD447] text-[#0B0C1E] text-sm font-bold rounded-full hover:bg-[#F5C800] transition-all"
              >
                Find a Pet →
              </button>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative min-h-screen bg-[#0B0C1E] flex flex-col justify-end overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/noelle-hkk_YVE2EG0-unsplash.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover opacity-[0.12]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C1E] via-[#0B0C1E]/85 to-[#0B0C1E]/60" />
          </div>

          <div className="relative max-w-6xl mx-auto px-6 sm:px-10 pb-20 pt-32 w-full">

            <motion.p {...stagger(0)} className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#FFD447]/60 mb-8">
              Kochi · Verified Pet Finder · Est. 2024
            </motion.p>

            <motion.h1
              {...stagger(1)}
              className="text-[clamp(3.2rem,7.5vw,6.5rem)] font-black text-white leading-[1.0] tracking-[-0.025em] mb-10"
            >
              Find your<br />perfect<br />companion.
            </motion.h1>

            <motion.div {...stagger(2)} className="h-px bg-white/[0.08] mb-10" />

            <motion.div {...stagger(3)} className="flex gap-12 mb-12">
              {[
                { num: '200+', label: 'Families matched' },
                { num: '24h',  label: 'Match guarantee' },
                { num: '100%', label: 'Verified breeders' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div className="font-mono text-xl font-bold text-[#FFD447]">{num}</div>
                  <div className="font-mono text-[10px] text-white/30 mt-1 tracking-[0.1em] uppercase">{label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div {...stagger(4)} className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={scrollToPetFinder}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#FFD447] text-[#0B0C1E] font-bold rounded-full text-sm hover:bg-[#F5C800] transition-all"
              >
                Start Pet Finder
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={scrollToSubscriptions}
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/10 text-white/60 font-medium rounded-full text-sm hover:border-white/25 hover:text-white/80 transition-all"
              >
                View Care Plans
              </button>
            </motion.div>

          </div>
        </section>

        {/* ── PET PARENT GUIDE ── */}
        <section className="py-28 lg:py-36 bg-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10">

            <motion.div {...fadeUp} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-10 mb-0 border-b border-black/[0.07]">
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#30358B] mb-4 block">Pet Parent Guide</span>
                <h2 className="text-4xl lg:text-5xl font-black text-[#0B0C1E] tracking-[-0.02em] leading-none">
                  New to pet parenting?
                </h2>
              </div>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed lg:text-right lg:mb-1">
                Personalised breed recommendations and care guides — before you even adopt.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-px bg-black/[0.06]">
              {[
                {
                  tag: '2–3 min', badge: 'Recommended',
                  icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
                  title: 'Full Assessment',
                  desc: 'Comprehensive readiness check with readiness score, breed recommendations & personalised checklist.',
                  items: ['Readiness Score', 'Pet Recommendations', 'Preparation Checklist'],
                  href: '/pet-parent-guide?flow=assessment', cta: 'Get My Score', dark: true,
                },
                {
                  tag: '30 sec', badge: null,
                  icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>),
                  title: 'Quick Quiz',
                  desc: '3 questions for instant breed recommendations. Fast, simple, and surprisingly accurate.',
                  items: ['Fast & Simple', 'Breed Matches', 'Care Guide'],
                  href: '/pet-parent-guide?flow=quiz', cta: 'Start Quiz', dark: false,
                },
                {
                  tag: 'Instant', badge: null,
                  icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>),
                  title: 'Enter Breed',
                  desc: 'Already have a pet? Get a breed-specific care guide tailored to their age and needs.',
                  items: ['Breed-Specific Tips', 'Age-Appropriate', 'Kerala-Focused'],
                  href: '/pet-parent-guide?flow=direct', cta: 'Enter Details', dark: false,
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  {...stagger(i)}
                  className={`relative flex flex-col p-8 lg:p-10 ${card.dark ? 'bg-[#0B0C1E]' : 'bg-white'}`}
                >
                  {card.badge && (
                    <span className="absolute top-6 right-6 font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 bg-[#FFD447] text-[#0B0C1E]">
                      {card.badge}
                    </span>
                  )}
                  <div className={`mb-5 ${card.dark ? 'text-[#FFD447]' : 'text-[#0B0C1E]'}`}>{card.icon}</div>
                  <div className={`font-mono text-[9px] tracking-[0.25em] uppercase mb-4 ${card.dark ? 'text-white/25' : 'text-black/25'}`}>{card.tag}</div>
                  <h3 className={`text-lg font-black mb-3 ${card.dark ? 'text-white' : 'text-[#0B0C1E]'}`}>{card.title}</h3>
                  <p className={`text-sm leading-relaxed mb-6 flex-grow ${card.dark ? 'text-white/45' : 'text-gray-500'}`}>{card.desc}</p>
                  <ul className="space-y-2 mb-8">
                    {card.items.map(item => (
                      <li key={item} className={`flex items-center gap-2 text-xs ${card.dark ? 'text-white/35' : 'text-gray-400'}`}>
                        <span className={`w-1 h-1 rounded-full flex-shrink-0 ${card.dark ? 'bg-[#FFD447]/60' : 'bg-black/20'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a href={card.href} className={`inline-flex items-center gap-1.5 text-sm font-bold group ${card.dark ? 'text-[#FFD447]' : 'text-[#0B0C1E]'}`}>
                    {card.cta}
                    <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-28 lg:py-36 bg-[#F8F8F8]">
          <div className="max-w-6xl mx-auto px-6 sm:px-10">

            <motion.div {...fadeUp} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-10 mb-16 border-b border-black/[0.07]">
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#30358B] mb-4 block">Process</span>
                <h2 className="text-4xl lg:text-5xl font-black text-[#0B0C1E] tracking-[-0.02em] leading-none">How it works</h2>
              </div>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">Three simple steps to find your perfect companion.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/[0.07]">
              {[
                { num: '01', title: 'Share Your Requirements', desc: "Tell us about your lifestyle, living space, preferences, and the kind of pet you're looking for." },
                { num: '02', title: 'We Search & Verify', desc: 'Our team screens breeders, verifies health records, temperament, and checks every detail for quality.' },
                { num: '03', title: 'Get Matches in 24 Hours', desc: 'Receive curated pet profiles with photos, health records, and breeder information — ready to meet.' },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  {...stagger(i)}
                  className={`py-8 ${i > 0 ? 'md:pl-12' : ''} ${i < 2 ? 'md:pr-12' : ''}`}
                >
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-black/20 mb-8">{step.num}</div>
                  <h3 className="text-xl font-black text-[#0B0C1E] mb-4 leading-tight">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ── PET FINDER FORM ── */}
        <section id="pet-finder-section" className="py-28 lg:py-36 bg-white">
          <div className="max-w-3xl mx-auto px-6 sm:px-10">

            <motion.div {...fadeUp} className="pb-10 mb-12 border-b border-black/[0.07]">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#30358B] mb-4 block">Pet Finder</span>
              <h2 className="text-4xl lg:text-5xl font-black text-[#0B0C1E] tracking-[-0.02em] leading-none mb-4">
                Tell us what you&apos;re looking for
              </h2>
              <p className="text-sm text-gray-500">Fill out the form and receive curated pet matches within 24 hours.</p>
            </motion.div>

            {!showSuccess ? (
              <motion.form {...fadeUp} onSubmit={handlePetFinderSubmit} className="space-y-10">

                {/* Contact Info */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-black/25">01</span>
                    <span className="text-xs font-bold text-[#0B0C1E]">Contact Information</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">Full Name <span className="text-red-400">*</span></label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={inputClass('name')} placeholder="Your full name" />
                      {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">Email <span className="text-red-400">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass('email')} placeholder="your@email.com" />
                      {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">Phone <span className="text-red-400">*</span></label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass('phone')} placeholder="+91 98765 43210" />
                      {formErrors.phone && <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">Location</label>
                      <div className="relative">
                        <input type="text" name="city" value={formData.city} readOnly className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 bg-[#FFD447] text-[#0B0C1E]">Kochi only</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pet Preferences */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-black/25">02</span>
                    <span className="text-xs font-bold text-[#0B0C1E]">Pet Preferences</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">Pet Type <span className="text-red-400">*</span></label>
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
                        <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">Breed Preference</label>
                        <input
                          type="text" name="breed" value={formData.breed} onChange={handleInputChange}
                          list="breed-suggestions" disabled={!formData.petType}
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
                        <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">Age Range <span className="text-red-400">*</span></label>
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
                      <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">Budget (₹) <span className="text-red-400">*</span></label>
                      <input type="text" name="budget" value={formData.budget} onChange={handleInputChange} className={inputClass('budget')} placeholder="e.g., 10,000 – 50,000 or 25,000" />
                      {formErrors.budget && <p className="mt-1 text-xs text-red-500">{formErrors.budget}</p>}
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-3">Temperament Preferences</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['child-friendly', 'active', 'calm', 'playful', 'guard dog', 'lap pet'].map(temp => (
                          <label key={temp} className={`flex items-center gap-2 px-3 py-2.5 border cursor-pointer transition-all duration-150 rounded-lg ${
                            formData.temperament.includes(temp) ? 'border-[#FFD447] bg-[#FFD447]/6' : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}>
                            <input type="checkbox" checked={formData.temperament.includes(temp)} onChange={() => handleTemperamentChange(temp)} className="w-3.5 h-3.5 accent-[#FFD447]" />
                            <span className="text-xs text-gray-700 capitalize">{temp}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">Additional Notes</label>
                      <textarea
                        name="notes" value={formData.notes} onChange={handleInputChange} rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD447]/30 focus:border-[#FFD447]/50 transition-all resize-none"
                        placeholder="Any special requirements or questions…"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2 space-y-3">
                  <button
                    type="submit" disabled={isSubmitting}
                    className="w-full py-4 bg-[#0B0C1E] text-white font-bold rounded-full hover:bg-[#171739] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Finding your perfect pet…
                      </>
                    ) : (
                      <>
                        Get Matches in 24 Hours
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                  <p className="text-center font-mono text-[9px] tracking-[0.2em] uppercase text-gray-300">Secure · Verified breeders only · No spam</p>
                </div>

              </motion.form>
            ) : (
              <motion.div {...fadeUp} className="py-20 text-center border border-black/[0.07]">
                <div className="w-10 h-10 mx-auto mb-6 bg-[#FFD447] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#0B0C1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#30358B] mb-4">Request Received</div>
                <h3 className="text-2xl font-black text-[#0B0C1E] mb-3">We&apos;re on it.</h3>
                <p className="text-sm text-gray-500 mb-8">Curated matches within 24 hours · sent to <strong className="text-[#0B0C1E]">{formData.email}</strong></p>
                <button onClick={() => setShowSuccess(false)} className="px-6 py-3 bg-[#FFD447] text-[#0B0C1E] font-bold rounded-full hover:bg-[#F5C800] transition-all text-sm">
                  Submit Another Request
                </button>
              </motion.div>
            )}

          </div>
        </section>

        {/* ── TRUST ── */}
        <section className="py-28 lg:py-36 bg-[#0B0C1E]">
          <div className="max-w-6xl mx-auto px-6 sm:px-10">

            <motion.div {...fadeUp} className="flex flex-col lg:flex-row lg:items-end gap-6 pb-10 mb-16 border-b border-white/[0.06]">
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#FFD447]/50 mb-4 block">Why Pet.Ra</span>
                <h2 className="text-4xl lg:text-5xl font-black text-white tracking-[-0.02em] leading-none">Built on trust.</h2>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-white/[0.06]">
              {[
                { icon: <CheckCircle size={20} weight="bold" />, title: 'Verified Breeders', desc: 'Every breeder is screened for ethics, health standards, and proper care.' },
                { icon: <HeartStraight size={20} weight="fill" />, title: 'Health Guarantee', desc: 'Complete medical records, vaccination history, and health certificates.' },
                { icon: <ClockCounterClockwise size={20} weight="bold" />, title: '24-hr Match', desc: 'We find the right pet based on your lifestyle, preferences, and space.' },
                { icon: <Lock size={20} weight="fill" />, title: 'Secure Payments', desc: 'Protected transactions with transparent pricing and zero hidden fees.' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  {...stagger(i)}
                  className={`py-8 ${i > 0 ? 'lg:pl-12' : ''} ${i < 3 ? 'lg:pr-12' : ''}`}
                >
                  <div className="text-[#FFD447]/50 mb-5">{item.icon}</div>
                  <h3 className="text-sm font-black text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-white/35 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ── SUBSCRIPTION PLANS ── */}
        <section id="subscription-plans-section" className="py-28 lg:py-36 bg-[#FFD447]">
          <div className="max-w-6xl mx-auto px-6 sm:px-10">

            <motion.div {...fadeUp} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-10 mb-12 border-b border-black/[0.1]">
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#0B0C1E]/40 mb-4 block">Care Plans</span>
                <h2 className="text-4xl lg:text-5xl font-black text-[#0B0C1E] tracking-[-0.02em] leading-none">Monthly care plans</h2>
              </div>
              <div className="flex flex-col gap-4 lg:items-end">
                <p className="text-sm text-[#0B0C1E]/50">Comprehensive pet care packages. <strong className="text-[#0B0C1E]">Coming soon.</strong></p>
                <div className="inline-flex items-center bg-[#0B0C1E]/10 rounded-full p-1">
                  {(['dog', 'cat'] as const).map(type => (
                    <button key={type} onClick={() => setPlansPetType(type)} className={`px-6 py-2 rounded-full font-bold transition-all duration-200 flex items-center gap-2 text-xs ${plansPetType === type ? 'bg-[#0B0C1E] text-white' : 'text-[#0B0C1E]/50 hover:text-[#0B0C1E]'}`}>
                      {type === 'dog' ? <Dog size={13} weight="fill" /> : <Cat size={13} weight="fill" />}
                      {type === 'dog' ? 'Dogs' : 'Cats'}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {plansPetType === 'dog' && (
              <div className="grid md:grid-cols-3 gap-px bg-black/[0.08]">
                {[
                  {
                    name: 'WAG ESSENTIALS', price: '₹1,599 / ₹1,699 / ₹1,799', size: 'Small / Medium / Big Dogs', dark: false, popular: false,
                    desc: 'Affordable starter pack offering all core pet care needs for dogs.',
                    features: ['Pure Paws Essentials Grooming Pack (nail & ear care)', '5% Discount at all partner stores', '30 min walks by trusted agents'],
                  },
                  {
                    name: 'WAG PLUS', price: '₹4,299 / ₹4,399 / ₹4,599', size: 'Small / Medium / Big Dogs', dark: true, popular: true,
                    desc: 'Value-packed with more activity and care. Best for active families.',
                    features: ['8 walks/month · 30 min each', 'Gloss & Glow Grooming Pack', '10% Discount at partner stores', 'Classic Delight hamper (₹600+)', 'Televet consultation (2x)', 'Clinic visit (1x)'],
                  },
                  {
                    name: 'WAG ELITE', price: '₹6,099 / ₹6,299 / ₹6,599', size: 'Small / Medium / Big Dogs', dark: false, popular: false,
                    desc: 'Premium tier for the most pampered pups. Maximum service and gifts.',
                    features: ['12 walks/month · 30 min each', 'Radiance Royale Grooming Pack', '12% Discount at partner stores', 'Deluxe Delight hamper (₹1000+)', 'Televet consultation (1x)', 'Clinic visit (1x)', 'Pickup Service (1x)'],
                  },
                ].map((plan, i) => (
                  <motion.div key={plan.name} {...stagger(i)} className={`relative flex flex-col p-8 lg:p-10 ${plan.dark ? 'bg-[#0B0C1E]' : 'bg-white'}`}>
                    {plan.popular && (
                      <span className="absolute top-6 right-6 font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 bg-[#FFD447] text-[#0B0C1E]">Popular</span>
                    )}
                    <div className={`font-mono text-[9px] tracking-[0.2em] uppercase mb-3 ${plan.dark ? 'text-[#FFD447]' : 'text-[#30358B]'}`}>{plan.name}</div>
                    <p className={`text-xs mb-6 leading-relaxed ${plan.dark ? 'text-white/40' : 'text-gray-400'}`}>{plan.desc}</p>
                    <ul className="space-y-2.5 mb-8 flex-grow">
                      {plan.features.map(f => (
                        <li key={f} className={`flex items-start gap-2 text-xs ${plan.dark ? 'text-white/70' : 'text-gray-600'}`}>
                          <Check size={11} weight="bold" className={`flex-shrink-0 mt-0.5 ${plan.dark ? 'text-[#FFD447]' : 'text-[#30358B]'}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mb-6">
                      <div className={`text-base font-black ${plan.dark ? 'text-[#FFD447]' : 'text-[#0B0C1E]'}`}>{plan.price}</div>
                      <div className={`font-mono text-[9px] tracking-[0.15em] uppercase mt-1 ${plan.dark ? 'text-white/30' : 'text-gray-400'}`}>{plan.size}</div>
                    </div>
                    <button onClick={() => openWaitlistModal(plan.name)} className={`w-full py-3 font-bold text-xs tracking-wide rounded-full transition-all ${plan.dark ? 'bg-[#FFD447] text-[#0B0C1E] hover:bg-[#F5C800]' : 'bg-[#0B0C1E] text-white hover:bg-[#171739]'}`}>
                      Join Waitlist
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {plansPetType === 'cat' && (
              <div className="grid md:grid-cols-2 gap-px bg-black/[0.08] max-w-3xl mx-auto">
                {[
                  {
                    name: 'PURR BASIC', price: '₹2,699', size: 'For all cats', dark: false, popular: false,
                    desc: 'Reliable care starter for cats — grooming, medical attention, and treats.',
                    features: ['Beginner-Friendly Pack', 'Gloss & Glow Grooming Pack (bath, nail & ear)', '10% Discount at partner stores', 'Classic Delight hamper (₹600+)', 'Televet consultation (1x)', 'Clinic visit (1x)'],
                  },
                  {
                    name: 'PURR ADVANCED', price: '₹4,699', size: 'For all cats', dark: true, popular: true,
                    desc: 'Premium feline package — maximum grooming, deluxe play, and telehealth access.',
                    features: ['Advanced care for higher-end cats', 'Radiance Royale Grooming Pack (bath, nail & ear)', '12% Discount at partner stores', 'Deluxe Delight hamper (₹1000+)', 'Televet consultation (1x)', 'Clinic visit (1x)', 'Pickup Service (1x)'],
                  },
                ].map((plan, i) => (
                  <motion.div key={plan.name} {...stagger(i)} className={`relative flex flex-col p-8 lg:p-10 ${plan.dark ? 'bg-[#0B0C1E]' : 'bg-white'}`}>
                    {plan.popular && (
                      <span className="absolute top-6 right-6 font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 bg-[#FFD447] text-[#0B0C1E]">Popular</span>
                    )}
                    <div className={`font-mono text-[9px] tracking-[0.2em] uppercase mb-3 ${plan.dark ? 'text-[#FFD447]' : 'text-[#30358B]'}`}>{plan.name}</div>
                    <p className={`text-xs mb-6 leading-relaxed ${plan.dark ? 'text-white/40' : 'text-gray-400'}`}>{plan.desc}</p>
                    <ul className="space-y-2.5 mb-8 flex-grow">
                      {plan.features.map(f => (
                        <li key={f} className={`flex items-start gap-2 text-xs ${plan.dark ? 'text-white/70' : 'text-gray-600'}`}>
                          <Check size={11} weight="bold" className={`flex-shrink-0 mt-0.5 ${plan.dark ? 'text-[#FFD447]' : 'text-[#30358B]'}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mb-6">
                      <div className={`text-2xl font-black ${plan.dark ? 'text-[#FFD447]' : 'text-[#0B0C1E]'}`}>{plan.price}</div>
                      <div className={`font-mono text-[9px] tracking-[0.15em] uppercase mt-1 ${plan.dark ? 'text-white/30' : 'text-gray-400'}`}>{plan.size}</div>
                    </div>
                    <button onClick={() => openWaitlistModal(plan.name)} className={`w-full py-3 font-bold text-xs tracking-wide rounded-full transition-all ${plan.dark ? 'bg-[#FFD447] text-[#0B0C1E] hover:bg-[#F5C800]' : 'bg-[#0B0C1E] text-white hover:bg-[#171739]'}`}>
                      Join Waitlist
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* ── PET ESSENTIALS ── */}
        <section className="py-28 lg:py-36 bg-[#F8F8F8]">
          <div className="max-w-6xl mx-auto px-6 sm:px-10">

            <motion.div {...fadeUp} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-10 mb-0 border-b border-black/[0.07]">
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#30358B] mb-4 block">Essentials</span>
                <h2 className="text-4xl lg:text-5xl font-black text-[#0B0C1E] tracking-[-0.02em] leading-none">Premium pet essentials</h2>
              </div>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">Quality products for your pet. <strong className="text-[#0B0C1E]">Launching soon.</strong></p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-px bg-black/[0.06]">
              {[
                { label: 'Food', desc: 'Premium nutrition for every life stage', icon: '🍖' },
                { label: 'Accessories', desc: 'Toys, collars, beds & more', icon: '🎾' },
                { label: 'Health', desc: 'Supplements, vitamins & care', icon: '💊' },
              ].map((item, i) => (
                <motion.div key={item.label} {...stagger(i)} className="relative bg-white p-8 lg:p-10">
                  <span className="absolute top-6 right-6 font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 bg-[#FFD447] text-[#0B0C1E]">Coming Soon</span>
                  <div className="text-3xl mb-6">{item.icon}</div>
                  <h3 className="text-xl font-black text-[#0B0C1E] mb-2">{item.label}</h3>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">{item.desc}</p>
                  <button onClick={() => openProductModal(item.label)} className="inline-flex items-center gap-1.5 font-bold text-sm text-[#0B0C1E] group">
                    Notify Me
                    <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-28 lg:py-36 bg-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10">

            <motion.div {...fadeUp} className="flex flex-col lg:flex-row lg:items-end gap-6 pb-10 mb-0 border-b border-black/[0.07]">
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#30358B] mb-4 block">Testimonials</span>
                <h2 className="text-4xl lg:text-5xl font-black text-[#0B0C1E] tracking-[-0.02em] leading-none">Loved by pet parents</h2>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-px bg-black/[0.06]">
              {[
                { name: 'Priya Anandh', location: 'Edappaly', text: 'Pet.Ra found us a Golden Retriever in 18 hours. The breeder was verified, and Bruno is healthy and happy!', initials: 'PA', dark: true },
                { name: 'Rohan Riju', location: 'Palarivattom', text: 'Amazing service! Got 4 Persian kitten profiles with complete health records. Very professional team.', initials: 'RR', dark: false },
                { name: 'Max V', location: 'Koonammavu', text: "As a first-time pet parent, Pet.Ra's guidance was invaluable. Found the perfect Beagle for our family!", initials: 'MV', dark: false },
              ].map((t, i) => (
                <motion.div key={t.name} {...stagger(i)} className={`p-8 lg:p-10 ${t.dark ? 'bg-[#0B0C1E]' : 'bg-white'}`}>
                  <div className={`font-mono text-5xl leading-none mb-6 select-none ${t.dark ? 'text-[#FFD447]/20' : 'text-black/[0.06]'}`}>&ldquo;</div>
                  <p className={`text-sm leading-relaxed mb-8 ${t.dark ? 'text-white/60' : 'text-gray-500'}`}>{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center text-xs font-black flex-shrink-0 ${t.dark ? 'bg-[#FFD447] text-[#0B0C1E]' : 'bg-[#0B0C1E] text-white'}`}>
                      {t.initials}
                    </div>
                    <div>
                      <div className={`text-xs font-black ${t.dark ? 'text-white' : 'text-[#0B0C1E]'}`}>{t.name}</div>
                      <div className={`font-mono text-[9px] tracking-[0.15em] uppercase mt-0.5 ${t.dark ? 'text-white/30' : 'text-black/30'}`}>{t.location}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-[#0B0C1E] pt-20 pb-10">
          <div className="max-w-6xl mx-auto px-6 sm:px-10">
            <div className="pb-12 border-b border-white/[0.06] flex flex-col md:flex-row md:items-start md:justify-between gap-10">
              <div className="max-w-xs">
                <img src="/petra-logo-blue-2.png" alt="Pet.Ra" className="h-8 w-auto mb-5" />
                <p className="text-xs text-white/30 leading-relaxed">Connecting families with healthy, verified pets from ethical breeders in Kochi, Kerala.</p>
              </div>
              <div className="grid grid-cols-3 gap-10">
                <div>
                  <h5 className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20 mb-5">Services</h5>
                  <ul className="space-y-3">
                    {['Pet Finder', 'Care Plans', 'Pet Essentials', 'AI Preview'].map(item => (
                      <li key={item}><a href="#" className="text-xs text-white/35 hover:text-white/70 transition-colors">{item}</a></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20 mb-5">Company</h5>
                  <ul className="space-y-3">
                    {['About Us', 'How It Works', 'Contact'].map(item => (
                      <li key={item}><a href="#" className="text-xs text-white/35 hover:text-white/70 transition-colors">{item}</a></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20 mb-5">Contact</h5>
                  <div className="space-y-3">
                    <a href="mailto:Petragroupofficial@gmail.com" className="block text-xs text-white/35 hover:text-white/70 transition-colors">Petragroupofficial@gmail.com</a>
                    <a href="tel:+917736935388" className="block text-xs text-white/35 hover:text-white/70 transition-colors">+91 77369 35388</a>
                  </div>
                  <div className="flex gap-4 mt-5">
                    <a href="https://instagram.com/thepetra.in" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/60 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <a href="https://www.linkedin.com/company/pet-ra/" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/60 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/15">© 2025 Pet.Ra · Kochi, Kerala, India</p>
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/15">We love pets.</p>
            </div>
          </div>
        </footer>

        {/* ── WAITLIST MODAL ── */}
        {showWaitlistModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowWaitlistModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="bg-white max-w-md w-full shadow-2xl overflow-hidden rounded-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-[#0B0C1E] px-8 py-7 relative">
                <button onClick={() => setShowWaitlistModal(false)} className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors p-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#FFD447]/50 mb-3">Waitlist</div>
                <h3 className="text-xl font-black text-white">{selectedPlan} Plan</h3>
                <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-white/30 mt-1">Early access pricing</p>
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
                {[
                  { id: 'wl-name', label: 'Full Name', req: true, type: 'text', val: waitlistData.name, key: 'name', ph: 'Your name' },
                  { id: 'wl-email', label: 'Email', req: true, type: 'email', val: waitlistData.email, key: 'email', ph: 'your@email.com' },
                  { id: 'wl-phone', label: 'Phone', req: false, type: 'tel', val: waitlistData.phone, key: 'phone', ph: '+91 98765 43210 (optional)' },
                ].map(f => (
                  <div key={f.id}>
                    <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">{f.label} {f.req && <span className="text-red-400">*</span>}</label>
                    <input type={f.type} required={f.req} value={f.val} onChange={e => setWaitlistData(prev => ({ ...prev, [f.key]: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD447]/30 focus:border-[#FFD447]/50 transition-all" placeholder={f.ph} />
                  </div>
                ))}
                <button type="submit" disabled={isWaitlistSubmitting} className="w-full py-3.5 bg-[#FFD447] text-[#0B0C1E] font-bold rounded-full hover:bg-[#F5C800] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                  {isWaitlistSubmitting ? (
                    <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Joining…</>
                  ) : 'Join Waitlist'}
                </button>
                <p className="text-center font-mono text-[9px] tracking-[0.15em] uppercase text-gray-300">No spam · Early access updates only</p>
              </form>
            </motion.div>
          </div>
        )}

        {/* ── PRODUCT MODAL ── */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowProductModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="bg-white max-w-md w-full shadow-2xl overflow-hidden rounded-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-[#0B0C1E] px-8 py-7 relative">
                <button onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors p-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#FFD447]/50 mb-3">Get Notified</div>
                <h3 className="text-xl font-black text-white">{selectedProduct} Products</h3>
                <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-white/30 mt-1">Be first to know</p>
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
                  <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">Email Address <span className="text-red-400">*</span></label>
                  <input type="email" required value={productNotifyEmail} onChange={e => setProductNotifyEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD447]/30 focus:border-[#FFD447]/50 transition-all" placeholder="your@email.com" />
                </div>
                <button type="submit" disabled={isProductNotifySubmitting} className="w-full py-3.5 bg-[#FFD447] text-[#0B0C1E] font-bold rounded-full hover:bg-[#F5C800] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                  {isProductNotifySubmitting ? (
                    <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Submitting…</>
                  ) : 'Notify Me'}
                </button>
                <p className="text-center font-mono text-[9px] tracking-[0.15em] uppercase text-gray-300">Product updates only · No spam</p>
              </form>
            </motion.div>
          </div>
        )}

      </div>
    </>
  );
}
