import FindYourPetForm from '../../components/FindYourPetForm';
import Head from 'next/head';
import Link from 'next/link';

export default function PetFinder() {
  return (
    <>
      <Head>
        <title>Pet Finder - Pet.Ra's</title>
        <meta name="description" content="Find your perfect pet with Pet.Ra's advanced pet matching service. Tell us what you're looking for and we'll find the perfect match." />
      </Head>
      
      <div className="min-h-screen">
        {/* Navigation Header */}
        <nav className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img 
                  src="/Pet.Ra's-logo-blue-2.png" 
                  alt="Pet.Ra's Logo" 
                  className="h-8 sm:h-10 w-auto"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </Link>
            <Link href="/">
              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-[#30358B] text-sm sm:text-base font-bold rounded-full hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg border-2 border-[#30358B]">
                ← Home
              </button>
            </Link>
          </div>
        </nav>

        <FindYourPetForm />
      </div>
    </>
  );
}

