
import React, { useState, useEffect, useMemo } from 'react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: any) => void;
}

// Fixed: Use React.FC to allow React built-in props like 'key' when using in maps
const StarIcon: React.FC<{ filled: boolean; onClick?: () => void }> = ({ filled, onClick }) => (
    <div 
        className={`p-1 transition-all transform ${filled ? 'text-yellow-400 drop-shadow-md' : 'text-slate-300 dark:text-slate-700'}`}
        onClick={onClick}
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    </div>
);

// Fixed: Use React.FC for consistent prop typing
const CriteriaSlider: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
    <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all hover:border-rose-200 group">
        <div className="flex justify-between items-center px-1">
            <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter group-hover:text-rose-600 transition-colors">{label}</span>
            <span className="text-[11px] text-rose-600 dark:text-rose-400 font-black bg-rose-50 dark:bg-rose-900/30 px-2.5 py-0.5 rounded-full">{value} / ۵</span>
        </div>
        <div className="relative pt-1 px-1">
            <input 
                type="range"
                min="1"
                max="5"
                step="1"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between mt-1 px-0.5 text-[8px] font-black text-slate-400">
                <span>۱</span><span>۲</span><span>۳</span><span>۴</span><span>۵</span>
            </div>
        </div>
    </div>
);

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [comment, setComment] = useState('');
  const [criteria, setCriteria] = useState<{ [key: string]: number }>({
      punctuality: 5,
      authenticity: 5,
      fairPrice: 5,
      support: 5
  });

  // Calculate average rating dynamically based on criteria
  const calculatedRating = useMemo(() => {
      // Fix: Cast Object.values to number[] to ensure type safety for reduce and average calculations
      const values = Object.values(criteria) as number[];
      const sum = values.reduce((a, b) => a + b, 0);
      return Math.round(sum / values.length);
  }, [criteria]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({ rating: calculatedRating, comment, criteria });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center p-4 backdrop-blur-md" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3.5rem] overflow-hidden shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">ثبت تجربه و امتیاز</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-bold">با تغییر نوارهای پایین، امتیاز کلی به صورت خودکار محاسبه می‌شود.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[75vh] custom-scrollbar">
            {/* Visual Header with Calculated Stars */}
            <div className="flex flex-col items-center gap-4 bg-rose-50/30 dark:bg-rose-900/10 p-6 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30">
                <p className="text-sm font-black text-slate-800 dark:text-slate-200">امتیاز کلی محاسبه شده:</p>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                        <StarIcon key={s} filled={s <= calculatedRating} />
                    ))}
                </div>
                <div className="text-rose-600 font-black text-lg">{calculatedRating} از ۵</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CriteriaSlider label="وقت‌شناسی در ارسال" value={criteria.punctuality} onChange={v => setCriteria({...criteria, punctuality: v})} />
                <CriteriaSlider label="اصالت و کیفیت کالا" value={criteria.authenticity} onChange={v => setCriteria({...criteria, authenticity: v})} />
                <CriteriaSlider label="قیمت نسبت به رقبا" value={criteria.fairPrice} onChange={v => setCriteria({...criteria, fairPrice: v})} />
                <CriteriaSlider label="خدمات و پشتیبانی" value={criteria.support} onChange={v => setCriteria({...criteria, support: v})} />
            </div>

            <div className="space-y-3">
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mr-2">توضیحات و تجربه خرید شما (اختیاری)</label>
                <textarea 
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-base font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent min-h-[140px] resize-none placeholder:text-slate-400"
                    placeholder="جزئیات بیشتری از کیفیت کالا یا رفتار فروشنده بنویسید..."
                />
            </div>

            <div className="flex gap-4 pt-4 sticky bottom-0 bg-white dark:bg-slate-900 py-4">
                <button type="button" onClick={onClose} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-3xl font-black text-lg hover:bg-slate-200 transition-all">انصراف</button>
                <button type="submit" className="flex-[2] py-5 bg-rose-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-rose-500/30 transform active:scale-95 transition-all">ثبت نهایی تجربه</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
