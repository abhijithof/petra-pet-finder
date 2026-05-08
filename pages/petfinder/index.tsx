import FindYourPetForm from '../../components/FindYourPetForm';
import Head from 'next/head';
import Link from 'next/link';

export default function PetFinder() {
  return (
    <>
      <Head>
        <title>Find Your Perfect Pet in Kochi | Pet Finder - Pet.Ra</title>
        <meta name="description" content="Use Pet.Ra's pet finder to locate verified dogs, cats, and more from trusted breeders in Kochi. Tell us your preferences and get matched in 24 hours." />
        <meta name="keywords" content="pet finder Kochi, buy dog Kochi, buy cat Kochi, verified pet breeders Kerala, pet adoption Kochi, find puppy Kochi, find kitten Kochi" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://thepetra.in/petfinder" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thepetra.in/petfinder" />
        <meta property="og:site_name" content="Pet.Ra" />
        <meta property="og:title" content="Find Your Perfect Pet in Kochi | Pet Finder - Pet.Ra" />
        <meta property="og:description" content="Tell us what you're looking for and Pet.Ra will match you with verified pets from trusted breeders in Kochi within 24 hours." />
        <meta property="og:image" content="https://thepetra.in/petra-logo-blue-2.png" />
        <meta property="og:locale" content="en_IN" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Find Your Perfect Pet in Kochi | Pet Finder - Pet.Ra" />
        <meta name="twitter:description" content="Get matched with verified pets from trusted breeders in Kochi within 24 hours." />
        <meta name="twitter:image" content="https://thepetra.in/petra-logo-blue-2.png" />

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Pet Finder Service",
          "description": "Find verified pets from trusted breeders in Kochi within 24 hours",
          "url": "https://thepetra.in/petfinder",
          "provider": { "@type": "Organization", "name": "Pet.Ra", "url": "https://thepetra.in" },
          "areaServed": { "@type": "City", "name": "Kochi" },
          "serviceType": "Pet Finder",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "description": "Free pet matching request" }
        })}</script>
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

