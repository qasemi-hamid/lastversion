
import React, { useState, useEffect } from 'react';
import { getPublicCampaigns } from '../services/api';
import { Wishlist } from '../types';

// Icons for How it Works
const EditListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const ShareLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
);

const GetGiftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 00-2-2V8z" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

interface PublicDashboardProps {
  onStartFromScratch: () => void;
  onStartQuickList: () => void;
  onViewCharity: () => void;
}

const PublicDashboard: React.FC<PublicDashboardProps> = ({ onStartFromScratch }) => {
    const [publicWishes, setPublicWishes] = useState<Wishlist[]>([]);
    
    useEffect(() => {
        getPublicCampaigns().then(setPublicWishes);
    }, []);

    const steps = [
        { 
            title: 'صندوقچه آرزو', 
            description: 'آرزوهایت را لیست کن و با دوستانت به اشتراک بگذار تا دقیقاً بدانند چه چیزی خوشحالت می‌کند.',
            icon: <EditListIcon />,
            color: 'bg-rose-500' 
        },
        { 
            title: 'ویترین هدایا', 
            description: 'لیست دوستانت را ببین و با هدیه دادن یا مشارکت در خرید، آن‌ها را سورپرایز کن.',
            icon: <GetGiftIcon />,
            color: 'bg-indigo-600' 
        },
        { 
            title: 'شادی مشترک', 
            description: 'یک اکوسیستم هوشمند برای مدیریت هدایا، دنگ‌های گروهی و کمپین‌های مهربانی.',
            icon: <ShareLinkIcon />,
            color: 'bg-slate-600' 
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFBF9] dark:bg-slate-950 overflow-x-hidden font-sans">
            {/* Hero Section */}
            <div className="w-full max-w-7xl mx-auto px-6 py-12 lg:py-24">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 text-center lg:text-right">
                        <h1 className="text-6xl sm:text-8xl font-black candy-text mb-6 tracking-tighter">
                            Giftino
                        </h1>
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-slate-50 mb-6 leading-tight">
                            شبکه اجتماعی <span className="text-rose-600 underline decoration-rose-200 underline-offset-8">هدیه و آرزو</span><br />
                            <span className="text-slate-500 dark:text-slate-400 text-2xl sm:text-3xl">لذتِ دادن و گرفتن هدیه</span>
                        </h2>
                        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            گیفتی‌نو پلتفرم هوشمند مدیریت آرزوهاست. آرزوهایت را در صندوقچه بگذار و در ویترین به دیگران شادی ببخش.
                        </p>
                        
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <button
                                onClick={onStartFromScratch}
                                className="px-10 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-[2rem] font-black text-lg sm:text-xl shadow-2xl shadow-rose-500/40 transition-all transform active:scale-95 flex items-center gap-3"
                            >
                                <SparklesIcon />
                                <span>چیدمان صندوقچه آرزو</span>
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById('public-wishes')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-[2rem] font-black text-lg sm:text-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 flex items-center gap-3"
                            >
                                <span>گشت‌وگذار در ویترین</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full max-w-md lg:max-w-full">
                        <div className="relative bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[3rem] border-2 border-white dark:border-slate-800 shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-3xl shadow-md border border-slate-100 dark:border-slate-700">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${i === 1 ? 'bg-rose-100' : i === 2 ? 'bg-indigo-100' : 'bg-emerald-100'}`}>
                                            {i === 1 ? '🎁' : i === 2 ? '❤️' : '✨'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-700 rounded-full mb-3"></div>
                                            <div className="h-2 w-1/2 bg-slate-50 dark:bg-slate-800 rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Public Wishes Section */}
            <div id="public-wishes" className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white">ویترین آرزوهای جاری</h3>
                        <p className="text-slate-500 font-bold mt-2">در شادی دیگران سهیم شوید</p>
                    </div>
                    <button className="text-rose-600 font-black text-sm hover:underline">مشاهده همه &larr;</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {publicWishes.slice(0, 4).map(wish => (
                        <div key={wish.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                             <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-[1.5rem] flex items-center justify-center text-4xl mb-6 shadow-inner transition-transform group-hover:scale-110 overflow-hidden relative">
                                {wish.coverImage ? (
                                    <img src={wish.coverImage} className="w-full h-full object-cover rounded-[1.5rem]" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_white,_transparent)] animate-pulse"></div>
                                        <span className="text-2xl drop-shadow-lg z-10">{wish.type === 'charity' ? '❤️' : '🎁'}</span>
                                    </div>
                                )}
                             </div>
                             <h4 className="font-black text-lg mb-2 text-slate-900 dark:text-white line-clamp-1">{wish.name}</h4>
                             <p className="text-xs text-slate-400 font-bold mb-6 line-clamp-2">{wish.description || 'یک آرزوی زیبا در انتظار تحقق'}</p>
                             <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                                 <span className="text-[10px] font-black text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-3 py-1.5 rounded-xl">مشاهده آرزو</span>
                                 <span className="text-[10px] text-slate-400 font-bold">{wish.items.length} آیتم</span>
                             </div>
                        </div>
                    ))}
                    {publicWishes.length === 0 && (
                         Array.from({length: 4}).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 h-64 rounded-[2.5rem] animate-pulse"></div>
                         ))
                    )}
                </div>
            </div>

            {/* How it Works */}
            <div className="bg-slate-900 py-24 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h3 className="text-4xl font-black mb-4">چرخه مهربانی چطور کار می‌کند؟</h3>
                        <p className="text-slate-400 text-lg font-medium">سه قدم ساده برای پیوستن به دنیای آرزوها</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {steps.map((step, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-lg rounded-[3rem] p-10 text-center border border-white/10 transition-all hover:border-white/30 hover:-translate-y-2">
                                <div className={`w-24 h-24 mx-auto rounded-[2rem] ${step.color} flex items-center justify-center mb-8 shadow-2xl`}>
                                    {step.icon}
                                </div>
                                <h4 className="text-2xl font-black mb-4">{step.title}</h4>
                                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <footer className="py-12 text-center bg-[#FDFBF9] dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-2xl font-black text-rose-600">Giftino</span>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-400">۱۴۰۳</span>
                </div>
                <p className="text-xs font-bold text-slate-400">ساخته شده با ❤️ برای جامعه‌ای مهربان‌تر</p>
            </footer>
        </div>
    );
};

export default PublicDashboard;
