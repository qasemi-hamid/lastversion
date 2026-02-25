
import React, { useState } from 'react';
import { User } from '../types';

interface CreateGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends: User[];
  onCreateGroup: (name: string, memberIds: string[]) => void;
}

const CreateGroupChatModal: React.FC<CreateGroupChatModalProps> = ({ isOpen, onClose, friends, onCreateGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleToggleFriend = (friendId: string) => {
    const newSelection = new Set(selectedFriends);
    if (newSelection.has(friendId)) {
      newSelection.delete(friendId);
    } else {
      newSelection.add(friendId);
    }
    setSelectedFriends(newSelection);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!groupName.trim()) {
      setError('نام گروه نمی‌تواند خالی باشد.');
      return;
    }
    if (selectedFriends.size === 0) {
      setError('حداقل یک دوست را برای گروه انتخاب کنید.');
      return;
    }
    onCreateGroup(groupName.trim(), Array.from(selectedFriends));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">ایجاد گروه جدید</h2>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="mb-4">
            <label htmlFor="groupName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">نام گروه</label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              placeholder="مثلاً، هماهنگی هدیه تولد"
              required
              autoFocus
            />
          </div>

          <div className="mb-4 flex-1 flex flex-col">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">افزودن اعضا</label>
            <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-md p-2 space-y-2 bg-slate-50 dark:bg-slate-900/50">
                {friends.length > 0 ? friends.map(friend => (
                    <div key={friend.id} onClick={() => handleToggleFriend(friend.id)} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                        <span className="text-slate-700 dark:text-slate-200">{friend.name}</span>
                        <input
                            type="checkbox"
                            checked={selectedFriends.has(friend.id)}
                            readOnly
                            className="h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 pointer-events-none"
                        />
                    </div>
                )) : (
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 p-4">برای ایجاد گروه ابتدا باید دوستی داشته باشید.</p>
                )}
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md font-semibold hover:bg-slate-200 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 transition-colors">انصراف</button>
            <button type="submit" className="px-4 py-2 bg-rose-500 text-white rounded-md font-semibold hover:bg-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 dark:focus:ring-offset-slate-800">ایجاد گروه</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupChatModal;
