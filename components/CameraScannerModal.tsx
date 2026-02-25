import React, { useState, useRef, useEffect, useCallback } from 'react';
import { identifyProductFromImage } from '../services/geminiService';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const LoadingSpinner = () => (
  <div className="w-16 h-16 border-4 border-white border-t-rose-500 border-solid rounded-full animate-spin"></div>
);

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (details: { name: string; description: string; }) => void;
}

const CameraScannerModal: React.FC<CameraScannerModalProps> = ({ isOpen, onClose, onScanComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      const startCamera = async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } 
          });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.error("خطا در دسترسی به دوربین:", err);
          setError("دسترسی به دوربین امکان‌پذیر نیست. لطفاً مطمئن شوید که دسترسی لازم را به مرورگر داده‌اید.");
        }
      };
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, stopCamera]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsLoading(true);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
    const mimeType = 'image/jpeg';
    const base64Image = canvas.toDataURL(mimeType).split(',')[1];
    
    try {
        const details = await identifyProductFromImage(base64Image, mimeType);
        onScanComplete(details);
    } catch (err) {
        setError(err instanceof Error ? err.message : "خطای ناشناخته در پردازش تصویر.");
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white">
      <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors z-20">
        <CloseIcon />
      </button>

      {error ? (
        <div className="text-center p-8">
            <h3 className="text-xl font-bold mb-4">خطا</h3>
            <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover"></video>
          
          {isLoading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-30">
                <LoadingSpinner />
                <p className="text-lg font-semibold">در حال شناسایی محصول...</p>
            </div>
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <div className="w-4/5 max-w-md aspect-[4/3] border-4 border-white/50 border-dashed rounded-lg shadow-lg"></div>
            <p className="mt-4 p-2 bg-black/50 rounded-md">محصول را در کادر قرار دهید</p>
          </div>

          <div className="absolute bottom-10 z-20 flex flex-col items-center">
            <button onClick={handleCapture} className="w-20 h-20 rounded-full bg-white/30 border-4 border-white flex items-center justify-center hover:bg-white/50 transition-colors" aria-label="گرفتن عکس">
              <CameraIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraScannerModal;