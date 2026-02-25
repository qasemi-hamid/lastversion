
import React from 'react';
import { User } from '../types';

interface MobileNavigationProps {
  activeTab: 'home' | 'search' | 'add' | 'activity' | 'profile';
  onNavigate: (tab: 'home' | 'search' | 'add' | 'activity' | 'profile') => void;
  onAddClick: () => void;
  unreadCount?: number;
  currentUser: User | null;
}

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const BoxIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const TruckIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
  </svg>
);

const ShoppingBagIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const SearchIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const RibbonIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
  </svg>
);

const UserIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, onNavigate, onAddClick, unreadCount = 0, currentUser }) => {
  const isMerchant = currentUser?.role === 'merchant';

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-1/2 md:right-auto md:w-full md:max-w-lg md:-translate-x-1/2">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-2 border-white dark:border-slate-800 shadow-2xl rounded-3xl h-16 flex justify-between items-center px-4 relative">
        
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-all ${activeTab === 'profile' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}
        >
          <div className="relative">
            <UserIcon active={activeTab === 'profile'} />
            {unreadCount > 0 && activeTab !== 'profile' && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            )}
          </div>
          <span className="text-[9px] font-black mt-1 uppercase tracking-widest">{isMerchant ? 'حساب' : 'صندوقچه'}</span>
        </button>

        <button
          onClick={() => onNavigate('activity')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-all ${activeTab === 'activity' ? (isMerchant ? 'text-indigo-600' : 'text-pink-500') : 'text-slate-400'}`}
        >
          {isMerchant ? <TruckIcon active={activeTab === 'activity'} /> : <RibbonIcon active={activeTab === 'activity'} />}
          <span className="text-[9px] font-black mt-1 uppercase tracking-widest">{isMerchant ? 'سفارشات' : 'پویش‌ها'}</span>
        </button>

        <button
          onClick={onAddClick}
          className="flex flex-col items-center justify-center w-14 h-14 -mt-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-2xl shadow-rose-500/20 border-4 border-[#FDFBF9] dark:border-slate-950 transition-all active:scale-90"
        >
          <PlusIcon />
        </button>

        <button
          onClick={() => onNavigate('search')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-all ${activeTab === 'search' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          {isMerchant ? <BoxIcon active={activeTab === 'search'} /> : <SearchIcon active={activeTab === 'search'} />}
          <span className="text-[9px] font-black mt-1 uppercase tracking-widest">{isMerchant ? 'محصولات' : 'ویترین'}</span>
        </button>

        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-all ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          {isMerchant ? <HomeIcon active={activeTab === 'home'} /> : <ShoppingBagIcon active={activeTab === 'home'} />}
          <span className="text-[9px] font-black mt-1 uppercase tracking-widest">{isMerchant ? 'فروشگاه‌ها' : 'بازارچه'}</span>
        </button>

      </div>
    </div>
  );
};

export default MobileNavigation;
