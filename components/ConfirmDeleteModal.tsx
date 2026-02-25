
import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">حذف آیتم</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          آیا از حذف آیتم <span className="font-bold text-violet-600 dark:text-violet-400">"{itemName}"</span> مطمئن هستید؟ این عمل غیرقابل بازگشت است.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md font-semibold hover:bg-slate-200 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 transition-colors"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-800"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;

interface ConfirmDeleteListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  listName: string;
}

export const ConfirmDeleteListModal: React.FC<ConfirmDeleteListModalProps> = ({ isOpen, onClose, onConfirm, listName }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">حذف لیست</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            آیا از حذف لیست <span className="font-bold text-violet-600 dark:text-violet-400">"{listName}"</span> مطمئن هستید؟ تمام آیتم‌های داخل آن نیز حذف خواهند شد. این عمل غیرقابل بازگشت است.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md font-semibold hover:bg-slate-200 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 transition-colors"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-800"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    );
};
