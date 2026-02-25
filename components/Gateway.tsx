
import React, { useState } from 'react';
import { ProfileType } from '../types';

// --- Apple Style Icon Wrapper ---
const AppleIconWrapper = ({ 
    children, 
    gradient, 
    shadowColor 
}: { 
    children?: React.ReactNode; 
    gradient: string; 
    shadowColor: string; 
}) => (
    <div className={`relative group mb-5 w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0`}>
        {/* Glow Effect */}
        <div className={`absolute inset-2 rounded-[1.5rem] opacity-40 blur-xl transition-all duration-500 group-hover:opacity-70 ${shadowColor}`}></div>
        
        {/* Main Icon Shape (Squircle) */}
        <div className={`relative w-full h-full rounded-[1.5rem] bg-gradient-to-br ${gradient} shadow-md flex items-center justify-center border-t border-white/20 transition-transform duration-300 group-hover:scale-105 group-active:scale-95`}>
            {/* Inner Gloss */}
            <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>
            
            {/* Icon SVG */}
            <div className="text-white drop-shadow-md transform transition-transform duration-300 group-hover:rotate-3 scale-90 sm:scale-100">
                {children}
            </div>
        </div>
    </div>
);

const PersonalIcon = () => (
    <AppleIconWrapper gradient="from-violet-500 via-purple-500 to-indigo-600" shadowColor="bg-violet-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
    </AppleIconWrapper>
);

const AllForOneIcon = () => (
    <AppleIconWrapper gradient="from-fuchsia-500 via-pink-500 to-rose-600" shadowColor="bg-fuchsia-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
    </AppleIconWrapper>
);

const CrowdfundingIcon = () => (
    <AppleIconWrapper gradient="from-teal-400 via-emerald-500 to-green-600" shadowColor="bg-emerald-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.24 8.905 15 9.375c1.611.996 3.25 2.198 3.25 3.96 0 1.272-.733 2.112-1.923 2.529a10.05 10.05 0 01-.26.852c-.672 1.876-2.923 3.034-4.872 2.915-1.428-.087-2.67-.822-3.32-1.969-.283-.499-.92-.62-1.37-.279-1.259.954-2.84 1.258-4.237 1.09-1.572-.189-2.935-1.127-3.618-2.483l-.715-1.42a1.125 1.125 0 011.006-1.631c.677 0 1.353-.023 2.025-.069.972-.066 1.693-.933 1.583-1.906l-.234-2.102a2.023 2.023 0 011.66-2.228 17.587 17.587 0 013.368-.063c.277.027.502-.179.529-.456l.169-1.688a1.875 1.875 0 011.875-1.688h.375z" />
        </svg>
    </AppleIconWrapper>
);

const TravelIcon = () => (
    <AppleIconWrapper gradient="from-orange-400 via-amber-500 to-yellow-600" shadowColor="bg-orange-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
    </AppleIconWrapper>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);


interface GatewayProps {
    onSelectProfile: (type: ProfileType) => void;
    onGoBackToLanding: () => void;
}

const Gateway: React.FC<GatewayProps> = ({ onSelectProfile, onGoBackToLanding }) => {
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 text-center relative overflow-y-auto font-sans">
        <button 
            onClick={onGoBackToLanding}
            className="absolute top-6 left-6 flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-2xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
        >
            <BackIcon/>
            بازگشت
        </button>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white mb-4 mt-16 md:mt-0 tracking-tight">انتخاب مسیر شما</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-12 max-w-2xl font-medium">
            هدف شما از حضور در گیفتی‌نو چیست؟
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-4 pb-12 justify-center">
            
            <button onClick={() => onSelectProfile('personal')} className="group flex flex-col items-center p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-md">پیشنهادی</div>
                <PersonalIcon />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">پنل شخصی</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    مدیریت آرزوها، لیست‌های تولد و دریافت هدیه از دوستان.
                </p>
            </button>

            <button onClick={() => onSelectProfile('all-for-one')} className="group flex flex-col items-center p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 dark:border-slate-700/50">
                <AllForOneIcon />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">همه برای یکی (دنگ)</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    جمع‌آوری گروهی پول برای خرید هدیه تولد مدیر یا دوست.
                </p>
            </button>

            <button onClick={() => onSelectProfile('charity')} className="group flex flex-col items-center p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 dark:border-slate-700/50">
                <CrowdfundingIcon />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">کمپین‌های نیکوکاری</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    ایجاد کمپین برای خیریه، تامین جهیزیه و درمان.
                </p>
            </button>

            <button onClick={() => onSelectProfile('group-trip')} className="group flex flex-col items-center p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 dark:border-slate-700/50">
                <TravelIcon />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">سفرهای گروهی</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    مدیریت دنگ‌السفر، مادرخرج و هزینه‌های مشترک.
                </p>
            </button>

        </div>
    </div>
  );
};

export default Gateway;
