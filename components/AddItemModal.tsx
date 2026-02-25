
import React, { useState, useEffect, useRef } from 'react';
import CameraScannerModal from './CameraScannerModal';
import { fetchProductDetails } from '../services/geminiService';
import { processFileForUpload } from '../services/imageService';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: { 
    name: string; 
    description: string; 
    link: string;
    isGroupGift: boolean;
    allowOffers: boolean;
    price: number | undefined;
    imageUrl?: string;
    purchasedFrom?: string;
  }) => Promise<void>; 
  onOpenCameraScanner: () => void;
  initialData?: { name: string; description: string } | null;
  onClearInitialData: () => void;
  onNavigateTab?: (tab: 'home' | 'search' | 'add' | 'activity' | 'profile') => void;
}

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

// --- Icons ---
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;

const MenuCard = ({ icon, label, sub, color, onClick }: { icon: React.ReactNode, label: string, sub: string, color: string, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className="w-full flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-50 dark:border-slate-700/50 hover:border-indigo-500 hover:shadow-xl transition-all group text-right"
    >
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <div className="flex-1">
            <h4 className="font-black text-slate-800 dark:text-white text-sm">{label}</h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{sub}</p>
        </div>
        <div className="text-slate-300 group-hover:text-indigo-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </div>
    </button>
);

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAddItem, initialData, onClearInitialData, onNavigateTab }) => {
  const [view, setView] = useState<'menu' | 'manual' | 'link'>('menu');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [purchasedFrom, setPurchasedFrom] = useState('');
  const [isGroupGift, setIsGroupGift] = useState(false);
  const [allowOffers, setAllowOffers] = useState(true);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(undefined);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isFetchingLink, setIsFetchingLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setView('manual');
            onClearInitialData();
        } else {
            setView('menu');
            setName(''); setDescription(''); setLink(''); setPrice(undefined); 
            setPurchasedFrom(''); setIsGroupGift(false); setAllowOffers(true); setSelectedImageUrl(undefined);
        }
    }
  }, [isOpen, initialData]);

  const handleLinkSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!link.trim()) return;
      setIsFetchingLink(true);
      try {
          const details = await fetchProductDetails(link);
          setName(details.name);
          setDescription(details.description);
          setView('manual');
      } catch (err) {
          setView('manual');
      } finally {
          setIsFetchingLink(false);
      }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setIsProcessingImage(true);
          try {
              const compressed = await processFileForUpload(e.target.files[0]);
              setSelectedImageUrl(compressed);
              setView('manual');
          } catch (err) {
              console.error("Image processing failed:", err);
          } finally {
              setIsProcessingImage(false);
          }
      }
  };

  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
        await onAddItem({ 
            name, description, link, isGroupGift, allowOffers, price, 
            imageUrl: selectedImageUrl, purchasedFrom 
        });
        onClose();
    } catch (err) {
        alert('خطا در ثبت آرزو');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80] flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 dark:bg-slate-900 rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in flex flex-col relative max-h-[90vh]" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-3">
                {view !== 'menu' && (
                    <button onClick={() => setView('menu')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                )}
                <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                    {view === 'menu' ? 'افزودن آرزو به لیست' : view === 'link' ? 'ثبت از طریق لینک' : 'ثبت دستی آرزو'}
                </h2>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-50 dark:bg-slate-700 text-slate-400 rounded-full hover:bg-slate-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4 custom-scrollbar">
            {view === 'menu' && (
                <div className="animate-fade-in space-y-3 pb-4">
                    <MenuCard 
                        icon={<SparklesIcon />} 
                        label="انتخاب از ویترین آرزوها" 
                        sub="آرزوهای محبوب و پیشنهادی جامعه"
                        color="bg-indigo-600" 
                        onClick={() => { onNavigateTab?.('search'); onClose(); }} 
                    />
                    <MenuCard 
                        icon={<StoreIcon />} 
                        label="جستجو در بازارچه برندها" 
                        sub="خرید مستقیم از فروشگاه‌های معتبر"
                        color="bg-rose-600" 
                        onClick={() => { onNavigateTab?.('home'); onClose(); }} 
                    />
                    <MenuCard 
                        icon={<LinkIcon />} 
                        label="کپی لینک هوشمند" 
                        sub="استخراج خودکار اطلاعات از سایت‌های دیگر"
                        color="bg-sky-500" 
                        onClick={() => setView('link')} 
                    />
                    <MenuCard 
                        icon={<CameraIcon />} 
                        label="اسکن با هوش مصنوعی" 
                        sub="تشخیص کالا از طریق دوربین"
                        color="bg-violet-600" 
                        onClick={() => setIsCameraOpen(true)} 
                    />
                    <MenuCard 
                        icon={isProcessingImage ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <PhotoIcon />} 
                        label="انتخاب از گالری تصاویر" 
                        sub="آپلود عکس کالای مورد نظر"
                        color="bg-emerald-500" 
                        onClick={() => !isProcessingImage && fileInputRef.current?.click()} 
                    />
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <MenuCard 
                            icon={<PlusIcon />} 
                            label="ثبت دستی (آیتم جدید)" 
                            sub="وارد کردن مشخصات به صورت کامل"
                            color="bg-slate-700" 
                            onClick={() => setView('manual')} 
                        />
                    </div>
                </div>
            )}

            {view === 'link' && (
                <div className="animate-fade-in space-y-6 py-4">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-sky-100 dark:bg-sky-900/30 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LinkIcon />
                        </div>
                        <p className="text-sm text-slate-500 font-bold leading-relaxed px-4">لینک کالا را از دیجی‌کالا، اینستاگرام یا هر سایتی کپی کرده و اینجا قرار دهید.</p>
                    </div>
                    <form onSubmit={handleLinkSubmit} className="space-y-4">
                        <div className="relative group">
                            <input 
                                type="url" 
                                value={link}
                                onChange={e => setLink(e.target.value)}
                                className="w-full p-5 pr-14 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl text-sm font-bold outline-none focus:border-sky-500 transition-all dir-ltr"
                                placeholder="https://..."
                                required
                                autoFocus
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors"><LinkIcon /></div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isFetchingLink}
                            className="w-full py-4 bg-sky-600 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-sky-500/20 active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                        >
                            {isFetchingLink ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> در حال پردازش...</> : 'دریافت هوشمند مشخصات'}
                        </button>
                    </form>
                </div>
            )}

            {view === 'manual' && (
                <form onSubmit={handleSubmitManual} className="animate-fade-in space-y-5 pb-8">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-inner relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            {isProcessingImage ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                                    <span className="text-[8px] font-black text-slate-500 uppercase">بهینه‌سازی...</span>
                                </div>
                            ) : selectedImageUrl ? (
                                <img src={selectedImageUrl} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-slate-300 flex flex-col items-center">
                                    <PhotoIcon />
                                    <span className="text-[9px] mt-1 font-bold uppercase">تصویر آرزو</span>
                                </div>
                            )}
                            {!isProcessingImage && (
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black">تغییر عکس</div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase mr-1">نام آرزو (کالا) *</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-transparent border-none text-base font-black text-slate-900 dark:text-white outline-none" placeholder="مثلاً: صندلی گیمینگ" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase mr-1">قیمت (تومان)</label>
                                <input type="number" value={price || ''} onChange={e => setPrice(Number(e.target.value))} className="w-full p-2 bg-transparent border-none text-base font-black text-slate-900 dark:text-white outline-none" placeholder="اختیاری" />
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase mr-1">نام فروشگاه</label>
                                <input type="text" value={purchasedFrom} onChange={e => setPurchasedFrom(e.target.value)} className="w-full p-2 bg-transparent border-none text-base font-black text-slate-900 dark:text-white outline-none" placeholder="دیجی‌کالا..." />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase mr-1">توضیحات تکمیلی یا لینک</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full p-2 bg-transparent border-none text-sm font-bold text-slate-900 dark:text-white outline-none resize-none" placeholder="جزئیات بیشتر..."></textarea>
                        </div>

                        <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-between">
                            <div className="flex-1 ml-4">
                                <p className="text-xs font-black text-indigo-900 dark:text-indigo-200">دریافت پیشنهاد تخفیف</p>
                                <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5 leading-relaxed">با فعال‌سازی، فروشگاه‌ها برای این کالا به شما قیمت رقابتی می‌دهند.</p>
                            </div>
                            <button type="button" onClick={() => setAllowOffers(!allowOffers)} className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${allowOffers ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${allowOffers ? 'right-7' : 'right-1'}`}></div>
                            </button>
                        </div>

                        <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black text-indigo-900 dark:text-indigo-200">فعال‌سازی هدیه گروهی</p>
                                <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">اجازه مشارکت مالی چند نفر در این آرزو</p>
                            </div>
                            <button type="button" onClick={() => setIsGroupGift(!isGroupGift)} className={`relative w-12 h-6 rounded-full transition-colors ${isGroupGift ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isGroupGift ? 'right-7' : 'right-1'}`}></div>
                            </button>
                        </div>
                    </div>

                    <div className="pt-6 flex gap-3">
                        <button type="submit" disabled={isSubmitting || isProcessingImage} className="flex-[2] py-4 bg-rose-600 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-rose-500/20 flex justify-center items-center gap-2 active:scale-95 transition-all disabled:opacity-50">
                            {isSubmitting ? <LoadingSpinner /> : 'ثبت نهایی در لیست آرزوها'}
                        </button>
                    </div>
                </form>
            )}
        </div>
        
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </div>

      {isCameraOpen && (
        <CameraScannerModal 
            isOpen={isCameraOpen} 
            onClose={() => setIsCameraOpen(false)} 
            onScanComplete={(details) => {
                setName(details.name);
                setDescription(details.description);
                setView('manual');
                setIsCameraOpen(false);
            }} 
        />
      )}
    </div>
  );
};

export default AddItemModal;
