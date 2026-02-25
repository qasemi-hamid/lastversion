
import React, { useState, useEffect, useMemo } from 'react';
import { WishlistItem, User } from '../types';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WishlistItem | null;
  onConfirmAmount: (amount: number, isAnonymous: boolean) => void;
  isCharity?: boolean;
}

const formatPrice = (price?: number) => {
    if (typeof price !== 'number') return '';
    return price.toLocaleString('fa-IR');
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

const ContributeModal: React.FC<ContributeModalProps> = ({ isOpen, onClose, item, onConfirmAmount, isCharity = false }) => {
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { totalContributed, remainingAmount } = useMemo(() => {
    if (!item) return { totalContributed: 0, remainingAmount: 0 };
    const total = item.contributions.reduce((sum, c) => sum + c.amount, 0);
    return {
      totalContributed: total,
      remainingAmount: (item.price || 0) - total,
    };
  }, [item]);

  useEffect(() => {
    if (isOpen) {
      setAmount(0);
      setError('');
      setIsAnonymous(false);
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const quickAmounts = [50000, 100000, 200000, 500000];

  const handleAmountChange = (val: number) => {
    if (val > remainingAmount) {
        setAmount(remainingAmount);
        setError('مبلغ نمی‌تواند بیشتر از باقیمانده هدیه باشد.');
    } else {
        setAmount(val);
        setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError('لطفاً مبلغی را وارد کنید.');
      return;
    }
    onConfirmAmount(amount, isAnonymous);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in" onClick={(e) => e.stopPropagation()}>
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">مشارکت در خرید هدیه</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="p-6">
            <div className="flex items-center gap-4 mb-6 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-100 dark:border-violet-800">
                <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 overflow-hidden flex-shrink-0 shadow-sm">
                    {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} /> : <div className="w-full h-full flex items-center justify-center text-2xl">🎁</div>}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">باقیمانده: <span className="font-bold text-violet-600 dark:text-violet-400">{formatPrice(remainingAmount)} تومان</span></p>
                </div>
            </div>

            {/* Social Proof: Previous Contributors */}
            {item.contributions.length > 0 && (
                <div className="mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <HeartIcon /> همراهان این هدیه
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {item.contributions.map((c, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                                <UserIcon />
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                    {c.userId === 'anonymous' ? 'ناشناس' : 'دوست شما'}
                                </span>
                                <span className="text-[9px] text-slate-400">{formatPrice(c.amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 text-center">مبلغ مشارکت شما (تومان)</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount || ''}
                            onChange={(e) => handleAmountChange(Number(e.target.value))}
                            className="w-full text-center text-3xl font-black p-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-violet-500/20 transition-all text-slate-800 dark:text-white"
                            placeholder="۰"
                            max={remainingAmount}
                        />
                    </div>
                    
                    {/* Quick Select Buttons */}
                    <div className="grid grid-cols-4 gap-2 mt-3">
                        {quickAmounts.map(q => (
                            <button 
                                key={q}
                                type="button"
                                onClick={() => handleAmountChange(q)}
                                disabled={q > remainingAmount}
                                className={`py-2 text-[10px] font-bold rounded-xl border transition-all ${amount === q ? 'bg-violet-600 border-violet-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-violet-300'} disabled:opacity-30 disabled:grayscale`}
                            >
                                {q / 1000}K
                            </button>
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-xs mt-2 text-center font-bold">{error}</p>}
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setIsAnonymous(!isAnonymous)}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isAnonymous ? 'bg-slate-800 text-white' : 'bg-white dark:bg-slate-700 text-slate-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.666-.105 2.454-.303z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-slate-700 dark:text-white">مشارکت به صورت ناشناس</p>
                        <p className="text-[10px] text-slate-500">نام شما در لیست همراهان هدیه نمایش داده نمی‌شود.</p>
                    </div>
                    <input type="checkbox" checked={isAnonymous} onChange={() => {}} className="h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 pointer-events-none" />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={amount <= 0 || amount > remainingAmount}
                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-violet-500/30 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                    >
                        تایید و انتقال به درگاه
                    </button>
                    <p className="text-[10px] text-slate-400 text-center mt-4 leading-relaxed">
                        با تایید این فرم، شما به درگاه امن بانکی هدایت می‌شوید. مبلغ پرداختی شما توسط گیفتی‌نو (به عنوان واسط) مستقیماً صرف تامین این هدیه خواهد شد.
                    </p>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ContributeModal;
