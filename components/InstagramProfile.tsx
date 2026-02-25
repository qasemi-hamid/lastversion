
import React, { useState, useMemo } from 'react';
import { User, Wishlist, Wallet, ProfileType, ImportantDate, DateType } from '../types';

const VerifiedBadge = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 text-blue-500"} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
    </svg>
);

const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
);

const BoxCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

interface InstagramProfileProps {
  user: User;
  wishlists: Wishlist[];
  onSelectList: (id: string) => void;
  onEditProfile: () => void;
  onSettings: () => void;
  onWallet: () => void;
  onAddNewList: () => void;
  onShareProfile: () => void;
  friendsLists: Wishlist[];
  charityLists: Wishlist[];
  wallet: Wallet;
  onLogout: () => void;
  profileType: ProfileType;
  onOpenFriends: () => void;
  friendsCount: number;
  pendingRequestCount: number;
  unreadNotificationCount: number; 
  onGoToActivity: () => void;
  friends: User[];
  allUsers: User[];
  onManageDates: () => void;
  onOpenOrders: () => void;
  // New prop for the smart reminder
  pendingGiftsCount?: number; 
}

const InstagramProfile: React.FC<InstagramProfileProps> = ({
  user, wishlists, onSelectList, onEditProfile, onSettings, onWallet, onAddNewList, onShareProfile, onGoToActivity, onOpenFriends, onManageDates, onOpenOrders, friends, friendsLists, friendsCount, pendingRequestCount, unreadNotificationCount, allUsers, pendingGiftsCount = 0
}) => {
  const [tab, setTab] = useState<'my_lists' | 'friends'>('my_lists');

  const dateTypeLabels: Record<DateType, string> = {
    'birthday': 'تولد من',
    'spouse_birthday': 'تولد همسر',
    'child_birthday': 'تولد فرزند',
    'father_birthday': 'تولد پدر',
    'mother_birthday': 'تولد مادر',
    'anniversary': 'سالگرد ما',
    'friend_birthday': 'تولد دوست',
    'other': 'مناسبت خاص'
  };

  const upcomingEvents = useMemo(() => {
      const allSourceUsers = [user, ...friends];
      const events: { owner: User; date: ImportantDate; daysLeft: number }[] = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      allSourceUsers.forEach(u => {
          (u.importantDates || []).forEach(d => {
              const bDate = new Date(d.date);
              const target = new Date(today.getFullYear(), bDate.getMonth(), bDate.getDate());
              if (target < today) target.setFullYear(today.getFullYear() + 1);
              const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              if (diff <= 30) {
                  events.push({ owner: u, date: d, daysLeft: diff });
              }
          });
      });
      return events.sort((a, b) => a.daysLeft - b.daysLeft);
  }, [user, friends]);

  const getEventEmoji = (type: DateType) => {
      switch(type) {
          case 'birthday': case 'friend_birthday': case 'child_birthday': return '🎂';
          case 'anniversary': case 'spouse_birthday': return '❤️';
          default: return '🌟';
      }
  };

  const getEventRingColor = (type: DateType, daysLeft: number) => {
      if (daysLeft === 0) return 'from-amber-400 via-rose-500 to-fuchsia-600 animate-spin-slow';
      switch(type) {
          case 'birthday': return 'from-pink-500 to-rose-500';
          case 'anniversary': return 'from-red-500 to-orange-500';
          default: return 'from-indigo-500 to-blue-500';
      }
  };

  const WishlistThumbnail: React.FC<{ list: Wishlist; isFriend?: boolean }> = ({ list, isFriend = false }) => {
      const owner = isFriend ? allUsers.find(u => u.id === list.ownerId) : null;
      return (
        <div onClick={() => onSelectList(list.id)} className="aspect-square bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800 shadow-sm overflow-hidden group cursor-pointer hover:shadow-2xl transition-all relative">
            <div className="h-full w-full relative">
                {list.coverImage ? (
                    <img src={list.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-rose-500 to-amber-500 flex items-center justify-center relative">
                        <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-5 rounded-3xl shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                            <span className="text-4xl drop-shadow-2xl">{list.type === 'charity' ? '❤️' : '🎁'}</span>
                        </div>
                    </div>
                )}
                {isFriend && (
                    <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-xl border-2 border-white shadow-lg overflow-hidden bg-white">
                        {owner?.avatar ? <img src={owner.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-slate-100 text-[10px] font-black text-slate-400">{(owner?.name || 'ف').charAt(0)}</div>}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-4 text-right">
                    {isFriend && <p className="text-[9px] text-rose-400 font-black mb-0.5">{owner?.name}</p>}
                    <h4 className="text-white font-black text-[11px] truncate leading-tight">{list.name}</h4>
                    <p className="text-[8px] text-white/50 font-bold mt-1">{list.items.length} آیتم</p>
                </div>
            </div>
        </div>
      );
  };

  return (
    <div className="flex flex-col h-full bg-[#FDFBF9] dark:bg-slate-950 pb-24 overflow-y-auto" dir="rtl">
        <header className="relative flex-shrink-0">
            <div className="h-64 sm:h-80 w-full bg-slate-900 relative overflow-hidden">
                 <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=2000')" }}></div>
                 <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FDFBF9] dark:to-slate-950"></div>
                 <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
                    <div className="flex gap-2">
                        <button onClick={onSettings} className="p-3 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 text-white hover:bg-black/40 transition-all shadow-xl"><SettingsIcon /></button>
                        <button onClick={onOpenOrders} className="p-3 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 text-white hover:bg-black/40 transition-all shadow-xl"><BoxCheckIcon /></button>
                    </div>
                    <button onClick={onWallet} className="p-3 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 text-white hover:bg-black/40 transition-all shadow-xl"><WalletIcon /></button>
                 </div>
            </div>
            
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="relative">
                    <button 
                        onClick={onEditProfile} 
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 text-white dark:text-slate-200 px-4 py-1.5 rounded-full font-black text-[10px] shadow-lg hover:bg-white/30 transition-all whitespace-nowrap z-30"
                    >
                        ویرایش پروفایل
                    </button>

                    <button 
                        onClick={onShareProfile} 
                        className="absolute -top-2 -left-2 z-40 bg-indigo-600 text-white p-2.5 rounded-full shadow-xl border-2 border-white dark:border-slate-900 active:scale-90 hover:bg-indigo-700 transition-all"
                        title="اشتراک‌گذاری"
                    >
                        <ShareIcon />
                    </button>

                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2.5rem] border-[6px] border-white dark:border-slate-950 bg-white dark:bg-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
                         {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span className="text-5xl font-black text-slate-300">{user.name.charAt(0)}</span>}
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 text-[9px] font-black px-3 py-0.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900 z-10 whitespace-nowrap">Impact Lv.5 ✨</div>
                </div>
            </div>
        </header>

        <div className="px-6 pt-16 pb-4 text-center flex flex-col items-center">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">{user.name}{(user.role === 'charity' || user.role === 'merchant') && <VerifiedBadge />}</h1>
            <p className="text-xs font-bold text-slate-400 mt-1 dir-ltr opacity-80">{user.email || user.mobile}</p>
            
            <div className="mt-6 flex gap-4 w-full max-w-sm">
                {/* SMART REMINDER CARD: GIFTS SENT vs RESERVED */}
                <div className={`flex-1 p-3 rounded-2xl shadow-sm border transition-all duration-500 ${
                    pendingGiftsCount > 0 
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 animate-pulse' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                }`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${pendingGiftsCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-500'}`}>
                        {pendingGiftsCount > 0 ? '🎁 هدیه رزرو شده' : 'هدایای ارسالی'}
                    </p>
                    <p className="text-lg font-black text-slate-800 dark:text-white">
                        {pendingGiftsCount > 0 ? pendingGiftsCount : (user.giftsGivenCount || 0)}
                    </p>
                    {pendingGiftsCount > 0 && (
                        <p className="text-[8px] font-bold text-amber-500 mt-1">فراموش نکن خرید کنی!</p>
                    )}
                </div>

                <div className="flex-1 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">مناسبت‌های نزدیک</p>
                    <p className="text-lg font-black text-slate-800 dark:text-white">{upcomingEvents.length} <span className="text-[10px] font-bold text-slate-400 mr-1">مورد</span></p>
                </div>
            </div>
        </div>

        <div className="px-6 mt-4">
            <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-xl border border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-100 dark:divide-slate-800">
                    <button onClick={onGoToActivity} className="flex flex-col items-center gap-2 relative">
                        <BellIcon /><span className="text-sm font-black text-slate-900 dark:text-white">{unreadNotificationCount}</span><span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">رخدادها</span>
                    </button>
                    <button onClick={onOpenFriends} className="flex flex-col items-center gap-2 relative">
                        <div className="h-5 w-5 text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg></div>
                        <span className="text-sm font-black text-slate-900 dark:text-white">{friendsCount}</span><span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">مخاطبین</span>
                    </button>
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-5 w-5 text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg></div>
                        <span className="text-sm font-black text-slate-900 dark:text-white">{wishlists.length}</span><span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">لیست‌ها</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-10 px-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-r-4 border-rose-500 pr-3">مناسبت‌های نزدیک (یادآور)</h3>
                <button onClick={onManageDates} className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg">مدیریت همه</button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
                <button onClick={onManageDates} className="flex flex-col items-center gap-2 flex-shrink-0 group">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700 group-hover:border-indigo-400 group-hover:text-indigo-400 transition-all">
                        <PlusIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">افزودن تاریخ</span>
                </button>

                {upcomingEvents.map((ev, idx) => {
                    const isOwnEvent = ev.owner.id === user.id;
                    return (
                        <div key={`${ev.owner.id}-${idx}`} className="flex flex-col items-center gap-2 flex-shrink-0 group">
                            <button onClick={isOwnEvent ? onAddNewList : () => onSelectList(friendsLists.find(l=>l.ownerId===ev.owner.id)?.id || '')} className="relative">
                                <div className={`w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr ${getEventRingColor(ev.date.type, ev.daysLeft)} shadow-lg transition-transform group-hover:scale-105`}>
                                    <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-950 overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        {ev.owner.avatar ? <img src={ev.owner.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg font-black text-slate-400">{ev.owner.name.charAt(0)}</div>}
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center text-[10px] shadow-md border border-slate-100 dark:border-slate-800">{getEventEmoji(ev.date.type)}</div>
                                
                                {isOwnEvent && (
                                    <div className="absolute -top-1 -left-1 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-white">
                                        <PlusIcon className="w-3 h-3" />
                                    </div>
                                )}
                            </button>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 truncate w-20">{isOwnEvent ? (ev.date.label || dateTypeLabels[ev.date.type]) : ev.owner.name.split(' ')[0]}</p>
                                <p className={`text-[12px] font-black ${ev.daysLeft === 0 ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`}>
                                    {ev.daysLeft === 0 ? 'امروز!' : `${ev.daysLeft} روز`}
                                </p>
                            </div>
                        </div>
                    );
                })}
                
                {upcomingEvents.length === 0 && (
                    <div className="flex items-center text-slate-300 dark:text-slate-700 text-[10px] font-bold pr-4">
                        تاریخ تولد عزیزانتان را اضافه کنید تا هدیه دادن را فراموش نکنید.
                    </div>
                )}
            </div>
        </div>

        <div className="px-6 py-8 flex gap-4 border-t border-slate-200/30 dark:border-slate-900 mt-6">
            <button onClick={() => setTab('my_lists')} className={`flex-1 py-3 text-sm font-black rounded-2xl transition-all ${tab === 'my_lists' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>لیست‌های من</button>
            <button onClick={() => setTab('friends')} className={`flex-1 py-3 text-sm font-black rounded-2xl transition-all ${tab === 'friends' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>لیست دوستان</button>
        </div>

        <div className="px-6 pb-24">
            {tab === 'my_lists' && (
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                    <button onClick={onAddNewList} className="aspect-square relative overflow-hidden rounded-[2.5rem] flex flex-col items-center justify-center group shadow-xl active:scale-95">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center mb-3">
                                <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 4v16m8-8H4" /></svg>
                            </div>
                            <span className="text-[11px] font-black text-white uppercase tracking-widest drop-shadow-md">آرزوی جدید</span>
                        </div>
                    </button>
                    {wishlists.map(list => <WishlistThumbnail key={list.id} list={list} />)}
                </div>
            )}
            {tab === 'friends' && (
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                    {friendsLists.length > 0 ? friendsLists.map(list => <WishlistThumbnail key={list.id} list={list} isFriend />) : (
                        <div className="col-span-2 flex flex-col items-center justify-center py-20 text-center text-slate-400 font-bold">لیستی یافت نشد.</div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default InstagramProfile;
