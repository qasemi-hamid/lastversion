
import React from 'react';
import { User, Notification } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLoginClick: () => void;
  onFinReportClick: () => void;
  onSettingsClick: () => void;
  onRefresh: () => void;
  notifications: Notification[];
  isGuest?: boolean;
  isSyncing?: boolean;
}

const RefreshIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className || "w-4 h-4"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ currentUser, onLoginClick, onRefresh, isSyncing }) => {
    return (
        <header className="sticky top-0 z-40 h-16 flex items-center px-6 justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
            {/* Logo & Refresh Action */}
            <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-rose-600 tracking-tighter">Giftino</span>
                
                <button 
                    onClick={onRefresh}
                    disabled={isSyncing}
                    className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 transition-all active:scale-90 ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="بروزرسانی داده‌ها"
                >
                    <RefreshIcon className={`w-4 h-4 ${isSyncing ? 'animate-spin text-rose-600' : ''}`} />
                </button>

                {isSyncing && (
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-900/20 rounded-full border border-rose-100 dark:border-rose-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                        <span className="text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Syncing</span>
                    </div>
                )}
            </div>

            {/* Actions area */}
            <div className="flex items-center gap-2">
                {!currentUser && (
                    <button 
                        onClick={onLoginClick}
                        className="text-xs font-black text-white bg-rose-600 px-6 py-2.5 rounded-2xl hover:shadow-xl hover:shadow-rose-500/20 transition-all active:scale-95"
                    >
                        ورود به سیستم
                    </button>
                )}
                {currentUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400 border border-slate-200 dark:border-slate-700">
                        {currentUser.name.charAt(0)}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
