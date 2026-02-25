
import React, { useState, useEffect } from 'react';
import { MicroItem } from '../types';
import { createOrder } from '../services/api';

interface CharityMicroDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonate: (item: string, amount: number) => void;
  initialItem?: MicroItem; // Must be present for the modal to work
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-rose-500 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

const CharityMicroDonationModal: React.FC<CharityMicroDonationModalProps> = ({ isOpen, onClose, onDonate, initialItem }) => {
  const [view, setView] = useState<'confirm' | 'success'>('confirm');
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset state when opening
  useEffect(() => {
      if(isOpen) {
          setView('confirm');
          setIsProcessing(false);
      }
  }, [isOpen]);

  if (!isOpen || !initialItem) return null;

  const handlePay = async () => {
      setIsProcessing(true);
      
      try {
          // Direct Deposit Logic:
          // The merchantId and receiverId are BOTH the charityId.
          // This ensures the money goes to the charity's wallet directly via `createOrder` -> `rpcProcessTransaction`
          const charityId = initialItem.charityId;
          const buyerId = 'user-gen-0'; // Simulate current user ID (in real app, pass from props)
          
          await createOrder(
              buyerId, 
              charityId, // Merchant is the Charity
              charityId, // Receiver is the Charity
              [{ name: initialItem.name, price: initialItem.price }],
              `سهم لبخند: ${initialItem.name} (واریز مستقیم خیریه)`
          );

          setTimeout(() => {
              setIsProcessing(false);
              setView('success');
              onDonate(initialItem.name, initialItem.price);
          }, 1500);
      } catch (error) {
          console.error(error);
          alert('خطا در ثبت سفارش');
          setIsProcessing(false);
      }
  };

  const kidNames = ['علی', 'زهرا', 'محمد', 'سارا', 'امیر', 'نرگس', 'آرش', 'مریم'];
  const randomKidName = kidNames[Math.floor(Math.random() * kidNames.length)];

  return (
    <div className="fixed inset-0 bg-black/80 z-[70] flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <CloseIcon />
        </button>

        {view === 'confirm' && (
            <div className="p-8 text-center flex flex-col items-center">
                <div className="mb-4 text-6xl animate-bounce">
                    {initialItem.icon}
                </div>
                
                <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">
                    {initialItem.name}
                </h2>
                
                <div className={`px-4 py-1.5 rounded-full font-bold text-sm mb-6 ${initialItem.color} bg-opacity-20`}>
                    {initialItem.price.toLocaleString('fa-IR')} تومان
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                    مبلغ پرداختی مستقیماً و بدون کسر کارمزد به حساب خیریه واریز می‌شود.
                </p>

                <button 
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold shadow-lg shadow-sky-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                    {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        'تایید و پرداخت مستقیم'
                    )}
                </button>
                
                <button onClick={onClose} className="mt-4 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    انصراف
                </button>
            </div>
        )}

        {view === 'success' && (
            <div className="relative p-8 text-center flex flex-col items-center justify-center min-h-[400px] overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-indigo-600"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                
                {/* Content */}
                <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl w-full animate-bounce-in">
                    <div className="mb-4 flex justify-center">
                        <HeartIcon />
                    </div>
                    
                    <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">
                        سفارش ثبت شد! 🚚
                    </h2>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        کمک شما برای <strong>{initialItem.name}</strong> با موفقیت دریافت شد.
                    </p>

                    <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800 rounded-lg p-3 mb-6">
                        <p className="text-xs text-sky-700 dark:text-sky-300">
                            دل {randomKidName} کوچولو رو شاد کردید.
                        </p>
                    </div>

                    <button onClick={onClose} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity">
                        بستن و ادامه
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default CharityMicroDonationModal;
