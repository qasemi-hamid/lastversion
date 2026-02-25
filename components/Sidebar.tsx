
import React, { useState, useEffect } from 'react';
import { Wishlist, ProfileType, User, UserView } from '../types';
import { SidebarListSkeleton } from './Skeleton';

interface SidebarProps {
  wishlists: Wishlist[];
  activeListId: string | null;
  onSelectList: (id: string) => void;
  onAddNewList: () => void;
  profileType: ProfileType;
  mainView: 'lists' | 'friends' | 'charity';
  onSetMainView: (view: 'lists' | 'friends' | 'charity') => void;
  lastWishlistInteraction: Record<string, string>;
  friends: User[];
  upcomingBirthdays: { user: User; daysUntil: number }[];
  userView: UserView;
  onDeleteList: (listId: string) => void;
  currentUser: User | null;
}

const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const RibbonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-pink-500"><path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { wishlists, activeListId, onSelectList, onAddNewList, mainView, onSetMainView, currentUser, onDeleteList } = props;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial loading simulation
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <aside className="bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 w-72 h-full hidden md:flex flex-col p-4">
        <div className="flex border-b border-slate-100 dark:border-slate-700 mb-6">
            <button onClick={() => onSetMainView('lists')} className={`flex-1 py-3 text-sm font-black transition-all ${mainView === 'lists' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-400'}`}>لیست‌ها</button>
            <button onClick={() => onSetMainView('charity')} className={`flex-1 py-3 text-sm font-black transition-all flex items-center justify-center gap-1 ${mainView === 'charity' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-slate-400'}`}><RibbonIcon /> پویش‌ها</button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar">
            {isLoading ? (
                <SidebarListSkeleton />
            ) : (
                <nav className="space-y-1">
                    {wishlists.map(list => (
                        <div key={list.id} className="group flex items-center gap-1">
                            <button
                                onClick={() => onSelectList(list.id)}
                                className={`flex-1 flex items-center justify-between p-3 rounded-2xl text-right text-xs font-black transition-all ${activeListId === list.id ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                            >
                                <div className="flex items-center gap-3"><ListIcon /> <span className="truncate w-32">{list.name}</span></div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeListId === list.id ? 'bg-rose-200' : 'bg-slate-200 dark:bg-slate-700'}`}>{list.items.length}</span>
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteList(list.id); }}
                                className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                                title="حذف سریع لیست"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    ))}
                </nav>
            )}
        </div>

        <button onClick={onAddNewList} className="mt-4 w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
            <PlusIcon /> ایجاد لیست جدید
        </button>
    </aside>
  );
};

export default Sidebar;
