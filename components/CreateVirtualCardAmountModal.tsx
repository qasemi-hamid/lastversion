
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface CreateVirtualCardAmountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  maxAmount: number;
  currentUser: User | null;
}

const formatPrice = (price?: number) => {
    if (typeof price !== 'number') return '';
    return price.toLocaleString('fa-IR');
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CreateVirtualCardAmountModal: React.FC<CreateVirtualCardAmountModalProps> = ({ isOpen, onClose, onConfirm, maxAmount, currentUser }) => {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');
  const [view, setView] = useState<'amount' | 'otp'>('amount');
  
  // OTP States
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
      if (isOpen) {
          setTimeout(() => {
              setAmount(0);
              setError('');
              setView('amount');
              setOtpInput('');
              setOtpSent(false);
          }, 0);
      }
  }, [isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleAmountChange = (newAmount: number) => {
    if (newAmount > maxAmount) {
      setError(`مبلغ نمی‌تواند بیشتر از موجودی کیف پول (${formatPrice(maxAmount)} تومان) باشد.`);
      setAmount(maxAmount);
    } else if (newAmount < 0) {
        setError('مبلغ نمی‌تواند منفی باشد.');
        setAmount(0);
    } else {
      setError('');
      setAmount(newAmount);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser.isMobileVerified) {
        setError('برای ساخت کارت مجازی، ابتدا باید شماره موبایل خود را در تنظیمات تأیید کنید.');
        return;
    }

    if (amount > 10000 && amount <= maxAmount) {
        setView('otp');
    } else if (amount <= 10000) {
        setError('حداقل مبلغ برای ایجاد کارت ۱۰۰۰۰ تومان است.');
    }
  };

  const sendOtp = () => {
      // Hardcoded for testing
      const code = "11111";
      setGeneratedOtp(code);
      setOtpSent(true);
      alert(`[شبیه‌سازی پیامک]\nکد تایید ساخت کارت: ${code}\n\nاین کد برای شماره ${currentUser.mobile} ارسال شد.`);
  };

  const handleConfirmOtp = (e: React.FormEvent) => {
      e.preventDefault();
      if (otpInput === generatedOtp) {
          onConfirm(amount);
      } else {
          setError('کد تایید نادرست است.');
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        
        {view === 'amount' ? (
            <>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">ایجاد کارت مجازی</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">مبلغی که می‌خواهید به کارت مجازی منتقل شود را وارد کنید. این مبلغ از کیف پول شما کسر خواهد شد.</p>
                
                <form onSubmit={handleNext}>
                <div className="mb-4">
                    <label htmlFor="card-amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    مبلغ کارت (تومان)
                    </label>
                    <input
                        type="number"
                        id="card-amount"
                        value={amount === 0 ? '' : amount}
                        onChange={(e) => handleAmountChange(Number(e.target.value))}
                        className="w-full text-center text-2xl font-bold p-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        placeholder="0"
                        min="10000"
                        max={maxAmount}
                        autoFocus
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">موجودی کیف پول شما: {formatPrice(maxAmount)} تومان</p>
                </div>
                
                {error && <p className="text-red-500 text-xs mb-4 font-bold bg-red-50 dark:bg-red-900/10 p-2 rounded">{error}</p>}
                
                <div className="flex justify-end gap-3 mt-6">
                    <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md font-semibold hover:bg-slate-200 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 transition-colors"
                    >
                    انصراف
                    </button>
                    <button
                    type="submit"
                    disabled={amount <= 10000 || amount > maxAmount}
                    className="px-4 py-2 bg-rose-500 text-white rounded-md font-semibold hover:bg-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 dark:focus:ring-offset-slate-800 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                    ادامه
                    </button>
                </div>
                </form>
            </>
        ) : (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">تأیید امنیتی</h2>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 text-center">
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                        برای صدور کارت به مبلغ <strong>{formatPrice(amount)} تومان</strong>، کد تایید پیامک شده به شماره <strong>{currentUser.mobile}</strong> را وارد کنید.
                    </p>
                </div>

                {!otpSent ? (
                    <button 
                        onClick={sendOtp}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md"
                    >
                        ارسال کد تایید
                    </button>
                ) : (
                    <form onSubmit={handleConfirmOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2 text-center">کد تایید</label>
                            <input 
                                type="text" 
                                value={otpInput}
                                onChange={e => { setOtpInput(e.target.value); setError(''); }}
                                className="w-full px-4 py-3 text-center text-2xl tracking-widest bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="_ _ _ _ _"
                                maxLength={5}
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
                        <button 
                            type="submit"
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors shadow-md"
                        >
                            تأیید و صدور کارت
                        </button>
                    </form>
                )}
                
                <button onClick={() => setView('amount')} className="w-full text-sm text-slate-500 mt-4 hover:underline">بازگشت</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CreateVirtualCardAmountModal;
