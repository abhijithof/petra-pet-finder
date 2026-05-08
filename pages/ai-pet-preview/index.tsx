import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint, ChevronRight, Sparkles, Dog, Cat, Star, Camera, X } from 'lucide-react';
import CameraPreview from '../../components/ai-pet-preview/CameraPreview';
import ResultDisplay from '../../components/ai-pet-preview/ResultDisplay';
import LeadCaptureModal from '../../components/ai-pet-preview/LeadCaptureModal';

type Step = 'INTRO' | 'PET_TYPE' | 'BREED' | 'SELFIE' | 'GENERATING' | 'RESULT';

const PET_TYPES = [
    { id: 'Dog', label: 'Dog', icon: <Dog size={48} />, color: 'bg-indigo-50 text-[#171739] border-indigo-100' },
    { id: 'Cat', label: 'Cat', icon: <Cat size={48} />, color: 'bg-yellow-50 text-[#171739] border-yellow-100' },
    { id: 'Surprise', label: 'Surprise Me', icon: <Sparkles size={48} />, color: 'bg-slate-50 text-[#171739] border-slate-100' }
];

const BREEDS: Record<string, string[]> = {
    'Dog': ['Golden Retriever', 'German Shepherd', 'Poodle', 'Bulldog', 'Beagle', 'Labrador', 'Indie Dog', 'Surprise Me'],
    'Cat': ['Persian', 'Siamese', 'Maine Coon', 'Bengal', 'Ragdoll', 'British Shorthair', 'Indie Cat', 'Surprise Me'],
    'Surprise': ['Any / Surprise']
};

export default function AIPetPreviewPage() {
    const [step, setStep] = useState<Step>('INTRO');
    const [selectedPet, setSelectedPet] = useState<string | null>(null);
    const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
    const [selfie, setSelfie] = useState<string | null>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [showLeadModal, setShowLeadModal] = useState(false);

    // Transition helper
    const nextStep = (next: Step) => {
        setStep(next);
    };

    const handleStart = () => nextStep('PET_TYPE');

    const handlePetSelection = (petId: string) => {
        setSelectedPet(petId);
        nextStep('BREED');
    };

    const handleBreedSelection = (breed: string) => {
        setSelectedBreed(breed);
        nextStep('SELFIE');
    };

    const handleCapture = (imageData: string) => {
        setSelfie(imageData);
        setShowLeadModal(true);
    };

    const handleLeadSubmit = async (leadData: any) => {
        setShowLeadModal(false);
        nextStep('GENERATING');

        try {
            // Save lead
            await fetch('/api/ai-pet-preview/save-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...leadData,
                    petType: selectedPet,
                    breed: selectedBreed
                })
            });

            // Call AI Generation
            const response = await fetch('/api/ai-pet-preview/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selfie,
                    petType: selectedPet,
                    breed: selectedBreed
                })
            });

            const data = await response.json();
            if (data.success) {
                setGeneratedImageUrl(data.imageUrl);
                nextStep('RESULT');
            } else {
                throw new Error(data.message || 'Generation failed');
            }
        } catch (err) {
            console.error('Generation Error:', err);
            alert('Something went wrong. Please try again.');
            nextStep('SELFIE');
        }
    };

    const handleReset = () => {
        setStep('INTRO');
        setSelectedPet(null);
        setSelectedBreed(null);
        setSelfie(null);
        setGeneratedImageUrl(null);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden">
            <Head>
                <title>AI Pet Preview - See Yourself with Your Future Pet | Pet.Ra</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                <meta name="description" content="Upload a selfie and see what you'd look like with your dream pet. Pet.Ra's AI pet preview tool matches you with dogs, cats, and more — try it free!" />
                <meta name="keywords" content="AI pet preview, see yourself with a pet, pet selfie AI, dog AI photo, cat AI photo, pet matcher Kochi, Pet.Ra AI" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://thepetra.in/ai-pet-preview" />

                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://thepetra.in/ai-pet-preview" />
                <meta property="og:site_name" content="Pet.Ra" />
                <meta property="og:title" content="AI Pet Preview - See Yourself with Your Future Pet | Pet.Ra" />
                <meta property="og:description" content="Upload a selfie and see what you'd look like with your dream pet. Try Pet.Ra's free AI pet preview — no sign-up needed." />
                <meta property="og:image" content="https://thepetra.in/petra-logo-blue-2.png" />
                <meta property="og:locale" content="en_IN" />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="AI Pet Preview - See Yourself with Your Future Pet | Pet.Ra" />
                <meta name="twitter:description" content="Upload a selfie and see what you'd look like with your dream pet. Free AI tool from Pet.Ra." />
                <meta name="twitter:image" content="https://thepetra.in/petra-logo-blue-2.png" />
            </Head>

            {/* Floating Header */}
            <nav className="fixed top-0 inset-x-0 h-24 flex items-center justify-between px-10 z-50 pointer-events-none">
                <div className="flex items-center gap-3 pointer-events-auto cursor-pointer" onClick={handleReset}>
                    <img src="/petra-logo-blue-2.png" alt="Pet.Ra" className="h-10 w-auto" />
                    <span className="text-2xl font-black tracking-tight text-[#171739]">AI <span className="text-[#FFD447] italic">Preview</span></span>
                </div>

                {step !== 'INTRO' && step !== 'GENERATING' && (
                    <button
                        onClick={handleReset}
                        className="pointer-events-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                )}
            </nav>

            <main className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
                <AnimatePresence mode="wait">

                    {/* STEP 1: INTRO */}
                    {step === 'INTRO' && (
                        <motion.section
                            key="intro"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            className="px-10 text-center max-w-4xl"
                        >
                            <div className="mb-8 inline-flex items-center gap-2 px-5 py-2 bg-[#FFD447]/20 text-[#171739] rounded-full font-bold text-sm uppercase tracking-wider border border-[#FFD447]/30">
                                <Sparkles size={16} className="text-[#171739]" /> Live at Booth
                            </div>
                            <h1 className="text-7xl md:text-8xl font-black text-[#171739] leading-[1.1] mb-8">
                                See yourself with your <br />
                                <span className="text-[#FFD447] italic">future pet 🐾</span>
                            </h1>
                            <p className="text-2xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                                Choose a pet, take a selfie, and let Petra’s AI work the magic.
                                Creating moments you'll cherish forever.
                            </p>
                            <button
                                onClick={handleStart}
                                className="group relative inline-flex items-center gap-4 bg-[#171739] text-white px-12 py-8 rounded-[2.5rem] text-3xl font-black shadow-2xl hover:bg-[#252756] hover:scale-[1.05] active:scale-[0.98] transition-all duration-300"
                            >
                                Start Journey
                                <ChevronRight className="group-hover:translate-x-2 transition-transform text-[#FFD447]" size={40} />
                            </button>
                        </motion.section>
                    )}

                    {/* STEP 2: PET TYPE */}
                    {step === 'PET_TYPE' && (
                        <motion.section
                            key="pet_type"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full max-w-6xl px-10"
                        >
                            <div className="text-center mb-16">
                                <h2 className="text-5xl font-black text-[#171739] mb-4">Choose your favorite</h2>
                                <p className="text-xl text-slate-500 font-medium">Which type of furry friend brings you joy?</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {PET_TYPES.map((pet) => (
                                    <button
                                        key={pet.id}
                                        onClick={() => handlePetSelection(pet.id)}
                                        className={`group flex flex-col items-center justify-center p-12 rounded-[3.5rem] border-4 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] ${pet.color}`}
                                    >
                                        <div className="mb-8 p-8 bg-white rounded-full shadow-lg group-hover:scale-110 transition-transform duration-500">
                                            {pet.icon}
                                        </div>
                                        <span className="text-3xl font-black">{pet.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* STEP 3: BREED */}
                    {step === 'BREED' && (
                        <motion.section
                            key="breed"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full max-w-5xl px-10"
                        >
                            <div className="text-center mb-12 flex flex-col items-center">
                                <button onClick={() => setStep('PET_TYPE')} className="mb-4 text-[#171739] font-bold flex items-center gap-1 hover:text-[#FFD447] transition-colors">
                                    Back to {selectedPet}s
                                </button>
                                <h2 className="text-5xl font-black text-[#171739] mb-4">Select a breed</h2>
                                <p className="text-xl text-slate-500 font-medium">Choose from our popular {selectedPet} breeds</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {selectedPet && BREEDS[selectedPet].map((breed) => (
                                    <button
                                        key={breed}
                                        onClick={() => handleBreedSelection(breed)}
                                        className="flex items-center justify-center p-8 bg-slate-50 border-2 border-slate-100 rounded-3xl text-xl font-bold text-slate-700 hover:border-[#FFD447] hover:bg-white hover:text-[#171739] hover:shadow-xl hover:scale-[1.05] transition-all duration-300 active:scale-95"
                                    >
                                        {breed}
                                    </button>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* STEP 4: SELFIE */}
                    {step === 'SELFIE' && (
                        <motion.section
                            key="selfie"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-4xl px-10 text-center"
                        >
                            <div className="mb-10">
                                <h2 className="text-5xl font-black text-[#171739] mb-4">Strike a pose! 📸</h2>
                                <p className="text-xl text-slate-500 font-medium">This is how you'll appear with your {selectedBreed} {selectedPet}.</p>
                            </div>
                            <CameraPreview
                                onCapture={handleCapture}
                                onCancel={() => setStep('BREED')}
                            />
                        </motion.section>
                    )}

                    {/* STEP 5: GENERATING */}
                    {step === 'GENERATING' && (
                        <motion.section
                            key="generating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="relative w-48 h-48 mb-12">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-8 border-slate-100 border-t-[#FFD447] rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <PawPrint size={64} className="text-[#171739] animate-pulse" />
                                </div>
                            </div>
                            <h2 className="text-4xl font-black text-[#171739] mb-4 tracking-tight">Creating your Petra moment…</h2>
                            <p className="text-xl text-slate-400 max-w-md mx-auto animate-pulse flex items-center justify-center gap-2">
                                <Sparkles size={20} className="text-[#FFD447]" /> Our AI is painting your perfect future.
                            </p>

                            <div className="mt-12 w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "95%" }}
                                    transition={{ duration: 15 }}
                                    className="h-full bg-[#171739] rounded-full"
                                />
                            </div>
                        </motion.section>
                    )}

                    {/* STEP 6: RESULT */}
                    {step === 'RESULT' && generatedImageUrl && (
                        <motion.section
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full"
                        >
                            <ResultDisplay
                                imageUrl={generatedImageUrl}
                                onReset={handleReset}
                            />
                        </motion.section>
                    )}

                </AnimatePresence>
            </main>

            <LeadCaptureModal
                isOpen={showLeadModal}
                onSubmit={handleLeadSubmit}
                onClose={() => setShowLeadModal(false)}
            />

            {/* Decorative Elements */}
            <div className="fixed -top-24 -left-24 w-96 h-96 bg-[#FFD447]/10 rounded-full blur-[120px] opacity-70 pointer-events-none" />
            <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-[#171739]/5 rounded-full blur-[120px] opacity-70 pointer-events-none" />

            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Outfit', sans-serif;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
        </div>
    );
}
