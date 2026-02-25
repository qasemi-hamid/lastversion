
import React from 'react';
import { ProfileType, User } from '../types';

const ViewGridIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-20 w-20 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

interface FriendWelcomeProps {
    profileType: ProfileType;
    friends?: { user: User }[];
    onSelectFriend?: (userId: string) => void;
}

const FriendWelcome: React.FC<FriendWelcomeProps> = ({ profileType, friends = [], onSelectFriend }) => {
    const content = {
        personal: {
          title: 'نمای دوست',
          description: 'در این نما، شما می‌توانید لیست‌های آرزو را همانطور که دوستانتان می‌بینند، مشاهده کنید.',
          instruction: 'برای شروع، یک لیست از منوی کناری انتخاب کنید.'
        },
        charity: {
            title: 'نمای حامیان',
            description: 'در این نما، می‌توانید کمپین‌های خیریه خود را از دید یک حامی یا خیر مشاهده کنید.',
            instruction: 'برای شروع، یک کمپین را انتخاب کنید.'
        }
    }[profileType];

  // If we have friends passed (Mobile context usually), show them to allow selection
  if (friends.length > 0 && onSelectFriend) {
      return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-6 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">لیست دوستان</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">برای مشاهده لیست آرزوهای هر دوست، روی نام او کلیک کنید.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {friends.map(({ user }) => (
                        <button 
                            key={user.id}
                            onClick={() => onSelectFriend(user.id)}
                            className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3 hover:shadow-md transition-all text-right w-full"
                        >
                            <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                                <span className="font-bold text-lg">{user.name.charAt(0)}</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{user.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">مشاهده لیست‌ها</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </main>
      );
  }

  return (
    <main className="flex-1 flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-900">
      <div className="text-center max-w-lg">
        <ViewGridIcon />
        <h2 className="mt-6 text-3xl font-bold text-slate-800 dark:text-slate-100">{content.title}</h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          {content.description}
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 hidden md:block">
          {content.instruction}
        </p>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 md:hidden">
           از نوار پایین برای جابجایی استفاده کنید.
        </p>
      </div>
    </main>
  );
};

export default FriendWelcome;
