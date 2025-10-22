'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  petType: string;
  breedSizePreference: string;
  agePreference: string;
  budgetRange: number;
  location: string;
  additionalNotes: string;
  captcha: string;
}

// Breed suggestions data
const breedSuggestions = {
  'Dog': [
    'Golden Retriever', 'Labrador Retriever', 'German Shepherd', 'French Bulldog',
    'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'German Shorthaired Pointer',
    'Siberian Husky', 'Dachshund', 'Boxer', 'Great Dane', 'Chihuahua',
    'Border Collie', 'Australian Shepherd', 'Cocker Spaniel', 'Shih Tzu',
    'Boston Terrier', 'Maltese', 'Pomeranian', 'Yorkshire Terrier'
  ],
  'Cat': [
    'Persian', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Siamese',
    'American Shorthair', 'Abyssinian', 'Scottish Fold', 'Sphynx',
    'Russian Blue', 'Bengal', 'Birman', 'Oriental Shorthair', 'Devon Rex',
    'Himalayan', 'Exotic Shorthair', 'Manx', 'Cornish Rex', 'Tonkinese'
  ],
  'Bird': [
    'Budgerigar', 'Cockatiel', 'Canary', 'Lovebird', 'Cockatoo',
    'African Grey Parrot', 'Conure', 'Finch', 'Parakeet', 'Macaw',
    'Quaker Parrot', 'Sun Conure', 'Green Cheek Conure', 'Zebra Finch'
  ],
  'Other': [
    'Hamster', 'Guinea Pig', 'Rabbit', 'Ferret', 'Chinchilla',
    'Gerbil', 'Mouse', 'Rat', 'Turtle', 'Fish', 'Snake', 'Lizard'
  ]
};

const FindYourPetForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    petType: '',
    breedSizePreference: '',
    agePreference: '',
    budgetRange: 50000,
    location: 'Kochi',
    additionalNotes: '',
    captcha: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [breedSuggestionsList, setBreedSuggestionsList] = useState<string[]>([]);
  const [showBreedSuggestions, setShowBreedSuggestions] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Generate CAPTCHA on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const triggerConfetti = () => {
    setShowConfetti(true);
    // Create confetti elements
    for (let i = 0; i < 50; i++) {
      createConfetti();
    }
  };

  const createConfetti = () => {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = ['#FFC12A', '#30358B', '#FF6B6B', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 5)];
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.animation = 'confetti-fall 3s linear forwards';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 3000);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.phone);
      case 2:
        return !!(formData.petType && formData.breedSizePreference && formData.agePreference);
      case 3:
        return !!(formData.budgetRange && formData.additionalNotes && formData.captcha && parseInt(formData.captcha) === captchaAnswer);
      default:
        return false;
    }
  };

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion(`${num1} + ${num2} = ?`);
    setCaptchaAnswer(num1 + num2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Handle breed suggestions
    if (name === 'breedSizePreference') {
      if (formData.petType && value.length > 0) {
        const suggestions = breedSuggestions[formData.petType as keyof typeof breedSuggestions] || [];
        const filtered = suggestions.filter(breed => 
          breed.toLowerCase().includes(value.toLowerCase())
        );
        setBreedSuggestionsList(filtered);
        setShowBreedSuggestions(filtered.length > 0);
      } else {
        setShowBreedSuggestions(false);
      }
    }

    // Handle pet type change - reset breed suggestions
    if (name === 'petType') {
      setFormData(prev => ({
        ...prev,
        breedSizePreference: ''
      }));
      setShowBreedSuggestions(false);
    }
  };

  const handleBreedSelect = (breed: string) => {
    setFormData(prev => ({
      ...prev,
      breedSizePreference: breed
    }));
    setShowBreedSuggestions(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Validate CAPTCHA
    if (parseInt(formData.captcha) !== captchaAnswer) {
      setSubmitStatus('error');
      setErrorMessage('CAPTCHA answer is incorrect. Please try again.');
      setIsSubmitting(false);
      generateCaptcha(); // Generate new CAPTCHA
      return;
    }

    // Validate required fields
    if (!formData.fullName || !formData.phone || !formData.petType || !formData.breedSizePreference || !formData.agePreference || !formData.budgetRange || !formData.additionalNotes) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/send-pet-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

          if (response.ok) {
            setSubmitStatus('success');
            triggerConfetti();
            setShowSuccessPopup(true);
            setFormData({
              fullName: '',
              email: '',
              phone: '',
              petType: '',
              breedSizePreference: '',
              agePreference: '',
              budgetRange: 50000,
              location: 'Kochi',
              additionalNotes: '',
              captcha: '',
            });
            setCurrentStep(1);
            generateCaptcha(); // Generate new CAPTCHA
          } else {
        setSubmitStatus('error');
        setErrorMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #FFC12A 50%,#FFC12A 100%)' }}>
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl">
        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Progress Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 md:px-8 lg:px-12 py-6 border-b border-gray-200">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src="/petra-logo-blue-2.png" 
                alt="Petra" 
                className="h-8"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <h2 className="text-2xl font-bold text-gray-800 text-center">Find your pawsome partner!</h2>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500" 
                style={{ 
                  width: `${(currentStep / 3) * 100}%`,
                  background: 'linear-gradient(90deg, #30358B 0%, #FFC12A 100%)'
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
            </div>
          </div>
          
          <div className="p-6 md:p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Let's get to know you! 👋</h3>
                    <p className="text-gray-600">Tell us a bit about yourself so we can help you find the perfect pet.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Pet Preferences */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">What kind of pet are you looking for? 🐾</h3>
                    <p className="text-gray-600">Help us understand your preferences so we can find the perfect match.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pet Type Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">Pet Type *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Dog', 'Cat', 'Bird', 'Other'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, petType: type }))}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              formData.petType === type
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-1">
                                {type === 'Dog' ? '🐕' : type === 'Cat' ? '🐱' : type === 'Bird' ? '🐦' : '🐾'}
                              </div>
                              <div className="text-sm font-medium">{type}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Breed / Size Preference with Autocomplete */}
                    <div className="space-y-2">
                      <label htmlFor="breedSizePreference" className="text-sm font-medium text-gray-700">
                        Breed Preference *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="breedSizePreference"
                          name="breedSizePreference"
                          value={formData.breedSizePreference}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="Start typing breed name..."
                          disabled={!formData.petType}
                          required
                        />
                        {showBreedSuggestions && breedSuggestionsList.length > 0 && (
                          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                            {breedSuggestionsList.map((breed, index) => (
                              <button
                                key={index}
                                type="button"
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                onClick={() => handleBreedSelect(breed)}
                              >
                                {breed}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Age Preference */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Age Preference *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'Puppy/Kitten', label: 'Young', icon: '🐣' },
                        { value: 'Adult', label: 'Adult', icon: '🐕' }
                      ].map((age) => (
                        <button
                          key={age.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, agePreference: age.value }))}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            formData.agePreference === age.value
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-xl mb-1">{age.icon}</div>
                            <div className="text-xs font-medium">{age.label}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Final Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Almost there! 🎯</h3>
                    <p className="text-gray-600">Just a few more details to help us find your perfect pet match.</p>
                  </div>
                  
                  {/* Location - Locked to Kochi */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <div className="relative">
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 flex items-center justify-between">
                        <span>📍 Kochi, Kerala</span>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                          More locations Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Budget Range *</label>
                    
                    {/* Pre-built Price Buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[10000, 20000, 50000, 100000].map((price) => (
                        <button
                          key={price}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, budgetRange: price }))}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            formData.budgetRange === price
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-sm font-medium">{formatCurrency(price)}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Custom Price Input */}
                    <div className="space-y-2">
                      <label htmlFor="budgetRange" className="text-sm font-medium text-gray-700">
                        Or enter custom amount *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          id="budgetRange"
                          name="budgetRange"
                          value={formData.budgetRange}
                          onChange={handleInputChange}
                          min="1000"
                          max="500000"
                          step="1000"
                          className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="Enter amount"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes and CAPTCHA */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Additional Notes */}
                    <div className="space-y-2">
                      <label htmlFor="additionalNotes" className="text-sm font-medium text-gray-700">
                        Additional Notes *
                      </label>
                      <textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                        placeholder="Any special requirements or preferences..."
                        required
                      />
                    </div>

                    {/* CAPTCHA */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">Security Check *</label>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center font-mono text-lg text-gray-700">
                          {captchaQuestion}
                        </div>
                        <input
                          type="number"
                          name="captcha"
                          value={formData.captcha}
                          onChange={handleInputChange}
                          required
                          className="w-20 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center"
                          placeholder="?"
                        />
                        <button
                          type="button"
                          onClick={generateCaptcha}
                          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                          title="Generate new CAPTCHA"
                        >
                          🔄
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step Navigation */}
              <div className="flex justify-between items-center pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200"
                  >
                    ← Previous
                  </button>
                )}
                
                <div className="flex-1"></div>
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className="px-8 py-3 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #30358B 0%, #30358B 100%)' }}
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !validateStep(3)}
                    className="px-8 py-3 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #30358B 0%, #30358B 100%)' }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Finding Your Pet...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>🐾</span>
                        <span>Find My Perfect Pet</span>
                      </div>
                    )}
                  </button>
                )}
              </div>

              {/* Microcopy */}
              <div className="text-center space-y-2 mt-6">
                <p className="text-xs text-gray-500">
                  We'll contact you within 24 hours with matching options
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xs text-gray-400">Powered by</span>
                  <img 
                    src="/petra-logo-blue-2.png" 
                    alt="Petra" 
                    className="h-4 opacity-60"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'inline-block';
                    }}
                  />
                  <span className="h-4 w-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded text-white text-xs flex items-center justify-center opacity-60" style={{ display: 'none' }}>
                    🐾
                  </span>
                </div>
              </div>

              {/* Error Messages */}
              {submitStatus === 'error' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-red-600">❌</span>
                    <p className="text-red-800 font-medium">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h3>
              <p className="text-gray-600 mb-6">
                Your pet request has been submitted successfully! We'll contact you within 24 hours with matching options.
              </p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Awesome! 🐾
              </button>
            </div>
          </div>
        )}

        {/* Confetti Animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-40">
            <style jsx>{`
              @keyframes confetti-fall {
                0% {
                  transform: translateY(-100vh) rotate(0deg);
                  opacity: 1;
                }
                100% {
                  transform: translateY(100vh) rotate(720deg);
                  opacity: 0;
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindYourPetForm;
