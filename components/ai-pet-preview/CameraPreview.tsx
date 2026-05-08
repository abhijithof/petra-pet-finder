import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Camera as CameraIcon } from 'lucide-react';

interface CameraPreviewProps {
    onCapture: (imageData: string) => void;
    onCancel: () => void;
}

const CameraPreview: React.FC<CameraPreviewProps> = ({ onCapture, onCancel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [retakeCount, setRetakeCount] = useState(0);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Could not access camera. Please ensure you have given permission.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const takePhoto = () => {
        setCountdown(3);
    };

    useEffect(() => {
        if (countdown === null) return;

        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            capture();
            setCountdown(null);
        }
    }, [countdown]);

    const capture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1); // Mirror effect
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                setCapturedImage(dataUrl);
            }
        }
    };

    const handleConfirm = () => {
        if (capturedImage) {
            onCapture(capturedImage);
        }
    };

    const handleRetake = () => {
        if (retakeCount < 1) {
            setCapturedImage(null);
            setRetakeCount(retakeCount + 1);
        } else {
            alert('Maximum 1 retake allowed.');
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
            <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                {!capturedImage ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            style={{ transform: 'scaleX(-1)' }}
                            className="w-full h-full object-cover"
                        />
                        {countdown !== null && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <span className="text-8xl font-bold text-white animate-ping">{countdown}</span>
                            </div>
                        )}
                        <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-4">
                            <p className="text-white text-lg font-medium drop-shadow-lg bg-black/30 px-6 py-2 rounded-full backdrop-blur-md">
                                Make sure your face is well lit.
                            </p>
                            <button
                                onClick={takePhoto}
                                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                                disabled={countdown !== null}
                            >
                                <div className="w-16 h-16 rounded-full border-4 border-slate-200 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-petra-blue rounded-full"></div>
                                </div>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <img src={capturedImage} className="w-full h-full object-cover" alt="Captured selfie" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-10 flex justify-center gap-6">
                            <button
                                onClick={handleRetake}
                                disabled={retakeCount >= 1}
                                className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all ${retakeCount >= 1 ? 'bg-gray-500 cursor-not-allowed text-gray-300' : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md'}`}
                            >
                                <RefreshCw size={24} /> Retake ({1 - retakeCount} left)
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex items-center gap-2 px-10 py-4 bg-[#171739] hover:bg-[#252756] text-white rounded-full font-bold text-lg shadow-xl hover:translate-y-[-2px] transition-all"
                            >
                                Looks Good!
                            </button>
                        </div>
                    </>
                )}
            </div>
            <canvas ref={canvasRef} className="hidden" />

            <button
                onClick={onCancel}
                className="mt-8 text-gray-500 hover:text-gray-700 font-medium underline underline-offset-4"
            >
                Go back
            </button>

            <style jsx>{`
        .bg-petra-blue {
          background-color: #171739;
        }
      `}</style>
        </div>
    );
};

export default CameraPreview;
