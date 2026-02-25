
import React, { useState, useEffect, useRef } from 'react';
import { WishlistItem } from '../types';
import CameraScannerModal from './CameraScannerModal';
import { processFileForUpload } from '../services/imageService';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveItem: (item: WishlistItem) => void;
  item: WishlistItem | null;
}

const PhotoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
);

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

const TicketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94c-1.246-.11-2.25-1.166-2.25-2.435s1.004-2.325 2.25-2.435V6.75c0-.414-.336-.75-.75-.75H3.75a.75.75 0 00-.75.75v3.12c1.246.11 2.25 1.166 2.25 2.435S4.246 15.95 3 16.06z" clipRule="evenodd" /></svg>
);

const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose, onSaveItem, item }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [isGroupGift, setIsGroupGift] = useState(false);
  const [allowOffers, setAllowOffers] = useState(false);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [expiryDate, setExpiryDate] = useState('');
  const [purchasedFrom, setPurchasedFrom] = useState('');
  const [affiliateCode, setAffiliateCode] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(undefined);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayShamsiDate = (isoDate: string) => {
    if (!isoDate) return '';
    try {
        return new Date(isoDate).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return ''; }
  };

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setDescription(item.description || '');
      setLink(item.link || '');
      setIsGroupGift(item.isGroupGift);
      setAllowOffers(!!item.allowOffers);
      setPrice(item.price);
      setExpiryDate(item.expiryDate || '');
      setPurchasedFrom(item.purchasedFrom || '');
      setAffiliateCode(item.affiliateCode || '');
      setSelectedImageUrl(item.imageUrl);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setIsProcessingImage(true);
        try {
            const compressed = await processFileForUpload(e.target.files[0]);
            setSelectedImageUrl(compressed);
        } catch (err) {
            console.error("Edit item image processing failed:", err);
        } finally {
            setIsProcessingImage(false);
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const updatedItem: WishlistItem = {
      ...item,
      name: name.trim(),
      description,
      link,
      isGroupGift,
      allowOffers,
      price: price,
      expiryDate,
      purchasedFrom: purchasedFrom.trim() || undefined,
      affiliateCode: affiliateCode.trim() || undefined,
      imageUrl: selectedImageUrl,
    };
    onSaveItem(updatedItem);
  };

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">ویرایش آرزو</h2>
        
        {/* Image Selection Section */}
        <div className="mb-6 flex flex-col items-center">
            <div className="w-28 h-28 rounded-2xl bg-slate-100 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden mb-3 relative group">
                {isProcessingImage ? (
                    <div className="flex flex-col items-center">
                        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-1"></div>
                        <span className="text-[7px] font-black uppercase text-slate-500">بهینه‌سازی...</span>
                    </div>
                ) : selectedImageUrl ? (
                    <img src={selectedImageUrl} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                    <div className="text-slate-400 text-center p-2">
                        <PhotoIcon />
                        <p className="text-[9px] mt-1">بدون تصویر</p>
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                <button type="button" onClick={() => !isProcessingImage && setIsCameraOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50"><CameraIcon /> اسکن هوشمند</button>
                <button type="button" onClick={() => !isProcessingImage && fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"><PhotoIcon /> انتخاب عکس</button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">نام آیتم <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">نام فروشگاه</label>
                <input type="text" value={purchasedFrom} onChange={(e) => setPurchasedFrom(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm" placeholder="دیجی‌کالا" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">کد تخفیف (Discount Code)</label>
                <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"><TicketIcon /></div>
                    <input type="text" value={affiliateCode} onChange={(e) => setAffiliateCode(e.target.value)} className="w-full pr-10 pl-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-mono dir-ltr" placeholder="GIFT10" />
                </div>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">قیمت (تومان)</label>
                <input type="number" value={price ?? ''} onChange={(e) => setPrice(e.target.value === '' ? undefined : Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">تاریخ مناسبت</label>
                <div className="flex flex-col gap-1">
                    <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs" />
                    {expiryDate && <span className="text-[9px] font-black text-violet-600 mr-1">{displayShamsiDate(expiryDate)}</span>}
                </div>
              </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">توضیحات</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm"
            />
          </div>

          <div className="mt-2 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 flex items-center justify-between border border-indigo-100 dark:border-indigo-800">
                <div className="flex-1 ml-4">
                    <span className="font-black text-indigo-900 dark:text-indigo-200 text-xs">دریافت پیشنهاد تخفیف</span>
                    <p className="text-[9px] text-indigo-600/70 dark:text-indigo-400 leading-relaxed">فروشگاه‌ها می‌توانند برای این کالا پیشنهاد رقابتی بفرستند.</p>
                </div>
                <button type="button" onClick={() => setAllowOffers(!allowOffers)} className={`${allowOffers ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 ring-offset-2 outline-none`}>
                    <span className={`${allowOffers ? '-translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200`} />
                </button>
          </div>

          <div className="mt-2 p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/10 flex items-center justify-between border border-violet-100 dark:border-violet-800">
                <div className="mr-1">
                    <span className="font-black text-violet-900 dark:text-violet-200 text-xs">هدیه گروهی</span>
                    <p className="text-[9px] text-violet-600/70 dark:text-violet-400">مشارکت دوستان در خرید</p>
                </div>
                <button type="button" onClick={() => setIsGroupGift(!isGroupGift)} className={`${isGroupGift ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:ring-2 focus:ring-violet-500 ring-offset-2 outline-none`}>
                    <span className={`${isGroupGift ? '-translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200`} />
                </button>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-black text-xs hover:bg-slate-200 transition-colors">انصراف</button>
            <button type="submit" disabled={!name.trim() || isProcessingImage} className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl font-black text-xs shadow-lg disabled:opacity-50">ذخیره تغییرات</button>
          </div>
        </form>
      </div>
    </div>
    {isCameraOpen && (
      <CameraScannerModal 
          isOpen={isCameraOpen} 
          onClose={() => setIsCameraOpen(false)} 
          onScanComplete={(details) => {
              setName(details.name);
              setDescription(details.description);
              setIsCameraOpen(false);
          }} 
      />
    )}
    </>
  );
};

export default EditItemModal;
