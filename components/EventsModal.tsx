
import React, { useState } from 'react';
import { Notification, User, Transaction } from '../types';
import { updateItem, markNotificationAsRead } from '../services/api';

interface EventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  upcomingBirthdays: { user: User; daysUntil: number }[];
  onMarkAsRead: (id: string) => void;
  transactions?: Transaction[];
  onRefresh?: () => Promise<void>;
  onAcceptFriend?: (id: string) => Promise<void>;
  onRejectFriend?: (id: string) => Promise<void>;
}

const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const GiftIcon = () => <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600 dark:text-violet-300" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a2.5 2.5 0 00-2.5 2.5V7h5V4.5A2.5 2.5 0 0010 2zM3 8v8a2 2 0 002 2h10a2 2 0 002-2V8H3zm3.494 2.126a.5.5 0 01.866.499l-.5 2.5a.5.5 0 11-.976-.198l.5-2.5a.5.5 0 01.11-.301zM13.506 10.126a.5.5 0 01.11.301l.5 2.5a.5.5 0 11-.976.198l-.5-2.5a.5.5 0 01.866-.499z" /></svg></div>;
const CalendarIcon = () => <div className="h-8 w-8 rounded-full bg-fuchsia-100 dark:bg-fuchsia-500/20 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg></div>;
const MoneyIcon = () => <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg></div>;
const CakeIcon = () => <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-600 dark:text-rose-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.48 3.5 3.5 0 011.791 2.606 3.7 3.7 0 011.299-.658 3.5 3.5 0 013.583.443A3.7 3.7 0 0113.5 15.317V19a2 2 0 104 0v-3.683a3.7 3.7 0 011.055.48 3.5 3.5 0 011.791 2.606 3.7 3.7 0 011.299-.658 3.5 3.5 0 013.583.443 3.7 3.7 0 01.358-1.536V12a2 2 0 00-2-2V9a2 2 0 00-2-2v1a2 2 0 00-2 2V6a2 2 0 00-2-2V3a1 1 0 00-2 0v3zM6 13.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" /></svg></div>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const SparklesIcon = () => <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0V6H3a1 1 0 110-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" /></svg></div>;
const UserPlusIcon = () => <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" /></svg></div>;

const formatTimeAgo = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    if (seconds < 60) return `همین الان`;
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    if (hours < 24) return `${hours} ساعت پیش`;
    return `${days} روز پیش`;
};

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'funded': return <GiftIcon />;
        case 'offer_received': return <SparklesIcon />;
        case 'friend_request': return <UserPlusIcon />;
        case 'expiry': case 'claim_expiry': case 'claim_reminder': return <CalendarIcon />;
        case 'payout_complete': case 'refund': case 'cash_gift': return <MoneyIcon />;
        case 'birthday': return <CakeIcon />;
        default: return <BellIcon />;
    }
};

const EventsModal: React.FC<EventsModalProps> = ({ isOpen, onClose, notifications, upcomingBirthdays, onMarkAsRead, onRefresh, onAcceptFriend, onRejectFriend }) => {
  const [tab, setTab] = useState<'notifications' | 'birthdays'>('notifications');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAcceptOffer = async (notif: any) => {
      if (!notif.relatedItemId) return;
      setProcessingId(notif.id);
      try {
          // صاحب لیست پیشنهاد فروشنده را تایید میکند -> قیمت و فروشنده آیتم آپدیت میشود
          await updateItem(notif.relatedItemId, { 
              price: notif.offerPrice, 
              purchasedFrom: notif.merchantName 
          });
          
          await markNotificationAsRead(notif.id);
          
          if (onRefresh) {
              await onRefresh();
          }
          
          alert(`پیشنهاد فروشگاه ${notif.merchantName} با قیمت ${notif.offerPrice.toLocaleString('fa-IR')} تومان با موفقیت جایگزین شد.`);
      } catch (e) { 
          alert('خطا در تایید پیشنهاد'); 
      } finally { 
          setProcessingId(null); 
      }
  };

  const handleAcceptFriendRequest = async (notif: Notification) => {
      if (!notif.relatedFriendshipId || !onAcceptFriend) return;
      setProcessingId(notif.id);
      try {
          await onAcceptFriend(notif.relatedFriendshipId);
          await markNotificationAsRead(notif.id);
          if (onRefresh) await onRefresh();
      } catch (e) { alert('خطا در تایید دوستی'); } finally { setProcessingId(null); }
  };

  const handleRejectFriendRequest = async (notif: Notification) => {
      if (!notif.relatedFriendshipId || !onRejectFriend) return;
      setProcessingId(notif.id);
      try {
          await onRejectFriend(notif.relatedFriendshipId);
          await markNotificationAsRead(notif.id);
          if (onRefresh) await onRefresh();
      } catch (e) { alert('خطا در رد درخواست'); } finally { setProcessingId(null); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex justify-center items-end sm:items-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md h-[85vh] sm:h-auto sm:max-h-[80vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">رخدادهای من</h2>
            <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 transition-colors"><CloseIcon /></button>
        </div>

        <div className="flex p-2 bg-slate-50 dark:bg-slate-800/50">
            <button onClick={() => setTab('notifications')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${tab === 'notifications' ? 'bg-white dark:bg-slate-700 shadow text-violet-600' : 'text-slate-500'}`}>اعلان‌ها ({notifications.filter(n => !n.read).length})</button>
            <button onClick={() => setTab('birthdays')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${tab === 'birthdays' ? 'bg-white dark:bg-slate-700 shadow text-fuchsia-600' : 'text-slate-500'}`}>تولدها ({upcomingBirthdays.length})</button>
        </div>

        <div className="flex-1 overflow-y-auto">
            {tab === 'notifications' && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length > 0 ? notifications.map(n => (
                        <div key={n.id} className={`p-4 transition-colors ${!n.read ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''}`}>
                            <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0">{getNotificationIcon(n.type)}</div>
                                <div className="flex-grow">
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">{n.message}</p>
                                    <p className="text-[10px] text-slate-400 mt-2 font-medium">{formatTimeAgo(n.createdAt)}</p>
                                    
                                    {n.type === 'friend_request' && !n.read && (
                                        <div className="mt-4 flex gap-2">
                                            <button 
                                                onClick={() => handleAcceptFriendRequest(n)}
                                                disabled={processingId === n.id}
                                                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                                            >
                                                {processingId === n.id ? '...' : 'قبول درخواست'}
                                            </button>
                                            <button 
                                                onClick={() => handleRejectFriendRequest(n)}
                                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-[10px] font-black hover:bg-rose-50 hover:text-rose-500"
                                            >
                                                رد
                                            </button>
                                        </div>
                                    )}

                                    {n.type === 'offer_received' && !n.read && (
                                        <div className="mt-4 flex gap-2">
                                            <button 
                                                onClick={() => handleAcceptOffer(n)}
                                                disabled={processingId === n.id}
                                                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                                            >
                                                {processingId === n.id ? '...' : 'تایید و جایگزینی قیمت'}
                                            </button>
                                            <button 
                                                onClick={() => markNotificationAsRead(n.id)}
                                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-[10px] font-black hover:bg-rose-50 hover:text-rose-500"
                                            >
                                                رد پیشنهاد
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {!n.read && !['offer_received', 'friend_request'].includes(n.type) && <div className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-violet-500" onClick={() => onMarkAsRead(n.id)}></div>}
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 font-bold">رخدادی یافت نشد.</div>
                    )}
                </div>
            )}
            
            {tab === 'birthdays' && (
                <div className="p-4 space-y-4">
                    {upcomingBirthdays.length > 0 ? upcomingBirthdays.map((b, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 overflow-hidden flex items-center justify-center text-lg shadow-sm">
                                     {b.user.avatar ? <img src={b.user.avatar} className="w-full h-full object-cover" /> : b.user.name.charAt(0)}
                                 </div>
                                 <div>
                                     <h4 className="text-sm font-black text-slate-900 dark:text-white">{b.user.name}</h4>
                                     <p className="text-[10px] text-slate-500 font-bold">{b.daysUntil === 0 ? 'همین امروز!' : `${b.daysUntil} روز مانده`}</p>
                                 </div>
                             </div>
                             <button className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-[10px] font-black shadow-lg shadow-rose-500/20 active:scale-95 transition-all">ارسال کادو</button>
                        </div>
                    )) : (
                        <div className="text-center py-20 text-slate-400 font-bold">در ۳۰ روز آینده تولدی در پیش نیست.</div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default EventsModal;
