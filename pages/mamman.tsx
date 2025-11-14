import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface ContentData {
  hero: {
    headline: string;
    subheadline: string;
    trustLine: string;
    ctaPrimary: string;
    ctaSecondary: string;
    heroImage: string;
  };
  trustBadges: Array<{
    title: string;
    description: string;
  }>;
  testimonials: Array<{
    name: string;
    location: string;
    quote: string;
  }>;
  subscriptionPlans: Array<{
    name: string;
    price: string;
    features: string[];
    highlighted: boolean;
  }>;
}

export default function AdminPanel() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'trust' | 'testimonials' | 'plans' | 'petfinder'>('hero');
  const [contentData, setContentData] = useState<ContentData>({
    hero: {
      headline: 'Find your perfect pet — safely, responsibly, in 24 hours.',
      subheadline: 'Every pet comes from screened, ethical breeders with verified health records. We connect you with the right companion for your family.',
      trustLine: 'Loved by responsible pet parents. Every pet is breeder-verified.',
      ctaPrimary: 'Start Pet Finder',
      ctaSecondary: 'View Available Pets',
      heroImage: '/hero-pets.jpg'
    },
    trustBadges: [
      { title: 'Verified Breeders', description: 'We verify breeder & seller credentials.' },
      { title: 'Health-Checked', description: 'Vaccination & health records required.' },
      { title: '24-hr Match Guarantee', description: 'We commit to delivering verified matches within 24 hours.' },
      { title: 'Secure Payments', description: 'Safe, transparent transactions.' }
    ],
    testimonials: [
      {
        name: 'Priya & Raj',
        location: 'Kochi',
        quote: 'Pet.Ra found us a Golden Retriever in 18 hours. The breeder was verified, and Bruno is healthy and happy!'
      },
      {
        name: 'Anjali M.',
        location: 'Ernakulam',
        quote: 'As a first-time pet parent, Pet.Ras guidance was invaluable. Found the perfect Beagle for our family!'
      }
    ],
    subscriptionPlans: [
      {
        name: 'Starter',
        price: '₹299/mo',
        features: ['1 vet consult/month', 'Free priority Pet Finder access', '2 requests/month'],
        highlighted: false
      },
      {
        name: 'Active',
        price: '₹699/mo',
        features: ['Grooming credit', '2 vet consults', 'Essentials box', 'Priority support'],
        highlighted: true
      },
      {
        name: 'Premium',
        price: '₹1499/mo',
        features: ['Priority Pet Finder', '24/7 support', 'Premium box', 'Exclusive discounts'],
        highlighted: false
      }
    ]
  });

  const [savedStatus, setSavedStatus] = useState('');

  // Simple client-side auth (replace with proper auth in production)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Change this password to something secure!
    if (password === 'mamman2025') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Incorrect password!');
    }
  };

  useEffect(() => {
    // Check if already logged in
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
    
    // Load saved content
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch('/api/admin/get-content');
      if (response.ok) {
        const data = await response.json();
        if (data.content) {
          setContentData(data.content);
        }
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const saveContent = async () => {
    setLoading(true);
    setSavedStatus('');
    try {
      const response = await fetch('/api/admin/save-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      if (response.ok) {
        setSavedStatus('✅ Content saved successfully!');
        setTimeout(() => setSavedStatus(''), 3000);
      } else {
        setSavedStatus('❌ Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setSavedStatus('❌ Error saving content');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Login - Pet.Ra's</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-[#171739] to-[#252756] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <img src="/Pet.Ra's-logo-blue-2.png" alt="Pet.Ra's" className="h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-[#171739]">Admin Panel</h1>
              <p className="text-gray-600 mt-2">Enter password to continue</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#171739] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#FFD447] text-[#171739] font-bold rounded-xl hover:bg-[#F8D24B] transition-all"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Panel - Pet.Ra's Content Management</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[#171739] text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src="/Pet.Ra's-logo-blue-2.png" alt="Pet.Ra's" className="h-10 invert" />
                <div>
                  <h1 className="text-2xl font-bold">Pet.Ra's Admin Panel</h1>
                  <p className="text-sm text-gray-300">Content Management System</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={saveContent}
                  disabled={loading}
                  className="px-6 py-2 bg-[#FFD447] text-[#171739] font-bold rounded-xl hover:bg-[#F8D24B] transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : '💾 Save All Changes'}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
            {savedStatus && (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-xl text-center font-semibold">
                {savedStatus}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'hero', label: 'Hero Section', icon: '🎯' },
                { id: 'trust', label: 'Trust Badges', icon: '✅' },
                { id: 'testimonials', label: 'Testimonials', icon: '💬' },
                { id: 'plans', label: 'Subscription Plans', icon: '💎' },
                { id: 'petfinder', label: 'Pet Finder Settings', icon: '🐾' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#FFD447] text-[#171739]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Hero Section Tab */}
          {activeTab === 'hero' && (
            <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
              <h2 className="text-2xl font-bold text-[#171739] mb-6">🎯 Hero Section Content</h2>
              
              <div>
                <label className="block text-sm font-semibold text-[#171739] mb-2">Main Headline</label>
                <input
                  type="text"
                  value={contentData.hero.headline}
                  onChange={(e) => setContentData({
                    ...contentData,
                    hero: { ...contentData.hero, headline: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#171739] mb-2">Subheadline</label>
                <textarea
                  value={contentData.hero.subheadline}
                  onChange={(e) => setContentData({
                    ...contentData,
                    hero: { ...contentData.hero, subheadline: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#171739] mb-2">Trust Line</label>
                <input
                  type="text"
                  value={contentData.hero.trustLine}
                  onChange={(e) => setContentData({
                    ...contentData,
                    hero: { ...contentData.hero, trustLine: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#171739] mb-2">Primary CTA Text</label>
                  <input
                    type="text"
                    value={contentData.hero.ctaPrimary}
                    onChange={(e) => setContentData({
                      ...contentData,
                      hero: { ...contentData.hero, ctaPrimary: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#171739] mb-2">Secondary CTA Text</label>
                  <input
                    type="text"
                    value={contentData.hero.ctaSecondary}
                    onChange={(e) => setContentData({
                      ...contentData,
                      hero: { ...contentData.hero, ctaSecondary: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#171739] mb-2">Hero Image Path</label>
                <input
                  type="text"
                  value={contentData.hero.heroImage}
                  onChange={(e) => setContentData({
                    ...contentData,
                    hero: { ...contentData.hero, heroImage: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none"
                  placeholder="/hero-pets.jpg"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Upload image to /public folder and enter path here (e.g., /hero-pets.jpg)
                </p>
              </div>
            </div>
          )}

          {/* Trust Badges Tab */}
          {activeTab === 'trust' && (
            <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
              <h2 className="text-2xl font-bold text-[#171739] mb-6">✅ Trust Badges</h2>
              
              {contentData.trustBadges.map((badge, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-xl space-y-4">
                  <h3 className="font-semibold text-[#171739]">Badge #{index + 1}</h3>
                  <div>
                    <label className="block text-sm font-semibold text-[#171739] mb-2">Title</label>
                    <input
                      type="text"
                      value={badge.title}
                      onChange={(e) => {
                        const newBadges = [...contentData.trustBadges];
                        newBadges[index].title = e.target.value;
                        setContentData({ ...contentData, trustBadges: newBadges });
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#171739] mb-2">Description</label>
                    <input
                      type="text"
                      value={badge.description}
                      onChange={(e) => {
                        const newBadges = [...contentData.trustBadges];
                        newBadges[index].description = e.target.value;
                        setContentData({ ...contentData, trustBadges: newBadges });
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#171739]">💬 Testimonials</h2>
                <button
                  onClick={() => {
                    setContentData({
                      ...contentData,
                      testimonials: [
                        ...contentData.testimonials,
                        { name: '', location: '', quote: '' }
                      ]
                    });
                  }}
                  className="px-4 py-2 bg-[#FFD447] text-[#171739] font-semibold rounded-xl hover:bg-[#F8D24B] transition-all"
                >
                  + Add Testimonial
                </button>
              </div>
              
              {contentData.testimonials.map((testimonial, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#171739]">Testimonial #{index + 1}</h3>
                    <button
                      onClick={() => {
                        const newTestimonials = contentData.testimonials.filter((_, i) => i !== index);
                        setContentData({ ...contentData, testimonials: newTestimonials });
                      }}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#171739] mb-2">Name</label>
                      <input
                        type="text"
                        value={testimonial.name}
                        onChange={(e) => {
                          const newTestimonials = [...contentData.testimonials];
                          newTestimonials[index].name = e.target.value;
                          setContentData({ ...contentData, testimonials: newTestimonials });
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#171739] mb-2">Location</label>
                      <input
                        type="text"
                        value={testimonial.location}
                        onChange={(e) => {
                          const newTestimonials = [...contentData.testimonials];
                          newTestimonials[index].location = e.target.value;
                          setContentData({ ...contentData, testimonials: newTestimonials });
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#171739] mb-2">Quote</label>
                    <textarea
                      value={testimonial.quote}
                      onChange={(e) => {
                        const newTestimonials = [...contentData.testimonials];
                        newTestimonials[index].quote = e.target.value;
                        setContentData({ ...contentData, testimonials: newTestimonials });
                      }}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subscription Plans Tab */}
          {activeTab === 'plans' && (
            <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
              <h2 className="text-2xl font-bold text-[#171739] mb-6">💎 Subscription Plans</h2>
              
              {contentData.subscriptionPlans.map((plan, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#171739]">Plan: {plan.name}</h3>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={plan.highlighted}
                        onChange={(e) => {
                          const newPlans = [...contentData.subscriptionPlans];
                          newPlans[index].highlighted = e.target.checked;
                          setContentData({ ...contentData, subscriptionPlans: newPlans });
                        }}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-[#FFD447] focus:ring-[#FFD447]"
                      />
                      <span className="text-sm font-semibold text-[#171739]">Highlight this plan</span>
                    </label>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#171739] mb-2">Plan Name</label>
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => {
                          const newPlans = [...contentData.subscriptionPlans];
                          newPlans[index].name = e.target.value;
                          setContentData({ ...contentData, subscriptionPlans: newPlans });
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#171739] mb-2">Price</label>
                      <input
                        type="text"
                        value={plan.price}
                        onChange={(e) => {
                          const newPlans = [...contentData.subscriptionPlans];
                          newPlans[index].price = e.target.value;
                          setContentData({ ...contentData, subscriptionPlans: newPlans });
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#171739] mb-2">Features (one per line)</label>
                    <textarea
                      value={plan.features.join('\n')}
                      onChange={(e) => {
                        const newPlans = [...contentData.subscriptionPlans];
                        newPlans[index].features = e.target.value.split('\n').filter(f => f.trim());
                        setContentData({ ...contentData, subscriptionPlans: newPlans });
                      }}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD447] focus:outline-none resize-none font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pet Finder Settings Tab */}
          {activeTab === 'petfinder' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#171739] mb-6">🐾 Pet Finder Settings</h2>
              <div className="space-y-6">
                <div className="p-6 bg-blue-50 rounded-xl">
                  <h3 className="font-semibold text-[#171739] mb-2">Form Configuration</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Pet Finder form settings are managed in the main codebase. To modify the form fields, edit the <code className="px-2 py-1 bg-white rounded">pages/index.tsx</code> file.
                  </p>
                  <a 
                    href="/" 
                    target="_blank" 
                    className="inline-block px-4 py-2 bg-[#FFD447] text-[#171739] font-semibold rounded-xl hover:bg-[#F8D24B] transition-all"
                  >
                    View Live Form →
                  </a>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-[#171739] mb-2">📧 Email Notifications</h3>
                  <p className="text-sm text-gray-600">
                    All pet finder submissions are sent to: <strong>Pet.Ra'sgroupofficial@gmail.com</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            <p>© 2025 Pet.Ra's Admin Panel - Content Management System</p>
          </div>
        </div>
      </div>
    </>
  );
}

