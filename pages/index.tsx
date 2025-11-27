import { useState, FormEvent } from 'react';
import Head from 'next/head';
import { Check, Shield, Lock, PawPrint, UserCircle, EnvelopeSimple, Phone, MapPin, Dog, Cat, Calendar, CurrencyDollar, NotePencil, MagnifyingGlass, HeartStraight, ClockCounterClockwise, CheckCircle, Bell } from 'phosphor-react';

export default function Home() {
  // Breed suggestions based on pet type
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

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Kochi', // Locked to Kochi
    petType: '',
    breed: '',
    ageRange: '',
    budget: '',
    temperament: [] as string[],
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Modal states
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  
  // Modal form data
  const [waitlistData, setWaitlistData] = useState({ name: '', email: '', phone: '' });
  const [productNotifyEmail, setProductNotifyEmail] = useState('');
  
  // Modal loading states
  const [isWaitlistSubmitting, setIsWaitlistSubmitting] = useState(false);
  const [isProductNotifySubmitting, setIsProductNotifySubmitting] = useState(false);
  
  // Pet type toggle for subscription plans
  const [plansPetType, setPlansPetType] = useState<'dog' | 'cat'>('dog');

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    
    // Clear breed when pet type changes
    if (name === 'petType') {
      setFormData(prev => ({ ...prev, [name]: value, breed: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (formErrors[name]) {
      setFormErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
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
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Map to existing API format
      const payload = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        petType: formData.petType,
        breedSizePreference: formData.breed || 'Not specified',
        genderPreference: 'No preference',
        agePreference: formData.ageRange,
        budgetRange: parseInt(formData.budget.replace(/[^0-9]/g, '')) || 0,
        location: formData.city,
        additionalNotes: `Temperament: ${formData.temperament.join(', ') || 'Not specified'}\n\nAdditional Notes:\n${formData.notes || 'None'}`,
        captcha: 'verified'
      };

      // Send to existing working API endpoint
      const response = await fetch('/api/send-pet-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit request');
      }

      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: 'Kochi', // Keep locked to Kochi
        petType: '',
        breed: '',
        ageRange: '',
        budget: '',
        temperament: [],
        notes: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      alert('Failed to submit request. Please try again or contact us at Petragroupofficial@gmail.com');
    }
  };

  const scrollToPetFinder = () => {
    document.getElementById('pet-finder-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSubscriptions = () => {
    document.getElementById('subscription-plans-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openWaitlistModal = (plan: string) => {
    setSelectedPlan(plan);
    setShowWaitlistModal(true);
  };

  const openProductModal = (product: string) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>Pet.Ra - Pet Subscription Plans, Pet Finder & Pet Care Services in Kochi</title>
        <meta name="title" content="Pet.Ra - Pet Subscription Plans, Pet Finder & Pet Care Services in Kochi" />
        <meta name="description" content="Pet.Ra offers monthly pet subscription plans, verified pet finder services, grooming, vet care, and premium pet supplies in Kochi. Find your perfect pet from trusted breeders in 24 hours. Wag & Purr subscription plans available." />
        <meta name="keywords" content="Pet.Ra, petra pets, pet subscription plans, pet finder Kochi, pet care subscription, dog subscription plans, cat subscription plans, pet grooming Kochi, verified pet breeders, pet supplies Kochi, monthly pet care, wag subscription, purr subscription, pet services Kerala" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="Pet.Ra" />
        <link rel="canonical" href="https://thepetra.in" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thepetra.in/" />
        <meta property="og:title" content="Pet.Ra - Pet Subscription Plans & Pet Finder Services in Kochi" />
        <meta property="og:description" content="Monthly pet subscription plans with grooming, vet care & supplies. Find verified pets in 24 hours. Trusted by pet parents in Kochi." />
        <meta property="og:image" content="https://thepetra.in/petra-logo-blue-2.png" />
        <meta property="og:site_name" content="Pet.Ra" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://thepetra.in/" />
        <meta property="twitter:title" content="Pet.Ra - Pet Subscription Plans & Pet Finder Services in Kochi" />
        <meta property="twitter:description" content="Monthly pet subscription plans with grooming, vet care & supplies. Find verified pets in 24 hours." />
        <meta property="twitter:image" content="https://thepetra.in/petra-logo-blue-2.png" />

        {/* Geo Tags */}
        <meta name="geo.region" content="IN-KL" />
        <meta name="geo.placename" content="Kochi" />
        <meta name="geo.position" content="9.9312;76.2673" />
        <meta name="ICBM" content="9.9312, 76.2673" />

        {/* Structured Data - Local Business */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Pet.Ra",
            "image": "https://thepetra.in/petra-logo-blue-2.png",
            "description": "Pet subscription plans, pet finder services, grooming, vet care, and premium pet supplies in Kochi",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Kochi",
              "addressRegion": "Kerala",
              "postalCode": "682013",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 9.9312,
              "longitude": 76.2673
            },
            "url": "https://thepetra.in",
            "telephone": "+917736935388",
            "email": "Petragroupofficial@gmail.com",
            "priceRange": "₹₹",
            "openingHours": "Mo-Su 09:00-20:00",
            "sameAs": [
              "https://www.instagram.com/thepetra.in",
              "https://www.linkedin.com/company/pet-ra/"
            ]
          })}
        </script>

        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Pet.Ra",
            "alternateName": "Petra Pets",
            "url": "https://thepetra.in",
            "logo": "https://thepetra.in/petra-logo-blue-2.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+917736935388",
              "contactType": "customer service",
              "email": "Petragroupofficial@gmail.com",
              "areaServed": "IN",
              "availableLanguage": ["en", "ml"]
            },
            "sameAs": [
              "https://www.instagram.com/thepetra.in",
              "https://www.linkedin.com/company/pet-ra/"
            ]
          })}
        </script>

        {/* Structured Data - Service */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Pet Care & Pet Finding Services",
            "provider": {
              "@type": "Organization",
              "name": "Pet.Ra"
            },
            "areaServed": {
              "@type": "City",
              "name": "Kochi"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Pet Care Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Pet Finder Service",
                    "description": "Find verified pets from trusted breeders in 24 hours"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Pet Subscription Plans",
                    "description": "Monthly pet care subscription with grooming, vet care, and supplies"
                  }
                }
              ]
            }
          })}
        </script>
      </Head>
      
      <div className="min-h-screen bg-white overflow-hidden">

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <img src="/petra-logo-blue-2.png" alt="Pet.Ra" className="h-10 w-auto" />
            </div>
              <button 
                onClick={scrollToPetFinder}
                className="px-6 py-2.5 bg-[#FFD447] text-[#171739] font-semibold rounded-xl hover:bg-[#F8D24B] transition-all shadow-md"
              >
                Find Your Pet
              </button>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-to-br from-[#171739] via-[#252756] to-[#171739] overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-96 h-96 bg-[#FFD447] rounded-full blur-3xl opacity-10 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFD447] rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left: Content */}
              <div className="text-center lg:text-left space-y-6 lg:space-y-8">
                {/* Trust Badge */}
                <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#FFD447]/20 backdrop-blur-sm rounded-full border border-[#FFD447]/30 shadow-lg">
                  <span className="w-2 h-2 bg-[#FFD447] rounded-full animate-pulse"></span>
                  <span className="text-sm font-semibold text-[#FFD447]">Verified breeders • Health guaranteed</span>
                </div>

                {/* Headline - Increased line height */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.15] tracking-tight">
                  Find your perfect pet — safely, responsibly, in 24 hours.
              </h1>
              
                {/* Subheadline - Better line height */}
                <p className="text-xl text-gray-300 leading-[1.7] max-w-2xl">
                  Every pet comes from screened, ethical breeders with verified health records. We connect you with the right companion for your family.
                </p>

                {/* Trust Line */}
                <p className="text-base text-[#FFD447]/80 italic leading-relaxed">
                  Loved by responsible pet parents. Every pet is breeder-verified.
                </p>

                {/* CTAs - Primary larger */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                  <button 
                    onClick={scrollToPetFinder}
                    className="px-10 py-5 bg-[#FFD447] text-[#171739] text-xl font-bold rounded-xl hover:bg-[#F8D24B] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                  >
                    Start Pet Finder →
                </button>
                  <button 
                    onClick={scrollToSubscriptions}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                  >
                    Join Subscription Waitlist
                  </button>
            </div>

                {/* Trust badges - No emojis */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 mx-auto bg-[#FFD447]/20 rounded-full flex items-center justify-center border border-[#FFD447]/30">
                      <svg className="w-5 h-5 text-[#FFD447]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-300 font-medium leading-tight">Verified<br />Breeders</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 mx-auto bg-[#FFD447]/20 rounded-full flex items-center justify-center border border-[#FFD447]/30">
                      <svg className="w-5 h-5 text-[#FFD447]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-300 font-medium leading-tight">Health<br />Screening</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 mx-auto bg-[#FFD447]/20 rounded-full flex items-center justify-center border border-[#FFD447]/30">
                      <svg className="w-5 h-5 text-[#FFD447]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-300 font-medium leading-tight">Secure<br />Payments</div>
                  </div>
                </div>
              </div>

              {/* Right: Hero Image */}
              <div className="relative hidden lg:flex items-center justify-center">
                <div className="relative w-full max-w-lg">
                  {/* Glow effect behind image */}
                  <div className="absolute inset-0 bg-[#FFD447] rounded-3xl blur-3xl opacity-20"></div>
                  
                  {/* Hero Image */}
                  <div className="relative z-10">
                    <img 
                      src="/noelle-hkk_YVE2EG0-unsplash.jpg" 
                      alt="Happy pets with loving families" 
                      className="w-full h-auto rounded-3xl shadow-2xl object-cover"
                    />
                  </div>
                </div>
              </div>

            </div>
              </div>

        </section>

        {/* PET PARENT GUIDE SECTION */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-[#30358B]/5 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100 rounded-full mb-4">
                <span className="text-amber-600 font-semibold text-sm">✨ NEW FEATURE</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#171739] mb-4">
                New to Pet Parenting?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get personalized pet recommendations and care guides tailored to your lifestyle
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
              
              {/* Card 1: Full Assessment - RECOMMENDED */}
              <div className="bg-gradient-to-br from-[#30358B] to-[#252756] rounded-3xl p-6 shadow-xl border-2 border-[#30358B] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                {/* Recommended Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-[#FFD447] text-[#171739] text-xs font-bold rounded-full">
                    ⭐ RECOMMENDED
                  </span>
                </div>
                
                <div className="flex flex-col h-full">
                  <div className="w-14 h-14 bg-[#FFD447] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-[#30358B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-2">
                      📊 2-3 MIN
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">Full Assessment</h3>
                  <p className="text-gray-200 text-sm mb-4 leading-relaxed flex-grow">
                    Comprehensive readiness check with score, recommendations & checklist
                  </p>
                  
                  <ul className="space-y-1.5 mb-4 text-xs text-gray-200">
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Readiness Score</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Pet Recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Preparation Checklist</span>
                    </li>
                  </ul>
                  
                  <a 
                    href="/pet-parent-guide?flow=assessment"
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#FFD447] text-[#171739] font-bold rounded-xl hover:bg-[#F8D24B] transition-all transform hover:scale-105 text-sm"
                  >
                    <span>Get My Score</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Card 2: Quick Quiz */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:border-[#30358B] hover:shadow-2xl transition-all duration-300 group">
                <div className="flex flex-col h-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#30358B] to-[#FFD447] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-2">
                      ⚡ 30 SEC
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#171739] mb-3">Quick Quiz</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
                    3 questions for instant breed recommendations
                  </p>
                  
                  <ul className="space-y-1.5 mb-4 text-xs text-gray-600">
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Fast & Simple</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Breed Matches</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Care Guide</span>
                    </li>
                  </ul>
                  
                  <a 
                    href="/pet-parent-guide?flow=quiz"
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#30358B] text-white font-semibold rounded-xl hover:bg-[#252756] transition-all transform hover:scale-105 text-sm"
                  >
                    <span>Start Quiz</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Card 3: Direct Entry */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:border-[#30358B] hover:shadow-2xl transition-all duration-300 group">
                <div className="flex flex-col h-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#30358B] to-[#FFD447] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-2">
                      🔍 INSTANT
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#171739] mb-3">Enter Breed</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
                    Already have a pet? Get breed-specific care guide
                  </p>
                  
                  <ul className="space-y-1.5 mb-4 text-xs text-gray-600">
                    <li className="flex items-center">
                      <span className="mr-2 text-blue-500">✓</span>
                      <span>Breed-Specific Tips</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-blue-500">✓</span>
                      <span>Age-Appropriate</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-blue-500">✓</span>
                      <span>Kerala-Focused</span>
                    </li>
                  </ul>
                  
                  <a 
                    href="/pet-parent-guide?flow=direct"
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#30358B] text-white font-semibold rounded-xl hover:bg-[#252756] transition-all transform hover:scale-105 text-sm"
                  >
                    <span>Enter Details</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center space-x-3 px-6 py-3 bg-white rounded-full shadow-md">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700">Vet-Reviewed Content</span>
              </div>
              <div className="flex items-center space-x-3 px-6 py-3 bg-white rounded-full shadow-md">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700">Export as PDF</span>
              </div>
            </div>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#171739] mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Three simple steps to find your perfect companion
              </p>
              </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-[#FFD447] rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                  📝
                </div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#FFD447]/20 text-[#171739] font-bold rounded-full text-sm mb-4">Step 1</span>
                  <h3 className="text-2xl font-bold text-[#171739]">Share Your Requirements</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Tell us about your lifestyle, preferences, and the type of pet you're looking for.
                </p>
            </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-[#171739] rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                  🔍
              </div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#FFD447]/20 text-[#171739] font-bold rounded-full text-sm mb-4">Step 2</span>
                  <h3 className="text-2xl font-bold text-[#171739]">We Search & Verify</h3>
            </div>
                <p className="text-gray-600 leading-relaxed">
                  Our team screens breeders, verifies health records, and checks every detail for quality.
                </p>
          </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-[#FFD447] rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                  ✨
                </div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#FFD447]/20 text-[#171739] font-bold rounded-full text-sm mb-4">Step 3</span>
                  <h3 className="text-2xl font-bold text-[#171739]">Get Matches in 24 Hours</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Receive curated pet profiles with photos, health records, and breeder information.
                </p>
              </div>
              
            </div>
          </div>
        </section>

        {/* PET FINDER FORM */}
        <section id="pet-finder-section" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {!showSuccess ? (
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                
                {/* Form Header */}
                <div className="bg-gradient-to-r from-[#171739] to-[#252756] text-white p-8 md:p-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFD447] rounded-full mb-4">
                    <svg className="w-8 h-8 text-[#171739]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">
                    Find Your Perfect Pet
                  </h2>
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                    Fill out this form and get curated pet matches within 24 hours
                  </p>
                </div>

                <form onSubmit={handlePetFinderSubmit} className="p-8 md:p-10 space-y-10">
                  
                  {/* Section 1: Contact Information */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-3 border-b-2 border-gray-100">
                      <div className="flex items-center justify-center w-8 h-8 bg-[#FFD447] rounded-lg">
                        <svg className="w-5 h-5 text-[#171739]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#171739]">Your Contact Information</h3>
                        <p className="text-sm text-gray-500">We'll use this to send you pet matches</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group">
                        <label htmlFor="name" className="block text-sm font-semibold text-[#171739] mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full h-13 px-4 py-3 rounded-xl border-2 ${
                            formErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#FFD447]'
                          } focus:outline-none focus:ring-4 focus:ring-[#FFD447]/20 transition-all duration-200 ${
                            formData.name ? 'bg-green-50/50 border-green-200' : ''
                          }`}
                          placeholder="Enter your full name"
                        />
                        {formErrors.name && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors.name}
                          </p>
                        )}
                      </div>

                      <div className="group">
                        <label htmlFor="email" className="block text-sm font-semibold text-[#171739] mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full h-13 px-4 py-3 rounded-xl border-2 ${
                            formErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#FFD447]'
                          } focus:outline-none focus:ring-4 focus:ring-[#FFD447]/20 transition-all duration-200 ${
                            formData.email ? 'bg-green-50/50 border-green-200' : ''
                          }`}
                          placeholder="your@email.com"
                        />
                        {formErrors.email && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group">
                        <label htmlFor="phone" className="block text-sm font-semibold text-[#171739] mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full h-13 px-4 py-3 rounded-xl border-2 ${
                            formErrors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#FFD447]'
                          } focus:outline-none focus:ring-4 focus:ring-[#FFD447]/20 transition-all duration-200 ${
                            formData.phone ? 'bg-green-50/50 border-green-200' : ''
                          }`}
                          placeholder="+91 98765 43210"
                        />
                        {formErrors.phone && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors.phone}
                          </p>
                        )}
                      </div>

                      <div className="group">
                        <label htmlFor="city" className="block text-sm font-semibold text-[#171739] mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Location
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            readOnly
                            className="w-full h-13 px-4 py-3 rounded-xl border-2 border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 cursor-not-allowed"
                            placeholder="Kochi"
                          />
                          <div className="absolute right-3 top-3 px-2 py-1 bg-[#FFD447] text-xs font-bold text-[#171739] rounded-md">
                            Kochi Only
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-500 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          Currently serving Kochi area only
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Pet Preferences */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-3 border-b-2 border-gray-100">
                      <div className="flex items-center justify-center w-8 h-8 bg-[#FFD447] rounded-lg">
                        <svg className="w-5 h-5 text-[#171739]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#171739]">Pet Preferences</h3>
                        <p className="text-sm text-gray-500">Tell us what kind of pet you're looking for</p>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="petType" className="block text-sm font-semibold text-[#171739] mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        Pet Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="petType"
                        name="petType"
                        value={formData.petType}
                        onChange={handleInputChange}
                        className={`w-full h-13 px-4 py-3 rounded-xl border-2 ${
                          formErrors.petType ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#FFD447]'
                        } focus:outline-none focus:ring-4 focus:ring-[#FFD447]/20 transition-all duration-200 ${
                          formData.petType ? 'bg-green-50/50 border-green-200' : ''
                        } cursor-pointer`}
                      >
                        <option value="">Select pet type...</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="other">Other Pets</option>
                      </select>
                      {formErrors.petType && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {formErrors.petType}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="breed" className="block text-sm font-semibold text-[#171739] mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          Breed Preference
                        </label>
                        <input
                          type="text"
                          id="breed"
                          name="breed"
                          value={formData.breed}
                          onChange={handleInputChange}
                          list="breed-suggestions"
                          className={`w-full h-13 px-4 py-3 rounded-xl border-2 ${
                            !formData.petType ? 'border-gray-200 bg-gray-100 cursor-not-allowed' : 'border-gray-200 focus:border-[#FFD447]'
                          } focus:outline-none focus:ring-4 focus:ring-[#FFD447]/20 transition-all duration-200 ${
                            formData.breed ? 'bg-green-50/50 border-green-200' : ''
                          }`}
                          placeholder={
                            formData.petType === 'dog' ? 'e.g., Golden Retriever, Beagle...' :
                            formData.petType === 'cat' ? 'e.g., Persian, Siamese...' :
                            formData.petType === 'other' ? 'e.g., Parrot, Hamster...' :
                            'Select pet type first'
                          }
                          disabled={!formData.petType}
                        />
                        <datalist id="breed-suggestions">
                          {formData.petType && breedSuggestions[formData.petType]?.map((breed) => (
                            <option key={breed} value={breed} />
                          ))}
                        </datalist>
                        {!formData.petType ? (
                          <p className="mt-2 text-xs text-gray-500 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Select a pet type first
                          </p>
                        ) : (
                          <p className="mt-2 text-xs text-green-600 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Start typing to see suggestions
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="ageRange" className="block text-sm font-semibold text-[#171739] mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Age Range <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="ageRange"
                          name="ageRange"
                          value={formData.ageRange}
                          onChange={handleInputChange}
                          className={`w-full h-13 px-4 py-3 rounded-xl border-2 ${
                            formErrors.ageRange ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#FFD447]'
                          } focus:outline-none focus:ring-4 focus:ring-[#FFD447]/20 transition-all duration-200 ${
                            formData.ageRange ? 'bg-green-50/50 border-green-200' : ''
                          } cursor-pointer`}
                        >
                          <option value="">Select age range...</option>
                          <option value="0-6months">0-6 months (Puppy/Kitten)</option>
                          <option value="6months-2years">6 months - 2 years (Young)</option>
                          <option value="2-7years">2-7 years (Adult)</option>
                          <option value="7+years">7+ years (Senior)</option>
                        </select>
                        {formErrors.ageRange && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors.ageRange}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="budget" className="block text-sm font-semibold text-[#171739] mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Budget (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className={`w-full h-13 px-4 py-3 rounded-xl border-2 ${
                          formErrors.budget ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#FFD447]'
                        } focus:outline-none focus:ring-4 focus:ring-[#FFD447]/20 transition-all duration-200 ${
                          formData.budget ? 'bg-green-50/50 border-green-200' : ''
                        }`}
                        placeholder="e.g., 10,000 - 50,000 or 25,000"
                      />
                      {formErrors.budget ? (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {formErrors.budget}
                        </p>
                      ) : (
                        <p className="mt-2 text-xs text-gray-500 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          Enter your budget range for the pet
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#171739] mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Temperament Preferences
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['child-friendly', 'active', 'calm', 'playful', 'guard dog', 'lap pet'].map((temp) => (
                          <label 
                            key={temp} 
                            className={`flex items-center space-x-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              formData.temperament.includes(temp) 
                                ? 'border-[#FFD447] bg-[#FFD447]/10' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.temperament.includes(temp)}
                              onChange={() => handleTemperamentChange(temp)}
                              className="w-5 h-5 rounded border-2 border-gray-300 text-[#FFD447] focus:ring-[#FFD447] focus:ring-offset-0"
                            />
                            <span className="text-sm text-gray-700 capitalize">{temp}</span>
                          </label>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-gray-500 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Select all that apply
                      </p>
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-sm font-semibold text-[#171739] mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Additional Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none focus:ring-4 focus:ring-[#FFD447]/20 transition-all duration-200 resize-none ${
                          formData.notes ? 'bg-green-50/50 border-green-200' : ''
                        }`}
                        placeholder="Tell us anything else about your ideal pet, your living situation, or any questions you have..."
                      ></textarea>
                      <p className="mt-2 text-xs text-gray-500 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Optional - but more details help us find better matches!
                      </p>
                    </div>
                  </div>

                  {/* Submit Section */}
                  <div className="pt-6 space-y-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-8 bg-gradient-to-r from-[#FFD447] to-[#F8D24B] text-[#171739] text-lg font-bold rounded-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Finding Your Perfect Pet...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>Get Matches in 24 Hours →</span>
                        </>
                      )}
                    </button>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Your information is 100% secure</span>
                        <span className="hidden sm:inline text-gray-400">•</span>
                        <span className="hidden sm:inline">Only verified breeders</span>
                        <span className="hidden sm:inline text-gray-400">•</span>
                        <span className="hidden sm:inline">No spam, ever</span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-[#171739] mb-4">Request Received!</h3>
                <p className="text-lg text-gray-600 mb-8">
                  We'll send curated matches within 24 hours to <strong>{formData.email}</strong>
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="px-8 py-3 bg-[#FFD447] text-[#171739] font-semibold rounded-xl hover:bg-[#F8D24B] transition-all"
                >
                  Submit Another Request
                </button>
              </div>
            )}

          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#171739] mb-4">
                Why Trust Pet.Ra's?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're committed to ethical breeding and pet welfare
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              <div className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-6 bg-[#FFD447] rounded-2xl flex items-center justify-center">
                  <CheckCircle size={40} weight="bold" className="text-[#171739]" />
                </div>
                <h3 className="text-xl font-bold text-[#171739] mb-3">Verified Breeders</h3>
                <p className="text-gray-600">
                  We screen every breeder for ethics, health standards, and proper care practices.
                </p>
              </div>

              <div className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-6 bg-[#171739] rounded-2xl flex items-center justify-center">
                  <HeartStraight size={40} weight="fill" className="text-[#FFD447]" />
                </div>
                <h3 className="text-xl font-bold text-[#171739] mb-3">Health Guarantee</h3>
                <p className="text-gray-600">
                  All pets come with complete medical records, vaccination history, and health certificates.
                </p>
              </div>

              <div className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-6 bg-[#FFD447] rounded-2xl flex items-center justify-center">
                  <ClockCounterClockwise size={40} weight="bold" className="text-[#171739]" />
                </div>
                <h3 className="text-xl font-bold text-[#171739] mb-3">24-hr Match Guarantee</h3>
                <p className="text-gray-600">
                  We find the right pet based on your lifestyle, preferences, and living situation.
                </p>
              </div>

              <div className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-6 bg-[#171739] rounded-2xl flex items-center justify-center">
                  <Lock size={40} weight="fill" className="text-[#FFD447]" />
                </div>
                <h3 className="text-xl font-bold text-[#171739] mb-3">Secure Payments</h3>
                <p className="text-gray-600">
                  Fully protected transactions with transparent pricing and no hidden fees.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SUBSCRIPTION PLANS */}
        <section id="subscription-plans-section" className="py-20 lg:py-28 bg-gradient-to-b from-[#FFD447] via-[#F8D24B] to-[#FFD447]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-[#171739] mb-4">
                Monthly Care Plans
              </h2>
              <p className="text-xl text-[#171739]/70 max-w-2xl mx-auto mb-8">
                Comprehensive pet care packages. <span className="text-[#171739] font-semibold">Coming soon</span>
              </p>
              
              {/* Toggle for Dogs/Cats */}
              <div className="inline-flex items-center bg-white/60 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
                <button
                  onClick={() => setPlansPetType('dog')}
                  className={`px-8 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
                    plansPetType === 'dog'
                      ? 'bg-[#171739] text-white shadow-lg'
                      : 'text-[#171739] hover:bg-white/50'
                  }`}
                >
                  <Dog size={24} weight="fill" />
                  <span>Dogs</span>
                </button>
                <button
                  onClick={() => setPlansPetType('cat')}
                  className={`px-8 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
                    plansPetType === 'cat'
                      ? 'bg-[#171739] text-white shadow-lg'
                      : 'text-[#171739] hover:bg-white/50'
                  }`}
                >
                  <Cat size={24} weight="fill" />
                  <span>Cats</span>
                </button>
              </div>
            </div>

            {/* Dog Plans */}
            {plansPetType === 'dog' && (
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Wag Essentials */}
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <h3 className="text-3xl font-bold text-[#171739] mb-3">WAG ESSENTIALS</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Affordable starter pack offering all core pet care needs for dogs. Designed to ensure a healthy and happy routine with monthly essentials.
                  </p>
                  <div className="space-y-3 mb-6 text-sm text-[#171739]">
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>Pure Paws Essentials Grooming Pack (nail & ear care included)</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>5% Discount at all partner stores</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>30 Minute walks each by trusted agents</span></p>
                  </div>
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-[#171739]">
                      ₹1,599 / ₹1,699 / ₹1,799
                    </div>
                    <div className="text-sm text-gray-500">(Small/Medium/Big Dogs)</div>
                  </div>
                  <button
                    onClick={() => openWaitlistModal('Wag Essentials')}
                    className="w-full py-3 bg-[#171739] text-white font-bold rounded-xl hover:bg-[#252756] transition-all"
                  >
                    Join Waitlist
                  </button>
                </div>

                {/* Wag Plus - Featured */}
                <div className="bg-[#171739] rounded-3xl p-8 shadow-2xl transform md:scale-105 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-[#FFD447] text-[#171739] text-xs font-bold rounded-full">
                    POPULAR
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">WAG PLUS</h3>
                  <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                    Value-packed solution with more activity and care, fitting a regular, active lifestyle. Great for families seeking best value on grooming, telehealth, and clinic visits.
                  </p>
                  <div className="space-y-3 mb-6 text-sm text-white">
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-[#FFD447] mt-0.5 flex-shrink-0" /> <span>8 walks/month of 30 minute each</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-[#FFD447] mt-0.5 flex-shrink-0" /> <span>Gloss & Glow Grooming Pack</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-[#FFD447] mt-0.5 flex-shrink-0" /> <span>10% Discount at all partner stores</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-[#FFD447] mt-0.5 flex-shrink-0" /> <span>Classic Delight hamper box (₹600+)</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-[#FFD447] mt-0.5 flex-shrink-0" /> <span>Televet consultation (2x)</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-[#FFD447] mt-0.5 flex-shrink-0" /> <span>Clinic visit (1x)</span></p>
                  </div>
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-[#FFD447]">
                      ₹4,299 / ₹4,399 / ₹4,599
                    </div>
                    <div className="text-sm text-gray-400">(Small/Medium/Big Dogs)</div>
                  </div>
                  <button
                    onClick={() => openWaitlistModal('Wag Plus')}
                    className="w-full py-3 bg-[#FFD447] text-[#171739] font-bold rounded-xl hover:bg-[#F8D24B] transition-all"
                  >
                    Join Waitlist
                  </button>
                  <p className="mt-4 text-xs text-gray-400 italic text-center">
                    *Customisable option to change walks and redeem extra service
                  </p>
                </div>

                {/* Wag Elite */}
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <h3 className="text-3xl font-bold text-[#171739] mb-3">WAG ELITE</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Premium pet care tier for the most pampered pups. Enjoy maximum service, convenience pickups, and personalized deluxe gifts monthly.
                  </p>
                  <div className="space-y-3 mb-6 text-sm text-[#171739]">
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>12 walks/month of 30 minute each</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>Radiance Royale Grooming Pack</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>12% Discount at all partner stores</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>Deluxe Delight hamper box (₹1000+)</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>Televet consultation (1x)</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>Clinic visit (1x)</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>Pickup Service (1x)</span></p>
                  </div>
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-[#171739]">
                      ₹6,099 / ₹6,299 / ₹6,599
                    </div>
                    <div className="text-sm text-gray-500">(Small/Medium/Big Dogs)</div>
                  </div>
                  <button
                    onClick={() => openWaitlistModal('Wag Elite')}
                    className="w-full py-3 bg-[#171739] text-white font-bold rounded-xl hover:bg-[#252756] transition-all"
                  >
                    Join Waitlist
                  </button>
                  <p className="mt-4 text-xs text-gray-500 italic text-center">
                    *Customisable option to change walks and redeem extra service
                  </p>
                </div>

              </div>
            )}

            {/* Cat Plans */}
            {plansPetType === 'cat' && (
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                
                {/* Purr Basic */}
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <h3 className="text-3xl font-bold text-[#171739] mb-3">PURR BASIC</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Reliable care starter for cats, offering grooming, regular medical attention, and fun custom treats.
                  </p>
                  <div className="space-y-3 mb-6 text-sm text-[#171739]">
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>Beginner-Friendly Pack</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>Gloss & Glow Grooming Pack (bath, nail & ear care)</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>10% Discount at all partner stores</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>Classic Delight hamper box (₹600+)</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>Televet consultation (1x)</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-green-600 mt-0.5 flex-shrink-0" /> <span>Clinic visit (1x)</span></p>
                  </div>
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-[#171739]">₹2,699</div>
                    <div className="text-sm text-gray-500">(for all cats)</div>
                  </div>
                  <button
                    onClick={() => openWaitlistModal('Purr Basic')}
                    className="w-full py-3 bg-[#171739] text-white font-bold rounded-xl hover:bg-[#252756] transition-all"
                  >
                    Join Waitlist
                  </button>
                </div>

                {/* Purr Advanced - Featured */}
                <div className="bg-[#171739] rounded-3xl p-8 shadow-2xl relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-[#FFD447] text-[#171739] text-xs font-bold rounded-full">
                    POPULAR
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">PURR ADVANCED</h3>
                  <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                    Premium feline package for the discerning cat parent—maximum grooming, deluxe play, and robust telehealth access.
                  </p>
                  <div className="space-y-3 mb-6 text-sm text-white">
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-[#FFD447] mt-0.5 flex-shrink-0" /> <span>Advanced care for higher-end cats</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-[#FFD447] mt-0.5 flex-shrink-0" /> <span>Radiance Royale Grooming Pack (bath, nail & ear care)</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-[#FFD447] mt-0.5 flex-shrink-0" /> <span>12% Discount at all partner stores</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-[#FFD447] mt-0.5 flex-shrink-0" /> <span>Deluxe Delight hamper box (₹1000+)</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-[#FFD447] mt-0.5 flex-shrink-0" /> <span>Televet consultation (1x)</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-[#FFD447] mt-0.5 flex-shrink-0" /> <span>Clinic visit (1x)</span></p>
                    <p className="flex items-start gap-2"><Check size={18} weight="bold" className="text-[#FFD447] mt-0.5 flex-shrink-0" /> <span>Pickup Service (1x)</span></p>
                  </div>
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-[#FFD447]">₹4,699</div>
                    <div className="text-sm text-gray-400">(for all cats)</div>
                  </div>
                  <button
                    onClick={() => openWaitlistModal('Purr Advanced')}
                    className="w-full py-3 bg-[#FFD447] text-[#171739] font-bold rounded-xl hover:bg-[#F8D24B] transition-all"
                  >
                    Join Waitlist
                  </button>
                </div>

              </div>
            )}

          </div>
        </section>

        {/* PET ESSENTIALS */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#171739] mb-4">
                Premium Pet Essentials
              </h2>
              <p className="text-xl text-gray-600">
                Quality products for your pet. <span className="text-[#FFD447]">Launching soon</span>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              
              <div className="relative bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <div className="absolute top-6 right-6 px-3 py-1 bg-[#FFD447] text-[#171739] text-xs font-bold rounded-full">
                  COMING SOON
                </div>
                <div className="text-5xl mb-4">🍖</div>
                <h3 className="text-2xl font-bold text-[#171739] mb-2">Food</h3>
                <p className="text-gray-600 mb-6">Premium nutrition for every life stage</p>
                <button
                  onClick={() => openProductModal('Food')}
                  className="px-6 py-2 bg-[#171739] text-white font-semibold rounded-xl hover:bg-[#252756] transition-all"
                >
                  Notify Me
                </button>
              </div>

              <div className="relative bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <div className="absolute top-6 right-6 px-3 py-1 bg-[#FFD447] text-[#171739] text-xs font-bold rounded-full">
                  COMING SOON
                </div>
                <div className="text-5xl mb-4">🎾</div>
                <h3 className="text-2xl font-bold text-[#171739] mb-2">Accessories</h3>
                <p className="text-gray-600 mb-6">Toys, collars, beds & more</p>
                <button
                  onClick={() => openProductModal('Accessories')}
                  className="px-6 py-2 bg-[#171739] text-white font-semibold rounded-xl hover:bg-[#252756] transition-all"
                >
                  Notify Me
                </button>
              </div>
              
              <div className="relative bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <div className="absolute top-6 right-6 px-3 py-1 bg-[#FFD447] text-[#171739] text-xs font-bold rounded-full">
                  COMING SOON
                </div>
                <div className="text-5xl mb-4">💊</div>
                <h3 className="text-2xl font-bold text-[#171739] mb-2">Health</h3>
                <p className="text-gray-600 mb-6">Supplements, vitamins & care</p>
                <button
                  onClick={() => openProductModal('Health')}
                  className="px-6 py-2 bg-[#171739] text-white font-semibold rounded-xl hover:bg-[#252756] transition-all"
                >
                  Notify Me
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 lg:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#171739] mb-4">
                Loved by Pet Parents
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#FFD447] flex items-center justify-center text-xl font-bold text-[#171739]">
                    P
                  </div>
                  <div className="ml-3">
                    <div className="font-bold text-[#171739]">Priya Anandh</div>
                    <div className="text-sm text-gray-500">Edappaly</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "Pet.Ra's found us a Golden Retriever in 18 hours. The breeder was verified, and Bruno is healthy and happy!"
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#171739] flex items-center justify-center text-xl font-bold text-white">
                    R
                  </div>
                  <div className="ml-3">
                    <div className="font-bold text-[#171739]">Rohan Riju</div>
                    <div className="text-sm text-gray-500">Palarivattom</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "Amazing service! Got 4 Persian kitten profiles with complete health records. Very professional."
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#FFD447] flex items-center justify-center text-xl font-bold text-[#171739]">
                    A
                  </div>
                  <div className="ml-3">
                    <div className="font-bold text-[#171739]">Max V</div>
                    <div className="text-sm text-gray-500">Koonammavu</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "As a first-time pet parent, Pet.Ra's guidance was invaluable. Found the perfect Beagle for our family!"
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-16 bg-[#171739] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <img src="/petra-logo-blue-2.png" alt="Pet.Ra" className="h-10 w-auto" />
                </div>
                <p className="text-gray-400 text-sm">
                  Connecting families with healthy, verified pets from ethical breeders.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-4">Services</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-[#FFD447] transition-colors">Pet Finder</a></li>
                  <li><a href="#" className="hover:text-[#FFD447] transition-colors">Care Plans</a></li>
                  <li><a href="#" className="hover:text-[#FFD447] transition-colors">Pet Essentials</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-[#FFD447] transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-[#FFD447] transition-colors">How It Works</a></li>
                  <li><a href="#" className="hover:text-[#FFD447] transition-colors">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Contact</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:Petragroupofficial@gmail.com" className="hover:text-[#FFD447] transition-colors">
                      Petragroupofficial@gmail.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-400 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:+917736935388" className="hover:text-[#FFD447] transition-colors">
                      +91 77369 35388
                    </a>
                  </p>
                </div>
                <div className="flex space-x-4 mt-4">
                  <a href="https://instagram.com/thepetra.in" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FFD447] transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/pet-ra/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FFD447] transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>

            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
              <p>© 2025 Pet.Ra — We love pets. All rights reserved.</p>
            </div>

          </div>
        </footer>

        {/* WAITLIST MODAL */}
        {showWaitlistModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowWaitlistModal(false)}>
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-slideUp" onClick={(e) => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#171739] to-[#252756] p-8 text-center relative">
                <button 
                  onClick={() => setShowWaitlistModal(false)} 
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFD447] rounded-full mb-4">
                  <svg className="w-8 h-8 text-[#171739]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-2">Join the Waitlist</h3>
                <p className="text-lg text-gray-300">{selectedPlan} Plan</p>
                <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-[#FFD447]/20 rounded-full">
                  <svg className="w-4 h-4 text-[#FFD447]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-[#FFD447] font-medium">Get early access & special pricing</span>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsWaitlistSubmitting(true);
                
                try {
                  const response = await fetch('/api/send-waitlist', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      name: waitlistData.name,
                      email: waitlistData.email,
                      phone: waitlistData.phone,
                      plan: selectedPlan,
                    }),
                  });

                  const result = await response.json();

                  if (!response.ok) {
                    throw new Error(result.message || 'Failed to join waitlist');
                  }

                  alert(`🎉 Thanks for joining the waitlist for ${selectedPlan}! Check your email for confirmation.`);
                  setWaitlistData({ name: '', email: '', phone: '' });
                  setShowWaitlistModal(false);
                } catch (error) {
                  console.error('Error joining waitlist:', error);
                  alert('Failed to join waitlist. Please try again or contact us at Petragroupofficial@gmail.com');
                } finally {
                  setIsWaitlistSubmitting(false);
                }
              }} className="p-8 space-y-6">
                
                <div>
                  <label htmlFor="waitlist-name" className="block text-sm font-semibold text-[#171739] mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="waitlist-name"
                    type="text"
                    required
                    value={waitlistData.name}
                    onChange={(e) => setWaitlistData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full h-13 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none focus:ring-4 focus:ring-[#FFD447]/20 transition-all duration-200 ${
                      waitlistData.name ? 'bg-green-50/50 border-green-200' : ''
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="waitlist-email" className="block text-sm font-semibold text-[#171739] mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    required
                    value={waitlistData.email}
                    onChange={(e) => setWaitlistData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full h-13 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none focus:ring-4 focus:ring-[#FFD447]/20 transition-all duration-200 ${
                      waitlistData.email ? 'bg-green-50/50 border-green-200' : ''
                    }`}
                    placeholder="your@email.com"
                  />
                  <p className="mt-2 text-xs text-gray-500 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    We'll notify you when the plan launches
                  </p>
                </div>

                <div>
                  <label htmlFor="waitlist-phone" className="block text-sm font-semibold text-[#171739] mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    id="waitlist-phone"
                    type="tel"
                    value={waitlistData.phone}
                    onChange={(e) => setWaitlistData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full h-13 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none focus:ring-4 focus:ring-[#FFD447]/20 transition-all duration-200 ${
                      waitlistData.phone ? 'bg-green-50/50 border-green-200' : ''
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  <p className="mt-2 text-xs text-gray-500 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Optional - helps us reach you faster
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isWaitlistSubmitting}
                  className="w-full py-4 px-8 bg-gradient-to-r from-[#FFD447] to-[#F8D24B] text-[#171739] text-lg font-bold rounded-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isWaitlistSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Joining Waitlist...</span>
                    </>
                  ) : (
                    <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span>Join Waitlist</span>
                    </>
                  )}
                </button>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 text-center flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    No spam, just early access updates
                  </p>
                </div>
              </form>
            </div>

            <style jsx>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-fadeIn {
                animation: fadeIn 0.2s ease-out;
              }
              .animate-slideUp {
                animation: slideUp 0.3s ease-out;
              }
            `}</style>
          </div>
        )}

        {/* PRODUCT MODAL */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowProductModal(false)}>
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-slideUp" onClick={(e) => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#171739] to-[#252756] p-8 text-center relative">
                <button 
                  onClick={() => setShowProductModal(false)} 
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFD447] rounded-full mb-4">
                  <svg className="w-8 h-8 text-[#171739]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-2">Get Notified</h3>
                <p className="text-lg text-gray-300">{selectedProduct} Products</p>
                <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-[#FFD447]/20 rounded-full">
                  <svg className="w-4 h-4 text-[#FFD447]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm text-[#FFD447] font-medium">Be first to know when we launch</span>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsProductNotifySubmitting(true);
                
                try {
                  const response = await fetch('/api/send-product-notify', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: productNotifyEmail,
                      product: selectedProduct,
                    }),
                  });

                  const result = await response.json();

                  if (!response.ok) {
                    throw new Error(result.message || 'Failed to save notification request');
                  }

                  alert(`🎉 Thanks! We'll notify you when ${selectedProduct} products launch. Check your email for confirmation.`);
                  setProductNotifyEmail('');
                  setShowProductModal(false);
                } catch (error) {
                  console.error('Error saving notification request:', error);
                  alert('Failed to save notification request. Please try again or contact us at Petragroupofficial@gmail.com');
                } finally {
                  setIsProductNotifySubmitting(false);
                }
              }} className="p-8 space-y-6">
                
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 mb-6">
                  <p className="text-sm text-gray-700 text-center">
                    🐾 We're preparing premium <strong>{selectedProduct.toLowerCase()}</strong> products just for you! Get notified when we launch.
                  </p>
                </div>

                <div>
                  <label htmlFor="product-email" className="block text-sm font-semibold text-[#171739] mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="product-email"
                    type="email"
                    required
                    value={productNotifyEmail}
                    onChange={(e) => setProductNotifyEmail(e.target.value)}
                    className={`w-full h-13 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none focus:ring-4 focus:ring-[#FFD447]/20 transition-all duration-200 ${
                      productNotifyEmail ? 'bg-green-50/50 border-green-200' : ''
                    }`}
                    placeholder="your@email.com"
                  />
                  <p className="mt-2 text-xs text-gray-500 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    We'll send you a notification when products are ready
                  </p>
              </div>

                <button
                  type="submit"
                  disabled={isProductNotifySubmitting}
                  className="w-full py-4 px-8 bg-gradient-to-r from-[#FFD447] to-[#F8D24B] text-[#171739] text-lg font-bold rounded-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isProductNotifySubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <span>Notify Me</span>
                    </>
                  )}
                </button>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 text-center flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    We respect your inbox — updates only
                  </p>
            </div>
              </form>
          </div>

            <style jsx>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-fadeIn {
                animation: fadeIn 0.2s ease-out;
              }
              .animate-slideUp {
                animation: slideUp 0.3s ease-out;
              }
            `}</style>
          </div>
        )}

      </div>
    </>
  );
}
