
import React, { useState, useEffect } from 'react';
import { GiveawayGift, User } from '../types';
import { getGiveawayGifts, claimGiveaway } from '../services/api';
import { ExploreProductSkeleton } from './Skeleton';

interface GiveawayFeedProps {
  currentUser: User;
  onRefresh: () => void;
}

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

const GiveawayFeed: React.FC<GiveawayFeedProps> = ({ currentUser, onRefresh }) => {
    const [gifts, setGifts] = useState<GiveawayGift[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [claimingId, setClaimingId] = useState<string | null>(null);

    const loadGifts = async () => {
        setIsLoading(true);
        try {
            const data = await getGiveawayGifts();
            setGifts(data);
        } finally {
            setTimeout(() => setIsLoading(false), 600);
        }
    };

    useEffect(() => {
        loadGifts();
    }, []);

    const handleClaim = async (gift: GiveawayGift) => {
        if (gift.ownerId === currentUser.id) {
            alert('شما نمی‌توانید هدیه خودتان را رزرو کنید!');
            return;
        }
        setClaimingId(gift.id);
        try {
            await claimGiveaway(currentUser.id, gift.id);
            alert(`تبریک! هدیه "${gift.name}" برای شما رزرو شد. برای هماهنگی با صاحب هدیه در بخش پیام‌ها اقدام کنید.`);
            loadGifts();
            onRefresh();
        } catch (e) {
            alert('خطا در رزرو هدیه');
        } finally {
            setClaimingId(null);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#FDFBF9] dark:bg-slate-950 pb-24 overflow-y-auto" dir="rtl">
            <header className="p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="text-3xl">🤝</span> دیوار مهربانی (ببخش و بگیر)
                    </h2>
                    <p className="text-[10px] font-black text-blue-500 mt-1 uppercase tracking-widest">Community Giveaway & Kindness Wall</p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto w-full px-4 py-6">
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-[2rem] border border-blue-100 dark:border-blue-800/50 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-2xl shadow-sm text-blue-600">🤝</div>
                    <div className="flex-1">
                        <h4 className="text-xs font-black text-blue-900 dark:text-blue-200">چرخه مهربانی را روشن کنید</h4>
                        <p className="text-[9px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">در این بخش کالاها به صورت کاملاً رایگان توسط کاربران اهدا می‌شوند.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => <ExploreProductSkeleton key={i} />)
                    ) : gifts.length > 0 ? (
                        gifts.map(gift => (
                            <div key={gift.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col group hover:shadow-xl transition-all">
                                <div className="aspect-square bg-slate-50 dark:bg-slate-800 relative overflow-hidden">
                                    {gift.imageUrl ? (
                                        <img src={gift.imageUrl} alt={gift.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-10">📦</div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-blue-500 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg uppercase">رایگان</div>
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h4 className="font-black text-xs text-slate-800 dark:text-white line-clamp-1 mb-1">{gift.name}</h4>
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[7px] font-black text-slate-400">
                                            {gift.ownerName?.charAt(0)}
                                        </div>
                                        <span className="text-[8px] font-black text-slate-400">اهدایی از {gift.ownerName}</span>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleClaim(gift)}
                                        disabled={claimingId === gift.id}
                                        className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-md"
                                    >
                                        {claimingId === gift.id ? '...' : <><HeartIcon /> می‌خواهم</>}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center opacity-40">
                            <div className="text-6xl mb-4">🍃</div>
                            <p className="text-sm font-black">دیوار مهربانی فعلاً خالی است.</p>
                            <p className="text-xs font-bold mt-2">شما اولین کسی باشید که چیزی می‌بخشد!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GiveawayFeed;
