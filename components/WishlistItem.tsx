
import React from 'react';
import { WishlistItem as WishlistItemType, UserView, ProfileType, User, Offer } from '../types';

interface WishlistItemProps {
  item: WishlistItemType;
  userView: UserView;
  onUnclaimItem: () => void;
  onClaimItem: (item: WishlistItemType) => void; 
  onContinueShopping: () => void;
  onPayClick: () => void;
  onContributeClick: (item: WishlistItemType) => void;
  onEditItem: (item: WishlistItemType) => void;
  onDeleteItem: (itemId: string) => void;
  onRecipientAction: (item: WishlistItemType) => void;
  profileType: ProfileType;
  currentUser: User | null;
  users: User[];
  offers?: Offer[];
  onAcceptOffer?: (offer: Offer) => void;
  onRejectOffer?: (offerId: string) => void;
  beneficiary?: { name: string; shaba?: string; isThirdParty: boolean }; 
}

const formatPrice = (price?: number) => { 
  if (typeof price !== 'number' || isNaN(price)) return ''; 
  return price.toLocaleString('fa-IR') + ' ت'; 
}

const formatDateTime = (isoString: string) => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit'
        };
        return `${date.toLocaleDateString('fa-IR', options)} - ${date.toLocaleTimeString('fa-IR', timeOptions)}`;
    } catch { return ''; }
};

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
);

const UserGroupIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
);

const RadarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const CloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
);

const TestBadge = () => (
    <span className="bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-tighter">تستی</span>
);

const WishlistItem: React.FC<WishlistItemProps> = ({ 
    item, userView, onClaimItem, onUnclaimItem, onContributeClick, onEditItem, onDeleteItem, currentUser, beneficiary
}) => {
  const isOwner = userView === 'owner';
  const isFriendView = userView === 'friend';
  const fundedAmount = item.contributions.reduce((sum, c) => sum + c.amount, 0);
  const hasTargetPrice = !!item.price && item.price > 0;
  
  const isFullyFunded = hasTargetPrice && (item.status === 'funded' || fundedAmount >= (item.price || 0));
  const progressPercentage = hasTargetPrice ? (fundedAmount / (item.price || 1)) * 100 : 0;
  
  const isClaimedByCurrentUser = !item.isGroupGift && currentUser && (item.claimedBy === currentUser.id);
  const isClaimedByOther = !item.isGroupGift && item.claimedBy && item.claimedBy !== currentUser?.id;
  const isSynced = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);

  const participants = item.contributions.reduce((acc: any[], curr) => {
      if (!acc.some(p => p.userId === curr.userId)) {
          acc.push({ userId: curr.userId, userName: curr.userName });
      }
      return acc;
  }, []);

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border overflow-hidden mb-5 hover:shadow-xl transition-all relative ${item.isGroupGift ? 'border-indigo-100 dark:border-indigo-900/50' : 'border-slate-100 dark:border-slate-800'}`}>
        
        <div className="absolute top-4 left-4 z-10 flex gap-2">
            {item.isTest && <TestBadge />}
            {isSynced && (
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900/50" title="ذخیره شده در فضای ابری">
                    <CloudIcon />
                </div>
            )}
            {item.isGroupGift && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-black rounded-full shadow-lg ring-2 ring-white dark:ring-slate-900">
                    <UserGroupIcon /> هدیه گروهی
                </span>
            )}
            {item.allowOffers && !isFullyFunded && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-lg ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    <RadarIcon /> رادار فعال
                </span>
            )}
        </div>

        <div className="flex flex-col sm:flex-row items-center p-4 sm:p-6 gap-6">
            <div className="w-full sm:w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-inner relative">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🎁</div>
                )}
                {item.isUrgent && (
                    <div className="absolute bottom-2 right-2 bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-lg shadow-sm animate-pulse">فوری</div>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col w-full h-full py-1">
                <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white truncate">{item.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {item.purchasedFrom && (
                                <span className="text-[9px] font-black bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                                    تامین‌کننده: {item.purchasedFrom}
                                </span>
                            )}
                            {isOwner && item.allowOffers && (
                                <span className="text-[9px] font-black bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg border border-amber-100">
                                    در انتظار پیشنهاد قیمت...
                                </span>
                            )}
                        </div>
                    </div>
                    {hasTargetPrice && (
                        <div className="text-left">
                            <span className="text-sm sm:text-lg font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                {formatPrice(item.price)}
                            </span>
                        </div>
                    )}
                </div>

                {item.description && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-3 font-medium">{item.description}</p>}
                
                {item.isGroupGift && (
                    <div className="mt-5 w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <div className="flex justify-between items-end text-[10px] font-black mb-2.5">
                            <span className="text-indigo-600 text-sm">{Math.round(progressPercentage)}٪ تامین شده</span>
                            <span className="text-emerald-600 text-sm">باقیمانده: {formatPrice(Math.max(0, (item.price || 0) - fundedAmount))}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-1000" style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
                        </div>
                    </div>
                )}

                <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2 space-x-reverse">
                                {participants.slice(0, 3).map((p, idx) => (
                                    <div key={idx} className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-900/50 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-black text-indigo-600">{(p.userName || 'ن').charAt(0)}</div>
                                ))}
                            </div>
                            <span className="text-[9px] font-bold text-slate-400">
                                {participants.length > 0 ? `${participants.length} حامی` : 'بدون مشارکت'}
                            </span>
                        </div>
                        {item.createdAt && (
                            <span className="text-[8px] font-bold text-slate-300 mr-1">
                                ثبت شده در: {formatDateTime(item.createdAt)}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {isFriendView ? (
                            <button 
                                onClick={item.isGroupGift ? () => onContributeClick(item) : (isClaimedByCurrentUser ? onUnclaimItem : () => onClaimItem(item))}
                                disabled={isFullyFunded || isClaimedByOther}
                                className={`px-5 py-2.5 rounded-2xl font-black text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                                    isClaimedByCurrentUser 
                                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500' 
                                    : 'bg-rose-600 text-white'
                                }`}
                            >
                                {isFullyFunded ? 'تکمیل شده ✨' : isClaimedByCurrentUser ? '✅ رزرو شد' : item.isGroupGift ? 'مشارکت مالی' : 'رزرو هدیه'}
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => onEditItem(item)}
                                    className="px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[11px] shadow-md flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                                >
                                    <EditIcon /> ویرایش آرزو
                                </button>
                                <button 
                                    onClick={() => onDeleteItem(item.id)}
                                    className="p-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl hover:bg-rose-100 active:scale-90 transition-all border border-rose-100 dark:border-rose-900/30"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default WishlistItem;
