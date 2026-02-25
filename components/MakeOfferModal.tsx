
import React, { useState } from 'react';
import { WishlistItem } from '../types';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WishlistItem | null;
  onConfirm: (price: number, description: string) => Promise<void>;
}

const formatPrice = (price?: number) => price?.toLocaleString('fa-IR') + ' ت';

const MakeOfferModal: React.FC<MakeOfferModalProps> = ({ isOpen, onClose, item, onConfirm }) => {
  const [offerPrice, setOfferPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerPrice) return;
    setIsSubmitting(true);
    try {
        await onConfirm(Number(offerPrice), desc);
        onClose();
    } catch (err) {
        alert('خطا در ثبت پیشنهاد');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">ثبت پیشنهاد فروش مستقیم</h2>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Merchant Response Console</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-700 overflow-hidden flex-shrink-0 shadow-sm">
                    {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center opacity-20 text-3xl">🎁</div>}
                </div>
                <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">قیمت پایه کاربر: {formatPrice(item.price)}</p>
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase mr-1">قیمت پیشنهادی نهایی (تومان)</label>
                <input 
                    type="number" 
                    required
                    value={offerPrice}
                    onChange={e => setOfferPrice(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-black text-lg outline-none transition-all placeholder:text-slate-300"
                    placeholder="مثلاً: ۱,۲۰۰,۰۰۰"
                    disabled={isSubmitting}
                />
            </div>

            <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase mr-1">توضیحات تکمیلی (ارسال رایگان، کادو پیچ و ...)</label>
                <textarea 
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    rows={3}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold text-xs outline-none transition-all resize-none"
                    placeholder="پیام شما برای خریدار..."
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-xs hover:bg-slate-200 transition-colors">انصراف</button>
                <button 
                    type="submit" 
                    disabled={isSubmitting || !offerPrice} 
                    className={`flex-[2] py-4 rounded-2xl font-black text-xs shadow-xl transition-all flex justify-center items-center gap-2 ${
                        isSubmitting 
                        ? 'bg-indigo-400 cursor-not-allowed text-white/70' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20 active:scale-95'
                    }`}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>در حال ارسال...</span>
                        </>
                    ) : (
                        'تایید و ارسال پیشنهاد'
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default MakeOfferModal;
