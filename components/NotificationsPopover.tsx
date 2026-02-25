
import React from 'react';
import { Notification } from '../types';

interface NotificationsPopoverProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

const GiftIcon = () => (
    <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600 dark:text-violet-300" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a2.5 2.5 0 00-2.5 2.5V7h5V4.5A2.5 2.5 0 0010 2zM3 8v8a2 2 0 002 2h10a2 2 0 002-2V8H3zm3.494 2.126a.5.5 0 01.866.499l-.5 2.5a.5.5 0 11-.976-.198l.5-2.5a.5.5 0 01.11-.301zM13.506 10.126a.5.5 0 01.11.301l.5 2.5a.5.5 0 11-.976.198l-.5-2.5a.5.5 0 01.866-.499z" />
        </svg>
    </div>
);

const CalendarIcon = () => (
    <div className="h-8 w-8 rounded-full bg-fuchsia-100 dark:bg-fuchsia-500/20 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
    </div>
);

const MoneyIcon = () => (
    <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
    </div>
);

const CakeIcon = () => (
    <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-600 dark:text-rose-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.48 3.5 3.5 0 011.791 2.606 3.7 3.7 0 011.299-.658 3.5 3.5 0 013.583.443A3.7 3.7 0 0113.5 15.317V19a2 2 0 104 0v-3.683a3.7 3.7 0 011.055.48 3.5 3.5 0 011.791 2.606 3.7 3.7 0 011.299-.658 3.5 3.5 0 013.583.443 3.7 3.7 0 01.358-1.536V12a2 2 0 00-2-2V9a2 2 0 00-2-2v1a2 2 0 00-2 2V6a2 2 0 00-2-2V3a1 1 0 00-2 0v3zM6 13.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
        </svg>
    </div>
);

const ListIcon = () => (
    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
    </div>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

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
        case 'expiry': case 'claim_expiry': case 'claim_reminder': return <CalendarIcon />;
        case 'payout_complete': case 'refund': case 'cash_gift': return <MoneyIcon />;
        case 'birthday': return <CakeIcon />;
        case 'list_created': return <ListIcon />;
        default: return <BellIcon />;
    }
};


const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 z-30">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">اعلان‌ها</h3>
                {unreadCount > 0 && (
                    <button 
                        onClick={onMarkAllAsRead}
                        className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                    >
                        علامت زدن همه به عنوان خوانده شده
                    </button>
                )}
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    <ul>
                        {notifications.map(notification => (
                            <li key={notification.id} className={`border-b border-slate-100 dark:border-slate-700/50 relative ${!notification.read ? 'bg-violet-50/50 dark:bg-violet-500/10' : ''}`}>
                                <button
                                    onClick={() => onMarkAsRead(notification.id)}
                                    className="w-full flex items-start gap-4 p-4 text-right hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="flex-shrink-0">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{notification.message}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formatTimeAgo(notification.createdAt)}</p>
                                    </div>
                                </button>
                                {!notification.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-violet-500 rounded-full"></div>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center p-12 text-slate-500 dark:text-slate-400">
                        <BellIcon />
                        <p className="mt-4 text-sm font-medium">هیچ اعلان جدیدی وجود ندارد</p>
                        <p className="text-xs mt-1">وقتی رویداد جدیدی رخ دهد، اینجا به شما اطلاع داده می‌شود.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPopover;
