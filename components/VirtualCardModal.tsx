
import React, { useState, useEffect, useCallback } from 'react';
import { VirtualCard } from '../types';

// Icons
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-1 text-violet-500" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>;

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

interface VirtualCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: VirtualCard | null;
  onExpire: (cardId: string) => void;
}

const VirtualCardModal: React.FC<VirtualCardModalProps> = ({ isOpen, onClose, card, onExpire }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (isOpen && card) {
      setTimeout(() => setIsExpired(false), 0);
      
      const calculateTimeLeft = () => {
          const now = Date.now();
          const remaining = Math.round((card.expiresAt - now) / 1000);
          return remaining > 0 ? remaining : 0;
      };

      setTimeLeft(calculateTimeLeft());

      const timer = setInterval(() => {
        const remaining = calculateTimeLeft();
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
          setIsExpired(true);
          onExpire(card.id);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, card, onExpire]);

  const handleCopy = useCallback((field: string, value: string) => {
    navigator.clipboard.writeText(value.replace(/\s/g, '')); // Copy without spaces for card number
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  }, []);

  if (!isOpen || !card) return null;

  const cardDetails = card;
  const descriptionText = card.description.startsWith('ایجاد کارت مجازی برای خرید هدیه')
    ? `از اطلاعات زیر برای تکمیل خرید خود در سایت فروشنده استفاده کنید.`
    : `این کارت با مبلغ ${card.amount.toLocaleString('fa-IR')} تومان از کیف پول شما ایجاد شده است.`;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">کارت بانکی مجازی شما</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">{descriptionText}</p>

        <div className={`space-y-4 ${isExpired ? 'opacity-50' : ''}`}>
          <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">شماره کارت</label>
            <div className="flex items-center justify-between">
              <span className="text-lg font-mono font-semibold text-slate-800 dark:text-slate-100 tracking-wider">{cardDetails.number}</span>
              <button disabled={isExpired} onClick={() => handleCopy('number', cardDetails.number)} className={`flex-shrink-0 flex items-center justify-center w-24 px-3 py-1.5 rounded-md font-semibold text-white text-xs transition-colors ${copiedField === 'number' ? 'bg-teal-500' : 'bg-slate-500 hover:bg-slate-600'} disabled:bg-slate-400`}>
                {copiedField === 'number' ? <CheckIcon /> : <CopyIcon />}<span className="mr-1.5">{copiedField === 'number' ? 'کپی شد' : 'کپی'}</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">CVV2</label>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-mono font-semibold text-slate-800 dark:text-slate-100">{cardDetails.cvv}</span>
                    <button disabled={isExpired} onClick={() => handleCopy('cvv', cardDetails.cvv)} className={`flex-shrink-0 flex items-center justify-center w-24 px-3 py-1.5 rounded-md font-semibold text-white text-xs transition-colors ${copiedField === 'cvv' ? 'bg-teal-500' : 'bg-slate-500 hover:bg-slate-600'} disabled:bg-slate-400`}>
                        {copiedField === 'cvv' ? <CheckIcon /> : <CopyIcon />}<span className="mr-1.5">{copiedField === 'cvv' ? 'کپی شد' : 'کپی'}</span>
                    </button>
                </div>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">تاریخ انقضا</label>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-mono font-semibold text-slate-800 dark:text-slate-100">{cardDetails.expiry}</span>
                     <button disabled={isExpired} onClick={() => handleCopy('expiry', cardDetails.expiry)} className={`flex-shrink-0 flex items-center justify-center w-24 px-3 py-1.5 rounded-md font-semibold text-white text-xs transition-colors ${copiedField === 'expiry' ? 'bg-teal-500' : 'bg-slate-500 hover:bg-slate-600'} disabled:bg-slate-400`}>
                        {copiedField === 'expiry' ? <CheckIcon /> : <CopyIcon />}<span className="mr-1.5">{copiedField === 'expiry' ? 'کپی شد' : 'کپی'}</span>
                    </button>
                </div>
            </div>
          </div>
        </div>

        <div className={`mt-6 text-center p-3 rounded-md text-sm font-semibold flex flex-col gap-1 ${!isExpired ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-200' : 'bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-300'}`}>
            <span>
                {isExpired ? 'این کارت منقضی شده است. مبلغ به کیف پول شما بازگردانده شد.' : `این کارت در ${formatTime(timeLeft ?? 0)} منقضی می‌شود.`}
            </span>
            {!isExpired && (
                <span className="text-xs font-normal flex items-center justify-center gap-1 mt-1">
                    <WalletIcon />
                    این کارت در بخش <strong>"کیف پول"</strong> قابل مشاهده است.
                </span>
            )}
        </div>

        <div className="flex justify-center mt-8">
            <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-slate-100 text-slate-700 rounded-md font-semibold hover:bg-slate-200 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 transition-colors"
            >
                بستن
            </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualCardModal;
