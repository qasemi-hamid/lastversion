
import React from 'react';
import { Notification, User, Friendship, Wishlist } from '../types';

interface ActivityFeedProps {
  notifications: Notification[]; // Kept for prop compatibility
  pendingRequests: { user: User, friendship: Friendship }[];
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  onClearNotifications: () => void;
  allWishlists: Wishlist[];
  allUsers: User[];
  onSelectWishlist: (id: string) => void;
}

const UserPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
    </svg>
);

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  pendingRequests,
  onAcceptRequest,
  onDeclineRequest,
}) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-full pb-20 p-4 space-y-6">
      
      {/* Pending Friend Requests */}
      {pendingRequests.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <UserPlusIcon />
            درخواست‌های دوستی ({pendingRequests.length})
          </h3>
          <div className="space-y-3">
            {pendingRequests.map(({ user, friendship }) => (
              <div key={friendship.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                    {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" /> : user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">می‌خواهد با شما دوست شود</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onAcceptRequest(friendship.id)}
                    className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                  >
                    قبول
                  </button>
                  <button 
                    onClick={() => onDeclineRequest(friendship.id)}
                    className="bg-white dark:bg-slate-600 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-500 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-500 transition-colors"
                  >
                    رد
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
            <UserPlusIcon />
            <p className="mt-2 text-sm">هیچ درخواست دوستی جدیدی ندارید.</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
