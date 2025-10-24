import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Petra — Find, Connect, Care.</title>
        <meta name="description" content="Discover pets, products, and trusted services — Petra makes pet ownership easy." />
      </Head>
      
      <div className="min-h-screen bg-[#F3B63F] relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#30358B] rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-1/4 w-36 h-36 bg-[#30358B] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-44 h-44 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-20 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/petra-logo-blue-2.png" 
                alt="Petra Logo" 
                className="h-8 sm:h-10 w-auto"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />
            </div>
            <Link href="/petfinder">
              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-[#30358B] text-white text-sm sm:text-base font-bold rounded-full hover:bg-[#30358B]/90 hover:scale-105 transition-all duration-300 shadow-lg">
                Find a Pet
              </button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-24">
            {/* Hero Content */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 sm:mb-6">
                <span className="text-[#30358B]">Find. Connect. </span>
                <span className="text-white">Care.</span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-[#30358B] font-semibold max-w-3xl mx-auto mb-4">
                Your one-stop platform for discovering pets, products, and trusted services
              </p>
              
              <p className="text-base sm:text-lg text-[#30358B]/80 max-w-2xl mx-auto mb-8">
                We're building something exciting — a full-fledged app that helps you find your next pet, buy pet essentials, book services, and more.
              </p>

              {/* CTA Button */}
              <Link href="/petfinder">
                <button className="group inline-flex items-center space-x-2 px-8 py-4 bg-[#30358B] text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <span>Try the Pet Finder</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </button>
              </Link>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12">
              {/* Find Pets Card */}
              <div className="group bg-white rounded-3xl p-6 sm:p-8 text-center shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-4 border-white">
                <div className="text-6xl sm:text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🐕</div>
                <h3 className="text-lg sm:text-xl font-bold text-[#30358B] mb-2">Find Pets</h3>
                <p className="text-sm text-[#30358B]/70">Discover your perfect companion</p>
              </div>

              {/* Buy Products Card */}
              <div className="group bg-white rounded-3xl p-6 sm:p-8 text-center shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-4 border-white">
                <div className="text-6xl sm:text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🛍️</div>
                <h3 className="text-lg sm:text-xl font-bold text-[#30358B] mb-2">Buy Products</h3>
                <p className="text-sm text-[#30358B]/70">Quality pet essentials</p>
              </div>

              {/* Book Services Card */}
              <div className="group bg-white rounded-3xl p-6 sm:p-8 text-center shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-4 border-white">
                <div className="text-6xl sm:text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🏥</div>
                <h3 className="text-lg sm:text-xl font-bold text-[#30358B] mb-2">Book Services</h3>
                <p className="text-sm text-[#30358B]/70">Trusted pet care services</p>
              </div>

              {/* Care & Connect Card */}
              <div className="group bg-white rounded-3xl p-6 sm:p-8 text-center shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-4 border-white">
                <div className="text-6xl sm:text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300">❤️</div>
                <h3 className="text-lg sm:text-xl font-bold text-[#30358B] mb-2">Care & Connect</h3>
                <p className="text-sm text-[#30358B]/70">Join our pet community</p>
              </div>
            </div>

            {/* Coming Soon Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white rounded-full shadow-lg">
                <span className="text-2xl">📱</span>
                <span className="text-sm font-bold text-[#30358B]">
                  Coming soon to App Store & Play Store
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-20 bg-[#30358B] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-sm font-semibold">
                © 2025 Petra. All rights reserved.
              </div>
              
              <div className="flex items-center flex-wrap justify-center gap-6">
                <a 
                  href="https://instagram.com/thepetra.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#F3B63F] transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="text-sm font-medium">Instagram</span>
                </a>
                
                <a 
                  href="https://twitter.com/thepetra_in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#F3B63F] transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-sm font-medium">X</span>
                </a>
                
                <a 
                  href="mailto:hello@thepetra.in" 
                  className="hover:text-[#F3B63F] transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Email Us</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
