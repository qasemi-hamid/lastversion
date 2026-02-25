
import React, { useState, useCallback } from 'react';
import { WishlistItem } from '../types';

type ImportableWishlistItem = Pick<WishlistItem, 'requestedBy' | 'name' | 'description' | 'link' | 'price'>;

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportItems: (items: ImportableWishlistItem[]) => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImportItems }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
          setFile(selectedFile);
          setError(null);
      } else {
          setError('لطفاً یک فایل با فرمت CSV انتخاب کنید.');
          setFile(null);
      }
    }
  };

  const handleImport = () => {
    if (!file) {
      setError('لطفاً یک فایل را انتخاب کنید.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        
        if (rows.length <= 1) {
            throw new Error('فایل CSV خالی است یا فقط دارای سربرگ است.');
        }

        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        const expectedHeaders = ['requested by', 'name', 'description', 'link', 'price'];
        
        if(headers.length < 2 || !expectedHeaders.some(h => headers.includes(h))) {
            console.warn("Headers:", headers);
            throw new Error('فرمت سربرگ فایل CSV معتبر نیست. لطفاً فایل نمونه را بررسی کنید.');
        }

        const items: ImportableWishlistItem[] = rows.slice(1).map((row, index) => {
          const values = row.split(',');
          const item: ImportableWishlistItem = {
            requestedBy: values[0]?.trim() || 'نامشخص',
            name: values[1]?.trim() || `آیتم ${index + 1}`,
            description: values[2]?.trim() || '',
            link: values[3]?.trim() || '',
            price: values[4] && !isNaN(parseFloat(values[4])) ? parseFloat(values[4]) : undefined,
          };
          if (!item.name) throw new Error(`ردیف ${index + 2}: نام هدیه نمی‌تواند خالی باشد.`);
          return item;
        });

        onImportItems(items);
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'خطا در پردازش فایل.');
      }
    };
    reader.onerror = () => {
        setError('خطا در خواندن فایل.');
    };
    reader.readAsText(file);
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">وارد کردن آیتم‌ها از فایل</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          یک فایل CSV با درخواست‌های کارکنان بارگذاری کنید. این فایل به صورت خودکار به لیست فعلی شما اضافه خواهد شد.
        </p>
        
        <div className="mb-4">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-700 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <div className="flex justify-center items-center w-full px-6 py-10 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <UploadIcon />
                        <div className="flex text-sm text-slate-600 dark:text-slate-300">
                            <span>{file ? file.name : 'یک فایل را انتخاب کنید'}</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">فقط فایل CSV</p>
                    </div>
                </div>
            </label>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm text-slate-600 dark:text-slate-300">
            <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-100">فرمت مورد نیاز فایل CSV:</h4>
            <p className="mb-2">فایل شما باید شامل ستون‌هایی با این ترتیب باشد (سربرگ ضروری نیست اما توصیه می‌شود):</p>
            <code className="block whitespace-pre-wrap p-2 bg-slate-200 dark:bg-slate-900 rounded-md text-xs">
              Requested By,Name,Description,Link,Price
            </code>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">مثال: <br/><code>علی رضایی,هدست گیمینگ,یک هدست با کیفیت برای بازی,https://example.com/headset,1500000</code></p>
        </div>

        <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md font-semibold hover:bg-slate-200 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 transition-colors"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={!file}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md font-semibold hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              وارد کردن
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
