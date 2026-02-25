
import React, { useState, useCallback, useEffect } from 'react';
import { MOCK_MERCHANTS } from '../data/seedData';

interface ShippingAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  recipientName: string;
  address: string;
  link?: string;
}

const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
);
const ReserveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
    </svg>
);
const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const ShippingAddressModal: React.FC<ShippingAddressModalProps> = ({ isOpen, onClose, onConfirm, recipientName, address, link }) => {
  const [view, setView] = useState<'address' | 'stores'>('address');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setView('address'), 0);
    }
  }, [isOpen]);
  
  const handleCopy = useCallback(() => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2500);
  }, [address]);

  const handleConfirmClick = async () => {
    await onConfirm();
    setView('stores');
  };

  const hasAddress = address && address.trim() !== '';
  const hasLink = link && link.trim() !== '';

  const getStoreUrl = (email: string) => {
      if (email.includes('digikala')) return 'https://www.digikala.com';
      if (email.includes('technolife')) return 'https://www.technolife.ir';
      if (email.includes('banimode')) return 'https://www.banimode.com';
      if (email.includes('mootanroo')) return 'https://www.mootanroo.com';
      if (email.includes('khanoumi')) return 'https://www.khanoumi.com';
      if (email.includes('timcheh')) return 'https://www.timcheh.com';
      if (email.includes('torob')) return 'https://torob.com';
      if (email.includes('basalam')) return 'https://basalam.com';
      if (email.includes('okala')) return 'https://okala.com';
      if (email.includes('abzarreza')) return 'https://abzarreza.com';
      return '#';
  };

  if (!isOpen) return null;

  const getButtonContent = () => {
    if (hasLink) {
        return <><ExternalLinkIcon /> رزرو و مشاهده لینک محصول</>;
    }
    return <><ReserveIcon /> تایید و رزرو (مشاهده فروشگاه‌ها)</>;
  };

  const renderAddressView = () => (
    <>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">آدرس ارسال برای {recipientName}</h2>
        
        {hasAddress ? (
            <>
                <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">
                    {hasLink
                        ? 'لطفاً آدرس زیر را کپی کنید تا در سایت فروشنده (پس از رزرو) استفاده نمایید.'
                        : 'برای ارسال هدیه، می‌توانید از آدرس زیر استفاده کنید. در مرحله بعد فروشگاه‌های پیشنهادی نمایش داده می‌شوند.'
                    }
                </p>
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl mb-6 relative border border-slate-200 dark:border-slate-600">
                    <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-medium">{address}</p>
                    <button onClick={handleCopy} className={`absolute top-3 left-3 flex-shrink-0 flex items-center justify-center px-3 py-1.5 rounded-lg font-bold text-white text-xs transition-colors shadow-sm ${isCopied ? 'bg-teal-500' : 'bg-slate-500 hover:bg-slate-600'}`}>
                        {isCopied ? <CheckIcon /> : <CopyIcon />}<span className="mr-1.5">{isCopied ? 'کپی شد' : 'کپی'}</span>
                    </button>
                </div>
            </>
        ) : (
             <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl mb-6 border border-amber-200 dark:border-amber-500/20">
                <p className="text-amber-800 dark:text-amber-200 font-bold text-sm mb-1">
                    آدرس ثبت نشده است
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                    صاحب لیست آدرسی ثبت نکرده است. می‌توانید هدیه را رزرو کرده و برای هماهنگی ارسال با او تماس بگیرید.
                </p>
            </div>
        )}
        
        <div className="flex justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleConfirmClick}
            className="flex-1 px-5 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20 flex items-center justify-center"
          >
            {getButtonContent()}
          </button>
        </div>
    </>
  );

  const renderStoresView = () => (
    <>
        <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckIcon />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">آیتم با موفقیت رزرو شد!</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                اکنون می‌توانید خرید خود را انجام دهید.
            </p>
        </div>

        {hasLink && (
            <div className="mb-6">
                <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700/50 rounded-xl text-violet-700 dark:text-violet-300 font-bold hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                >
                    <ExternalLinkIcon /> مشاهده لینک اصلی محصول
                </a>
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
                    <div className="relative flex justify-center"><span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400">یا خرید از همکاران ما</span></div>
                </div>
            </div>
        )}

        <div className="flex-1 overflow-y-auto -mx-2 px-2">
            {!hasLink && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 font-medium">
                    برای تهیه این هدیه، می‌توانید از فروشگاه‌های معتبر زیر استفاده کنید:
                </p>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_MERCHANTS.map((merchant) => (
                    <a 
                        key={merchant.id}
                        href={getStoreUrl(merchant.email)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-md transition-all group"
                    >
                        {/* Circular Logo */}
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 flex items-center justify-center">
                            {merchant.avatar ? (
                                <img src={merchant.avatar} alt={merchant.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-lg font-bold text-slate-500">{merchant.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{merchant.name}</h4>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">ورود به فروشگاه &larr;</span>
                        </div>
                    </a>
                ))}
            </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
                متوجه شدم، بستن
            </button>
        </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md m-4 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {view === 'address' ? renderAddressView() : renderStoresView()}
      </div>
    </div>
  );
};

export default ShippingAddressModal;
