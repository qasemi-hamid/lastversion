
import React, { useState, useEffect, useRef } from 'react';
import { Wishlist, WishlistPrivacy } from '../types';
import { processFileForUpload } from '../services/imageService';

interface EditListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: Partial<Wishlist>) => Promise<void>;
  wishlist: Wishlist | null;
}

const LockClosedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H3a2 2 0 01-2-2v-5a2 2 0 012-2h2zm4-2a3 3 0 00-3 3v2h6V9a3 3 0 00-3-3z" clipRule="evenodd" />
    </svg>
);
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
);
const GlobeAltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.74 6.79 5.5 7.152 5.5h5.696c.362 0 .64.24.808.527a6.012 6.012 0 011.912 2.706C15.938 8.328 16 8.652 16 9v.055a6.05 6.05 0 01-2.062 4.415C13.488 13.924 13.21 14.168 12.848 14.168h-5.696c-.362 0-.64-.24-.808-.527a6.05 6.05 0 01-2.062-4.415V9c0-.348.062-.672.168-.973z" clipRule="evenodd" />
    </svg>
);
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

const EditListModal: React.FC<EditListModalProps> = ({ isOpen, onClose, onSave, wishlist }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<WishlistPrivacy>('private');
  const [coverImage, setCoverImage] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && wishlist) {
      setName(wishlist.name);
      setDescription(wishlist.description || '');
      setPrivacy(wishlist.privacy);
      setCoverImage(wishlist.coverImage || '');
    }
  }, [isOpen, wishlist]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setIsProcessingImage(true);
        try {
            const compressed = await processFileForUpload(e.target.files[0]);
            setCoverImage(compressed);
        } catch (err) {
            console.error("Cover image editing failed:", err);
        } finally {
            setIsProcessingImage(false);
        }
    }
  };

  if (!isOpen || !wishlist) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await onSave({ 
          name: name.trim(), 
          description: description.trim(), 
          privacy, 
          coverImage 
      });
      onClose();
    } catch (error) {
      alert('خطا در ذخیره تغییرات');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">ویرایش اطلاعات لیست</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[75vh] custom-scrollbar">
          
          {/* Cover Image Editor */}
          <div 
            className="relative h-40 bg-slate-100 dark:bg-slate-700 rounded-2xl overflow-hidden cursor-pointer group border-2 border-dashed border-slate-200 dark:border-slate-600"
            onClick={() => !isProcessingImage && fileInputRef.current?.click()}
          >
              {isProcessingImage ? (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-10">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                      <span className="text-[10px] text-white font-black">در حال فشرده‌سازی...</span>
                  </div>
              ) : coverImage ? (
                  <img src={coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : null}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="flex flex-col items-center text-white drop-shadow-md">
                      <PhotoIcon />
                      <span className="text-[10px] font-black mt-1">تغییر عکس کاور</span>
                  </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نام لیست</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-violet-500 outline-none text-slate-900 dark:text-white font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">توضیحات</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-violet-500 outline-none text-slate-900 dark:text-white font-medium resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">دسترسی</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPrivacy('private')}
                className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${privacy === 'private' ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300' : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}
              >
                <LockClosedIcon />
                <span className="text-[10px] font-bold mt-1">خصوصی</span>
              </button>
              <button
                type="button"
                onClick={() => setPrivacy('friends')}
                className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${privacy === 'friends' ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300' : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}
              >
                <UsersIcon />
                <span className="text-[10px] font-bold mt-1">دوستان</span>
              </button>
              <button
                type="button"
                onClick={() => setPrivacy('public')}
                className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${privacy === 'public' ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300' : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}
              >
                <GlobeAltIcon />
                <span className="text-[10px] font-bold mt-1">عمومی</span>
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSaving || isProcessingImage || !name.trim()}
              className="flex-[2] py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all flex justify-center items-center"
            >
              {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'ذخیره تغییرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListModal;
