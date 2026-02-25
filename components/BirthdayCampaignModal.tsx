
import React, { useState, useEffect } from 'react';
import { User, Product } from '../types';

interface BirthdayCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateBirthday: (date: string) => void;
  products: Product[]; // List of potential discount products
}

// Icons
const CakeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-500 mb-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.48 3.5 3.5 0 011.791 2.606 3.7 3.7 0 011.299-.658 3.5 3.5 0 013.583.443A3.7 3.7 0 0113.5 15.317V19a2 2 0 104 0v-3.683a3.7 3.7 0 011.055.48 3.5 3.5 0 011.791 2.606 3.7 3.7 0 011.299-.658 3.5 3.5 0 013.583.443 3.7 3.7 0 01.358-1.536V12a2 2 0 00-2-2V9a2 2 0 00-2-2v1a2 2 0 00-2 2V6a2 2 0 00-2-2V3a1 1 0 00-2 0v3zM6 13.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" /></svg>;
const LockClosedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H3a2 2 0 01-2-2v-5a2 2 0 012-2h2zm4-2a3 3 0 00-3 3v2h6V9a3 3 0 00-3-3z" clipRule="evenodd" /></svg>;
const ConfettiBg = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-10 left-1/2 w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-200"></div>
        <div className="absolute top-5 right-1/4 w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></div>
    </div>
);

const BirthdayCampaignModal: React.FC<BirthdayCampaignModalProps> = ({ isOpen, onClose, currentUser, onUpdateBirthday, products }) => {
  const [view, setView] = useState<'input' | 'countdown' | 'celebrate'>('input');
  const [daysLeft, setDaysLeft] = useState(0);
  const [bdayInput, setBdayInput] = useState('');

  const checkBirthday = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    const currentYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    // Check if today is the birthday (ignore time)
    if (today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate()) {
        setView('celebrate');
    } else {
        if (currentYearBirthday < today) {
            currentYearBirthday.setFullYear(today.getFullYear() + 1);
        }
        const diffTime = Math.abs(currentYearBirthday.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        setDaysLeft(diffDays);
        setView('countdown');
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (!currentUser.birthday) {
        setTimeout(() => setView('input'), 0);
      } else {
        setTimeout(() => checkBirthday(currentUser.birthday), 0);
      }
    }
  }, [isOpen, currentUser.birthday]);

  const handleSaveBirthday = () => {
      if(!bdayInput) return;
      // Simple validation or conversion could happen here
      onUpdateBirthday(bdayInput);
      checkBirthday(bdayInput);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
        
        {view === 'input' && (
            <div className="p-8 text-center">
                <CakeIcon />
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">تولدت کی هست؟</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    تاریخ تولدت رو ثبت کن تا در روز تولدت، هدایا و تخفیف‌های ویژه‌ای از فروشگاه‌ها دریافت کنی!
                </p>
                
                <div className="mb-4 text-left">
                    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">تاریخ تولد</label>
                    <input 
                        type="date" 
                        className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-800 dark:text-white text-center font-bold"
                        value={bdayInput}
                        onChange={e => setBdayInput(e.target.value)}
                    />
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-xs text-amber-700 dark:text-amber-400 mb-6 flex items-start gap-2 text-right">
                    <LockClosedIcon />
                    <span>توجه: تاریخ تولد پس از ثبت، دیگر قابل تغییر نخواهد بود. لطفاً دقت کنید.</span>
                </div>

                <button 
                    onClick={handleSaveBirthday}
                    disabled={!bdayInput}
                    className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-fuchsia-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ثبت و دریافت هدیه
                </button>
            </div>
        )}

        {view === 'countdown' && (
            <div className="p-8 text-center bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-slate-900 dark:to-slate-800">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">روزهای باقیمانده تا تولد شما</h2>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-2">
                    {daysLeft}
                </div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8">روز</p>
                
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    ما منتظر روز تولدت هستیم! <br/>
                    در روز تولدت به همین کارت سر بزن تا سورپرایزهای ویژه‌ای که فروشگاه‌ها برات دارن رو ببینی.
                </p>
                
                <button onClick={onClose} className="w-full py-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-bold border border-slate-200 dark:border-slate-600">
                    باشه، منتظرم!
                </button>
            </div>
        )}

        {view === 'celebrate' && (
            <div className="relative">
                <ConfettiBg />
                <div className="p-6 text-center bg-gradient-to-b from-fuchsia-600 to-violet-800 text-white">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-xl border-4 border-white/30">
                        🎂
                    </div>
                    <h2 className="text-2xl font-black mb-2 drop-shadow-md">تولدت مبارک!</h2>
                    <p className="text-sm opacity-90 mb-6">
                        امروز روز توست! این هم کادوهای ما و فروشگاه‌ها برای تو:
                    </p>
                </div>
                
                <div className="p-4 bg-white dark:bg-slate-900 max-h-72 overflow-y-auto">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">🎁 پیشنهادات اختصاصی امروز</h3>
                    <div className="space-y-3">
                        {products.slice(0, 3).map(p => (
                            <div key={p.id} className="flex gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                    {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" /> : null}
                                </div>
                                <div className="flex-1 text-right">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">{p.name}</h4>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-xs text-slate-400 line-through decoration-red-500">{p.price.toLocaleString('fa-IR')}</span>
                                        <span className="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400">
                                            {Math.round(p.price * 0.8).toLocaleString('fa-IR')} ت
                                        </span>
                                    </div>
                                </div>
                                <button className="self-center px-3 py-1.5 bg-fuchsia-600 text-white text-[10px] font-bold rounded-lg shadow-sm">
                                    خرید
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                     <button onClick={onClose} className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl font-bold">
                        ممنون!
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default BirthdayCampaignModal;
