
import React, { useMemo, useState, useEffect } from 'react';
import { WishlistItem, User } from '../types';
import * as api from '../services/api';

const formatPrice = (price?: number) => {
    if (typeof price !== 'number') return '';
    return price.toLocaleString('fa-IR');
}

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-500 dark:border-slate-400"></div>
);

const UserGroupIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
);

interface RecipientActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WishlistItem | null;
  currentUser: User | null;
  onSettle: (shaba?: string) => void;
  onComplete: (remainingAmount: number) => void;
  onVerifyRequest?: () => void;
  beneficiary?: { name: string; shaba?: string; isThirdParty: boolean }; // Passed from Wishlist
}

const toEnglishDigits = (str: string) => {
    return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
              .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
};

const RecipientActionModal: React.FC<RecipientActionModalProps> = ({ isOpen, onClose, item, currentUser, onSettle, onComplete, onVerifyRequest, beneficiary }) => {
  const [view, setView] = useState<'options' | 'withdraw'>('options');
  const [isThirdParty, setIsThirdParty] = useState(false); // New state for beneficiary deposit
  
  const [shaba, setShaba] = useState('');
  const [verifiedShabaName, setVerifiedShabaName] = useState<string | null>(null);
  const [isVerifyingShaba, setIsVerifyingShaba] = useState(false);
  const [shabaError, setShabaError] = useState<string | null>(null);

  const { totalContributed, remainingAmount } = useMemo(() => {
    if (!item || typeof item.price !== 'number') return { totalContributed: 0, remainingAmount: 0 };
    const total = item.contributions.reduce((sum, c) => sum + c.amount, 0);
    return {
      totalContributed: total,
      remainingAmount: item.price - total,
    };
  }, [item]);

  useEffect(() => {
    if (isOpen) {
      setView('options');
      
      // Auto-detect beneficiary mode from list settings
      if (beneficiary && beneficiary.isThirdParty) {
          setIsThirdParty(true);
          setShaba(beneficiary.shaba || '');
      } else {
          setIsThirdParty(false);
          setShaba(currentUser?.shaba || '');
      }
      
      setVerifiedShabaName(null);
      setShabaError(null);
      setIsVerifyingShaba(false);
    }
  }, [isOpen, currentUser, beneficiary]);
  
  const handleShabaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = toEnglishDigits(e.target.value).toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (val.length > 26) val = val.slice(0, 26);
      if (val.length > 0 && !val.startsWith('IR')) {
           if (/[0-9]/.test(val[0])) {
               val = 'IR' + val;
           }
      }
      setShaba(val);
  };

  useEffect(() => {
    const verify = async () => {
        if (shaba.length < 26) {
            setVerifiedShabaName(null);
            setShabaError(null);
            return;
        }
        setIsVerifyingShaba(true);
        setShabaError(null);
        try {
            const result = await api.verifyShaba(shaba);
            if (result) {
                setVerifiedShabaName(result.ownerName);
                // IF NOT Third Party: Enforce name match with Current User
                if (!isThirdParty && currentUser?.name && !result.ownerName.includes(currentUser.name) && !currentUser.name.includes(result.ownerName)) {
                     setShabaError('نام صاحب حساب با نام پروفایل شما مطابقت ندارد.');
                }
                // IF Third Party: If beneficiary name is defined, maybe warn if mismatch? (Simplified: Just show name)
            } else {
                setShabaError('شماره شبا نامعتبر است.');
                setVerifiedShabaName(null);
            }
        } catch (error) {
            setShabaError('خطا در استعلام شماره شبا.');
            setVerifiedShabaName(null);
        } finally {
            setIsVerifyingShaba(false);
        }
    };
    const handler = setTimeout(() => {
        verify();
    }, 500);
    return () => clearTimeout(handler);
  }, [shaba, currentUser, isThirdParty]);


  const handleCompleteClick = () => {
    onComplete(remainingAmount);
  };

  // Direct Settlement Logic: No explicit withdraw button needed if funds are auto-routed.
  // But we allow updating the Shaba for FUTURE transactions or showing current status.
  const handleUpdateShaba = () => {
      if (!shabaError && shaba.length >= 26) {
          onSettle(shaba); // This now just updates the user profile/list settings
          alert('شماره شبا برای واریزهای بعدی به‌روزرسانی شد.');
          onClose();
      }
  };

  const toggleThirdParty = () => {
      const newState = !isThirdParty;
      setIsThirdParty(newState);
      // Reset shaba input based on mode
      if (newState) {
          // If switching TO third party, check if list has saved beneficiary info
          if (beneficiary && beneficiary.isThirdParty && beneficiary.shaba) {
              setShaba(beneficiary.shaba);
          } else {
              setShaba('');
          }
          setVerifiedShabaName(null);
      } else {
          // Switching back to SELF
          setShaba(currentUser?.shaba || '');
      }
      setShabaError(null);
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">مدیریت هدیه گروهی</h2>
        <p className="text-lg font-semibold text-violet-600 dark:text-violet-400 mb-2">{item.name}</p>
        
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg mb-6 text-sm space-y-2">
            <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">مبلغ جمع‌آوری شده:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{formatPrice(totalContributed)} تومان</span>
            </div>
            {view === 'options' && (
                <>
                    <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">مبلغ هدف:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{formatPrice(item.price)} تومان</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 dark:border-slate-600 pt-2">
                        <span className="text-slate-600 dark:text-slate-300">باقیمانده:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{formatPrice(remainingAmount)} تومان</span>
                    </div>
                    <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 p-2 rounded text-center">
                        وضعیت: تسویه خودکار (Direct). مبالغ بلافاصله پس از پرداخت به شماره شبای ثبت شده واریز می‌شوند.
                    </div>
                </>
            )}
        </div>

        {view === 'options' && (
            <div className="space-y-3">
                <button 
                    onClick={handleCompleteClick}
                    className="w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center"
                >
                    پرداخت باقیمانده و تکمیل خرید
                </button>
                
                {currentUser?.isMobileVerified ? (
                    <button 
                        onClick={() => setView('withdraw')}
                        className="w-full py-3 px-4 bg-white border-2 border-violet-500 text-violet-600 rounded-lg font-semibold hover:bg-violet-50 dark:bg-slate-800 dark:text-violet-400 dark:hover:bg-slate-700 transition-colors"
                    >
                        تغییر شماره شبا (مقصد واریز)
                    </button>
                ) : (
                    <button 
                        onClick={() => onVerifyRequest && onVerifyRequest()}
                        className="w-full py-3 px-4 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors shadow-md animate-pulse"
                    >
                        تایید هویت (الزامی برای تغییر شبا)
                    </button>
                )}
            </div>
        )}

        {view === 'withdraw' && (
            <div className="space-y-4">
                 
                 {/* Third Party Toggle */}
                 <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                     <button
                        onClick={() => { if(isThirdParty) toggleThirdParty() }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${!isThirdParty ? 'bg-white dark:bg-slate-600 shadow text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                     >
                         حساب خودم
                     </button>
                     <button
                        onClick={() => { if(!isThirdParty) toggleThirdParty() }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 ${isThirdParty ? 'bg-white dark:bg-slate-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}
                     >
                         <UserGroupIcon /> حساب ذینفع (همکار)
                     </button>
                 </div>

                 <div>
                    <label htmlFor="shaba" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {isThirdParty 
                            ? `شماره شبا ذینفع: ${beneficiary?.name || 'تعیین نشده'}` 
                            : `شماره شبا مقصد (به نام ${currentUser?.name})`}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="shaba"
                            value={shaba}
                            onChange={handleShabaChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-left font-mono tracking-wider ${shabaError ? 'border-red-500' : (shaba.length === 26 ? 'border-green-500' : 'border-slate-300 dark:border-slate-600')}`}
                            placeholder="IR00 0000 0000 0000 0000 0000 00"
                            dir="ltr"
                            maxLength={26}
                        />
                        <div className={`absolute right-3 top-2.5 text-xs font-mono font-bold ${shaba.length === 26 ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                            {shaba.length} / 26
                        </div>
                    </div>
                    {isVerifyingShaba && <div className="mt-2 flex items-center gap-2 text-xs text-slate-500"><LoadingSpinner /> در حال استعلام...</div>}
                    {verifiedShabaName && <p className="text-xs text-green-600 mt-1 font-bold">صاحب حساب تایید شده: {verifiedShabaName}</p>}
                    {shabaError && <p className="text-xs text-red-500 mt-1 font-bold">{shabaError}</p>}
                </div>

                <div className={`mt-4 p-3 rounded-md border text-center ${isThirdParty ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200' : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-200'}`}>
                    <p className="text-xs leading-relaxed">
                        توجه: در سیستم پرداخت جدید، واریزها به صورت آنی و مستقیم (تسهیم) به این شماره شبا انجام می‌شود. گیفتی‌نو هیچ مبلغی را در کیف پول نگهداری نمی‌کند.
                    </p>
                </div>

                <div className="flex gap-3 pt-4">
                    <button 
                        onClick={() => setView('options')}
                        className="flex-1 py-2 px-4 bg-slate-100 text-slate-700 rounded-md font-semibold hover:bg-slate-200 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 transition-colors"
                    >
                        بازگشت
                    </button>
                    <button 
                        onClick={handleUpdateShaba}
                        disabled={!!shabaError || !verifiedShabaName || shaba.length !== 26}
                        className="flex-1 py-2 px-4 bg-violet-600 text-white rounded-md font-semibold hover:bg-violet-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed dark:disabled:bg-slate-600"
                    >
                        ذخیره تغییرات
                    </button>
                </div>
            </div>
        )}
        
        {view === 'options' && (
             <div className="mt-6 text-center">
                <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                    بستن
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default RecipientActionModal;
