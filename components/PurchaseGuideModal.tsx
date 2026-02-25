
import React from 'react';
import { WishlistItem } from '../types';

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
);
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const BankIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
    </svg>
);

interface PurchaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WishlistItem | null;
  walletBalance: number;
  onGenerateVirtualCard: (item: WishlistItem) => void; // Keeping prop for compatibility but functionality changed
}

const PurchaseGuideModal: React.FC<PurchaseGuideModalProps> = ({ isOpen, onClose, item, walletBalance }) => {
  if (!isOpen || !item) return null;
  
  const hasLink = item.link && item.link.trim() !== '';

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
            <CheckCircleIcon />
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">هدیه تأمین شد! 🎉</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 font-medium">
              مبلغ جمع‌آوری شده برای <span className="text-violet-600 dark:text-violet-400 font-bold">«{item.name}»</span> اکنون در کیف پول شماست.
            </p>
        </div>

        {/* Info Box */}
        <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 mb-8 text-sm text-right">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 border-b border-slate-200 dark:border-slate-600 pb-2">مراحل بعدی چیست؟</h3>
            <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">۱</span>
                    <span>به بخش <strong>کیف پول</strong> بروید.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">۲</span>
                    <span>گزینه <strong>برداشت وجه</strong> را انتخاب کنید.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">۳</span>
                    <span>مبلغ هدیه به حساب بانکی شما واریز می‌شود تا بتوانید کالا را خریداری کنید.</span>
                </li>
            </ul>
        </div>
        
        <div className="flex flex-col gap-3">
            {hasLink && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20">
                    <ExternalLinkIcon/>
                    مشاهده و خرید محصول (از فروشگاه)
                </a>
            )}
            
            <button
                type="button"
                onClick={onClose}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold transition-colors ${hasLink ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600' : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90'}`}
            >
                {hasLink ? 'بستن' : 'متوجه شدم، می‌روم به کیف پول'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseGuideModal;
