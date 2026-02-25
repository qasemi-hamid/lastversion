
import React, { useState, useMemo, useEffect } from 'react';
import { User, Friendship } from '../types';

// Icons
const UserRemoveIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>);
const EmptyFriendsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
const RefreshIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>);
const UserGroupIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>);
const SearchIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const UserPlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" /></svg>);
const BellIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>);

const VerifiedBadge = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-4 w-4 text-blue-500"} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
    </svg>
);

const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

interface FriendsManagementProps {
  currentUser: User;
  allUsers: User[];
  friendships: Friendship[];
  friends: { user: User, friendshipId: string }[];
  pendingRequests: { user: User, friendship: Friendship }[];
  onSendRequest: (receiverId: string) => Promise<void> | void;
  onAcceptRequest: (requestId: string) => void;
  onDeclineOrRemove: (requestId: string) => void;
  onSearchUsers: (query: string) => Promise<User[]>;
  onRefresh?: () => Promise<void>; 
}

const FriendsManagement: React.FC<FriendsManagementProps> = ({
    currentUser,
    friends,
    friendships,
    pendingRequests,
    onSendRequest,
    onAcceptRequest,
    onDeclineOrRemove,
    onSearchUsers,
    onRefresh,
}) => {
    const [activeTab, setActiveTab] = useState<'contacts' | 'find' | 'requests'>('contacts');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    useEffect(() => {
        if (friends.length === 0 && pendingRequests.length === 0) {
            setActiveTab('find');
        }
    }, []);

    // اجرای جستجو با تغییر متن ورودی
    useEffect(() => {
        const triggerSearch = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const results = await onSearchUsers(searchQuery);
                setSearchResults(results);
            } catch (err) {
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(triggerSearch, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, onSearchUsers]);

    const handleManualRefresh = async () => {
        if (onRefresh) {
            setIsRefreshing(true);
            await onRefresh();
            setTimeout(() => setIsRefreshing(false), 500);
        }
    };

    const handleSendRequest = async (userId: string) => {
        setActionLoadingId(userId);
        try {
            await onSendRequest(userId);
        } finally {
            setActionLoadingId(null);
        }
    };

    const getRelationshipStatus = (targetUserId: string) => {
        const friend = friends.find(f => f.user.id === targetUserId);
        if (friend) return { type: 'friend', id: friend.friendshipId };
        const incoming = pendingRequests.find(req => req.user.id === targetUserId);
        if (incoming) return { type: 'incoming', id: incoming.friendship.id };
        const outgoing = friendships.find(f => f.requesterId === currentUser.id && f.receiverId === targetUserId && f.status === 'pending');
        if (outgoing) return { type: 'outgoing', id: outgoing.id };
        return { type: 'none', id: null };
    };

    return (
        <main className="flex-1 overflow-y-auto flex flex-col bg-slate-50 dark:bg-slate-900">
            <div className="max-w-4xl mx-auto p-6 sm:p-8 w-full flex-grow flex flex-col">
                
                <header className="mb-10 flex justify-between items-center pl-14 sm:pl-2 pr-2">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-700 dark:from-violet-400 dark:to-indigo-500">
                            مدیریت دوستان
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-black mt-2 opacity-80 uppercase tracking-wide">
                            شبکه ارتباطی خود را گسترش دهید
                        </p>
                    </div>
                    {onRefresh && (
                        <button 
                            onClick={handleManualRefresh} 
                            disabled={isRefreshing}
                            className={`p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md text-slate-500 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                        >
                            <RefreshIcon />
                        </button>
                    )}
                </header>

                <div className="flex p-1.5 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-8 shadow-inner border border-slate-300 dark:border-slate-700">
                    <button onClick={() => setActiveTab('contacts')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'contacts' ? 'bg-white dark:bg-slate-700 shadow-md text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                        <UserGroupIcon /> مخاطبین ({friends.length})
                    </button>
                    <button onClick={() => setActiveTab('find')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'find' ? 'bg-white dark:bg-slate-700 shadow-md text-violet-600 dark:text-violet-400' : 'text-slate-500 hover:text-slate-700'}`}>
                        <SearchIcon /> جستجو
                    </button>
                    <button onClick={() => setActiveTab('requests')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'requests' ? 'bg-white dark:bg-slate-700 shadow-md text-rose-600 dark:text-rose-400' : 'text-slate-500 hover:text-slate-700'}`}>
                        <BellIcon /> درخواست‌ها 
                        {pendingRequests.length > 0 && <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm animate-pulse">{pendingRequests.length}</span>}
                    </button>
                </div>

                {activeTab === 'contacts' && (
                    <div className="flex-grow animate-fade-in">
                        {friends.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {friends.map(({ user, friendshipId }) => (
                                    <div key={user.id} className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-lg transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 font-black text-xl overflow-hidden border border-slate-50 dark:border-slate-600 shadow-inner">
                                                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span className="font-bold">{user.name.charAt(0)}</span>}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-1">
                                                    {user.name}
                                                    {(user.role === 'charity' || user.role === 'merchant') && <VerifiedBadge />}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                                                    {user.role === 'charity' ? 'موسسه خیریه' : user.role === 'merchant' ? 'فروشگاه تایید شده' : 'کاربر عادی'}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => onDeclineOrRemove(friendshipId)} 
                                            className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all active:scale-90"
                                            title="حذف مخاطب"
                                        >
                                            <UserRemoveIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="p-8 bg-white dark:bg-slate-800 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700 mb-6 scale-110">
                                    <EmptyFriendsIcon />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">لیست دوستان شما خالی است</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-xs mb-8 text-xs font-bold leading-relaxed">
                                    هنوز هیچ دوستی اضافه نکرده‌اید. همین حالا شروع به جستجو کنید!
                                </p>
                                <button onClick={() => setActiveTab('find')} className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-rose-500/30 flex items-center gap-2 active:scale-95">
                                    <SearchIcon />
                                    پیدا کردن دوست
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'find' && (
                    <div className="flex-grow flex flex-col animate-fade-in">
                        <div className="mb-8 relative group">
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="جستجو بر اساس نام، موبایل یا ایمیل..."
                                className="w-full pl-14 pr-5 py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl shadow-xl focus:border-rose-500/50 outline-none transition-all text-slate-900 dark:text-white font-bold text-sm"
                                autoFocus
                            />
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500">
                                {isSearching ? <LoadingSpinner /> : <SearchIcon />}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {searchResults.map(user => {
                                const rel = getRelationshipStatus(user.id);
                                const isLoading = actionLoadingId === user.id;
                                
                                return (
                                    <div key={user.id} className="bg-white dark:bg-slate-800 p-4 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm animate-fade-in-up hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 font-black text-xl overflow-hidden border border-slate-100 dark:border-slate-600">
                                                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white text-sm">{user.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold dir-ltr mt-1">{user.mobile || user.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            {rel.type === 'friend' && (
                                                <span className="px-4 py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-xl text-[10px] font-black border border-emerald-100 dark:border-emerald-800">
                                                    ✓ دوست هستید
                                                </span>
                                            )}
                                            {rel.type === 'outgoing' && (
                                                <button 
                                                    onClick={() => onDeclineOrRemove(rel.id!)}
                                                    className="px-4 py-2 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black hover:bg-rose-50 hover:text-rose-600 transition-all"
                                                >
                                                    لغو درخواست
                                                </button>
                                            )}
                                            {rel.type === 'incoming' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => onAcceptRequest(rel.id!)} className="p-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-md"><CheckIcon /></button>
                                                    <button onClick={() => onDeclineOrRemove(rel.id!)} className="p-2.5 bg-slate-200 text-slate-600 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all"><XIcon /></button>
                                                </div>
                                            )}
                                            {rel.type === 'none' && (
                                                <button 
                                                    onClick={() => handleSendRequest(user.id)}
                                                    disabled={isLoading}
                                                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black hover:opacity-90 shadow-lg transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    {isLoading ? <LoadingSpinner /> : <><UserPlusIcon /> افزودن</>}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {searchResults.length === 0 && searchQuery && !isSearching && (
                                <div className="text-center py-16 bg-slate-100 dark:bg-slate-800 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">کاربری با این مشخصات پیدا نشد 🧐</p>
                                </div>
                            )}
                            
                            {!searchQuery && (
                                <div className="text-center py-20 opacity-30 flex flex-col items-center">
                                    <div className="p-8 border-4 border-slate-200 dark:border-slate-700 rounded-full mb-4">
                                        <SearchIcon className="w-12 h-12" />
                                    </div>
                                    <p className="text-xs font-black">جستجو را آغاز کنید...</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="flex-grow animate-fade-in">
                        {pendingRequests.length > 0 ? (
                            <div className="space-y-4">
                                {pendingRequests.map(({ user, friendship }) => (
                                    <div key={friendship.id} className="bg-white dark:bg-slate-800 p-5 rounded-[2.5rem] border border-rose-100 dark:border-slate-700 flex items-center justify-between shadow-md">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500 font-black text-xl overflow-hidden shadow-inner">
                                                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white text-sm">{user.name}</p>
                                                <p className="text-[10px] text-rose-500 font-bold mt-1">درخواست دوستی فرستاده</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => onAcceptRequest(friendship.id)}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-2xl text-[10px] font-black hover:bg-rose-700 shadow-xl shadow-rose-500/20 active:scale-95 transition-all"
                                            >
                                                <CheckIcon /> قبول
                                            </button>
                                            <button 
                                                onClick={() => onDeclineOrRemove(friendship.id)}
                                                className="px-5 py-2.5 bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300 rounded-2xl text-[10px] font-black hover:bg-rose-50 hover:text-rose-600 transition-all"
                                            >
                                                رد کردن
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center text-slate-400">
                                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 opacity-50">
                                    <BellIcon />
                                </div>
                                <p className="text-sm font-bold">هیچ درخواست دوستی جدیدی ندارید.</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </main>
    );
};

export default FriendsManagement;
