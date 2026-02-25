
import React from 'react';
import { MicroItem, User } from '../types';

interface NazarShadiModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MicroItem[];
  onItemClick: (item: MicroItem) => void;
  allUsers: User[];
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const VerifiedTick = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
    </svg>
);

const NazarShadiModal: React.FC<NazarShadiModalProps> = ({ isOpen, onClose, items, onItemClick, allUsers }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* Header Image */}
        <div className="relative h-48 bg-sky-600">
            {/* High Quality Background for Smile Share */}
            <img 
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&q=80" 
                alt="Sahm-e Labkhand" 
                className="w-full h-full object-cover"
            />
            {/* Deep overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
            
            <button onClick={onClose} className="absolute top-5 right-5 p-2.5 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors backdrop-blur-md border border-white/10 z-30">
                <CloseIcon />
            </button>
            
            <div className="absolute bottom-6 right-8 text-white z-20 animate-fade-in-up">
                <h2 className="text-3xl font-black mb-1 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center gap-3">
                    <span className="text-4xl">🍦</span> سهم لبخند
                </h2>
                <p className="text-sm font-bold opacity-90 drop-shadow-md">همین حالا با مبالغ کوچک دل‌ها را شاد کنید.</p>
            </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900/50">
            <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-[0.2em] px-1 border-r-4 border-sky-500 pr-3">مشارکت فوری در مهربانی</h3>
            
            {items.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-4">
                    {items.map(item => {
                        const charity = allUsers.find(u => u.id === item.charityId);
                        return (
                            <div 
                                key={item.id}
                                onClick={() => onItemClick(item)}
                                className="relative p-4 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 cursor-pointer hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-2xl hover:-translate-y-1.5 transition-all flex flex-col items-center gap-2 group overflow-hidden"
                            >
                                {item.is_urgent && (
                                    <div className="absolute top-0 left-0 bg-red-500 text-white text-[8px] font-black px-3 py-1 rounded-bl-2xl shadow-md z-10 animate-pulse">
                                        ضروری
                                    </div>
                                )}
                                <span className="text-4xl group-hover:scale-125 transition-transform duration-500">{item.icon}</span>
                                <div className="text-center w-full">
                                    <span className="block font-black text-slate-800 dark:text-slate-100 text-[11px] truncate mb-0.5">{item.name}</span>
                                    
                                    <div className="flex items-center justify-center gap-1 mb-2">
                                        <span className="text-[8px] text-indigo-600 dark:text-indigo-400 font-bold truncate max-w-[50px]">{charity?.name || 'خیریه'}</span>
                                        <VerifiedTick />
                                    </div>

                                    <div className={`inline-block px-3 py-1 rounded-xl text-[10px] font-black ${item.color} bg-opacity-20 shadow-sm`}>
                                        {item.price.toLocaleString('fa-IR')} ت
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16 text-slate-400">
                    <p className="font-bold">در حال حاضر موردی ثبت نشده است.</p>
                </div>
            )}
        </div>
        
        <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] font-bold text-slate-400 leading-relaxed max-w-xs mx-auto">
                تمامی واریزی‌ها به صورت آنی و مستقیم به حساب موسسات خیریه همکار واریز می‌گردد.
            </p>
        </div>

      </div>
    </div>
  );
};

export default NazarShadiModal;
