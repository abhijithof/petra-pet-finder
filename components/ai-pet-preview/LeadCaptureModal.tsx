import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onSubmit: (data: { name: string, phone: string, petStatus: string }) => void;
    onClose: () => void;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        petStatus: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.petStatus) {
            alert('Please fill in all fields');
            return;
        }
        setLoading(true);
        // Simulate slight delay for effect
        setTimeout(() => {
            onSubmit(formData);
            setLoading(false);
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={24} className="text-gray-400" />
                </button>

                <div className="p-10 pt-12 text-[#171739]">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold mb-3">
                            Ready to see the magic? ✨
                        </h2>
                        <p className="text-slate-500 text-lg">
                            Send this to your phone & get early access to Petra.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                placeholder="Abhijith K"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#FFD447] focus:bg-white transition-all text-lg outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 ml-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                placeholder="+91 98765 43210"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#FFD447] focus:bg-white transition-all text-lg outline-none"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-semibold ml-1">Your Pet Status</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, petStatus: 'have-pet' })}
                                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all font-medium ${formData.petStatus === 'have-pet'
                                        ? 'border-[#FFD447] bg-yellow-50 text-[#171739]'
                                        : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    {formData.petStatus === 'have-pet' && <CheckCircle2 size={20} />}
                                    I have a pet
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, petStatus: 'want-pet' })}
                                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all font-medium ${formData.petStatus === 'want-pet'
                                        ? 'border-[#FFD447] bg-yellow-50 text-[#171739]'
                                        : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    {formData.petStatus === 'want-pet' && <CheckCircle2 size={20} />}
                                    I want a pet
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-[#171739] hover:bg-[#252756] text-white rounded-2xl font-bold text-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : 'Generate My Petra Moment'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-400">
                        By continuing, you agree to Petra's terms of service and privacy policy.
                        AI-generated image for demo purposes.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LeadCaptureModal;
