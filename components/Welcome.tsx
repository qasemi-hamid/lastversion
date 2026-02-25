
import React from 'react';
import { ProfileType, Wishlist, User } from '../types';

interface WelcomeProps {
  onAddNewList: () => void;
  profileType: ProfileType;
  currentUser?: { name: string };
  wishlists?: Wishlist[];
  onSelectList?: (id: string) => void;
  onDeleteList?: (id: string) => void;
  friends?: { user: User }[];
  onFindFriends?: () => void;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const DashboardCard: React.FC<{ 
    title: string; 
    subtitle?: string; 
    icon?: React.ReactNode; 
    bgImage?: string; 
    gradient: string; 
    onClick: () => void;
    onDelete?: () => void;
    isLarge?: boolean;
}> = ({ title, subtitle, icon, bgImage, gradient, onClick, onDelete, isLarge }) => {
    return (
        <div className={`group relative flex flex-col text-right overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isLarge ? 'col-span-2 aspect-[2/1]' : 'col-span-1 aspect-square'}`}>
            <button
                onClick={onClick}
                className="absolute inset-0 w-full h-full text-right"
            >
                {bgImage ? (
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${bgImage}')` }}></div>
                ) : null}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} ${bgImage ? 'opacity-80 group-hover:opacity-70' : 'opacity-100'} transition-opacity`}></div>
                
                <div className="relative z-10 p-4 flex flex-col h-full justify-between w-full pointer-events-none">
                    <div className="flex justify-between items-start">
                        {icon && (
                            <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg text-white shadow-inner">
                                {icon}
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <h3 className="text-white font-bold text-lg leading-tight mb-1 drop-shadow-md">{title}</h3>
                        {subtitle && <p className="text-white/90 text-xs font-medium line-clamp-2">{subtitle}</p>}
                    </div>
                </div>
            </button>
            
            {onDelete && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="absolute top-2 left-2 z-20 p-2 bg-white/20 hover:bg-rose-500 hover:text-white backdrop-blur-md rounded-full text-white/90 transition-all shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="حذف لیست"
                >
                    <TrashIcon />
                </button>
            )}
        </div>
    );
};

const FriendAvatar: React.FC<{ user: User }> = ({ user }) => (
    <div className="flex flex-col items-center gap-2 mr-4 first:mr-0 min-w-[64px]">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-400 to-fuchsia-500 p-[2px] shadow-sm">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-lg">
                {user.name.charAt(0)}
            </div>
        </div>
        <span className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[70px]">{user.name.split(' ')[0]}</span>
    </div>
);

const Welcome: React.FC<WelcomeProps> = ({ onAddNewList, profileType, currentUser, wishlists = [], onSelectList, onDeleteList, friends = [], onFindFriends }) => {
    
    const content = {
        personal: { title: 'سلام، ' + (currentUser?.name || 'رفیق'), subtitle: 'چه نقشه‌ای برای خوشحالی داری؟' },
        charity: { title: 'سلام، مهربان ❤️', subtitle: 'جهان با کمک تو جای بهتریه.' },
        organizational: { title: 'پنل سازمانی 🏢', subtitle: 'مدیریت رفاهی و هدایای تیم.' },
        'all-for-one': { title: 'هدیه گروهی 🎁', subtitle: 'همه برای یکی، یکی برای همه.' },
        'group-trip': { title: 'همسفر پایه 🎒', subtitle: 'برنامه‌ریزی سفر بعدی.' }
    }[profileType];

    const bgImages = [
        '/images/template-1.jpg',
        '/images/template-2.jpg',
        '/images/template-3.jpg',
        '/images/template-2.jpg'
    ];

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto bg-slate-50 dark:bg-slate-900 pb-24 md:pb-6">
            <div className="max-w-7xl mx-auto space-y-8">
                
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 tracking-tight">
                            {content.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">
                            {content.subtitle}
                        </p>
                    </div>
                </div>

                {friends.length > 0 && (
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-3 px-1">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">دوستان من</h3>
                            <button onClick={onFindFriends} className="text-xs text-violet-600 dark:text-violet-400 font-semibold">مشاهده همه</button>
                        </div>
                        <div className="flex overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 scroll-smooth">
                            {friends.map((f, i) => (
                                <FriendAvatar key={i} user={f.user} />
                            ))}
                            <button onClick={onFindFriends} className="flex flex-col items-center gap-2 mr-4 min-w-[64px] group">
                                <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 group-hover:border-violet-500 group-hover:text-violet-500 transition-colors">
                                    <PlusIcon />
                                </div>
                                <span className="text-xs text-slate-500 group-hover:text-violet-600">افزودن</span>
                            </button>
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 px-1">لیست‌های فعال</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        {wishlists.map((list, index) => (
                            <DashboardCard
                                key={list.id}
                                title={list.name}
                                subtitle={`${list.items.length} آیتم`}
                                gradient="from-indigo-500 to-blue-600"
                                bgImage={index % 2 === 0 ? bgImages[2] : bgImages[3]}
                                onClick={() => onSelectList && onSelectList(list.id)}
                                onDelete={() => onDeleteList && onDeleteList(list.id)}
                            />
                        ))}
                        <button
                            onClick={onAddNewList}
                            className="col-span-1 aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:border-violet-500 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <PlusIcon />
                            </div>
                            <span className="text-xs font-bold">لیست جدید</span>
                        </button>
                    </div>
                </div>

                {profileType === 'personal' && (
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg mt-6">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-1">پویش‌های مهربانی</h3>
                                <p className="text-teal-100 text-sm max-w-xs">در شادی دیگران سهیم باش و دنیا رو جای قشنگ‌تری کن.</p>
                            </div>
                            <button className="bg-white text-teal-600 px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-teal-50 transition-colors">
                                مشاهده
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
};

export default Welcome;
