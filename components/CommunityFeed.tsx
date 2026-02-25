
import React, { useState, useEffect } from 'react';

interface ActivityItem {
    id: string;
    type: 'grant' | 'review' | 'charity' | 'slogan';
    user: string;
    avatar: string;
    content: string;
    timestamp: string;
}

const PROMO_ACTIVITIES: ActivityItem[] = [
    { id: '1', type: 'grant', user: 'امیررضا', avatar: 'https://i.pravatar.cc/150?u=11', content: 'آرزوی «ساعت هوشمند» سارا رو برآورده کرد. ✨', timestamp: 'همین الان' },
    { id: '2', type: 'review', user: 'مهسا طاهری', avatar: 'https://i.pravatar.cc/150?u=32', content: '«بالاخره یه راه راحت برای کادو خریدن پیدا کردم.»', timestamp: '۲ دقیقه پیش' },
    { id: '3', type: 'charity', user: 'امید', avatar: 'https://i.pravatar.cc/150?u=13', content: 'به پویش «سهم لبخند» کمک کرد. ❤️', timestamp: '۵ دقیقه پیش' },
    { id: '4', type: 'slogan', user: 'علی مولایی', avatar: 'https://i.pravatar.cc/150?u=14', content: '«لیست آرزوهام رو ساختم تا دوستام بدونن چی می‌خوام.»', timestamp: '۱۰ دقیقه پیش' },
    { id: '5', type: 'review', user: 'بنیامین', avatar: 'https://i.pravatar.cc/150?u=15', content: '«دنگ هدیه تولد رو با گیفتی‌نو جمع کردیم، عالی بود!»', timestamp: '۱۵ دقیقه پیش' },
    { id: '6', type: 'grant', user: 'نیلوفر', avatar: 'https://i.pravatar.cc/150?u=16', content: 'آرزوی «هدفون بیتس» برادرش رو تیک زد! 🎧', timestamp: '۳۰ دقیقه پیش' },
    { id: '7', type: 'slogan', user: 'زهرا رضایی', avatar: 'https://i.pravatar.cc/150?u=17', content: '«دیگه نگران این نیستم که کادوی تکراری بگیرم.»', timestamp: '۱ ساعت پیش' }
];

export const CommunityFeed: React.FC<{ isLogin?: boolean }> = ({ isLogin = false }) => {
    const [displayItems, setDisplayItems] = useState<ActivityItem[]>([]);

    useEffect(() => {
        const shuffle = () => {
            const shuffled = [...PROMO_ACTIVITIES].sort(() => 0.5 - Math.random());
            setDisplayItems(shuffled.slice(0, isLogin ? 1 : 4)); 
        };

        shuffle();
        const interval = setInterval(shuffle, 6000);
        return () => clearInterval(interval);
    }, [isLogin]);

    return (
        <div className={`space-y-3 ${isLogin ? 'max-w-xs mx-auto' : ''}`}>
            {!isLogin && <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-r-4 border-blue-500 pr-3">رخدادهای زنده جامعه</h3>}
            <div className="space-y-2">
                {displayItems.map(act => (
                    <div key={act.id} className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm ${isLogin ? 'p-3' : 'p-4'} rounded-[1.25rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3 animate-fade-in-up transition-all duration-1000`}>
                        <div className={`${isLogin ? 'w-8 h-8' : 'w-10 h-10'} rounded-full overflow-hidden border-2 border-blue-100 dark:border-blue-900 flex-shrink-0`}>
                            <img src={act.avatar} alt={act.user} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] sm:text-[11px] font-black text-slate-800 dark:text-white leading-tight truncate">
                                <span className="text-blue-600 font-black">{act.user}</span>: {act.content}
                            </p>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-[7px] text-slate-400 font-bold uppercase">{act.timestamp}</p>
                                {act.type === 'grant' && <span className="text-[7px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded-md font-black">بخشش</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isLogin && (
                <p className="text-center text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest animate-pulse mt-2">
                    ● زنده از ویترین گیفتی‌نو
                </p>
            )}
        </div>
    );
};
