
import React from 'react';
import FriendsManagement from './FriendsManagement';
import { User, Friendship } from '../types';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  allUsers: User[];
  friendships: Friendship[];
  friends: { user: User, friendshipId: string }[];
  pendingRequests: { user: User, friendship: Friendship }[];
  onSendRequest: (receiverId: string) => void;
  onAcceptRequest: (requestId: string) => void;
  onDeclineOrRemove: (requestId: string) => void;
  onSearchUsers: (query: string) => Promise<User[]>;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const FriendsModal: React.FC<FriendsModalProps> = (props) => {
  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4 sm:p-6" onClick={props.onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        {/* Close button moved to LEFT for RTL compatibility */}
        <div className="absolute top-5 left-5 z-20">
            <button onClick={props.onClose} className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-90">
                <CloseIcon />
            </button>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
             <FriendsManagement 
                {...props} 
                onRefresh={undefined}
             />
        </div>
      </div>
    </div>
  );
};

export default FriendsModal;
