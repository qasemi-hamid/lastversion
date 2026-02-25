
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface ProfileShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

// Icons
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413c-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.956-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.447-4.435-9.884-9.888-9.884-5.448 0-9.886 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>;
const TelegramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0C5.356 0 0 5.356 0 11.944s5.356 11.944 11.944 11.944 11.944-5.356 11.944-11.944S18.532 0 11.944 0zM17.38 8.187l-2.033 9.537c-.21.986-1.23-1.23-1.95.783l-3.033-2.23-1.46 1.404c-.16.16-.36.32-.6.32l.22-3.09 5.56-5.025c.24-.21-.06-.33-.39-.12l-6.85 4.31-2.96-.92c-.99-.31-.99-1.52.18-2.24L16.03 6.45c.81-.31 1.59.21 1.35 1.737z" /></svg>;
const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>;

const ProfileShareModal: React.FC<ProfileShareModalProps> = ({ isOpen, onClose, user }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isCodeCopied, setIsCodeCopied] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
        const url = `${window.location.origin}/?user=${user.id}`;
        setTimeout(() => setShareUrl(url), 0);
    }
  }, [isOpen, user]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyCode = () => {
      if (user.referralCode) {
          navigator.clipboard.writeText(user.referralCode);
          setIsCodeCopied(true);
          setTimeout(() => setIsCodeCopied(false), 2000);
      }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `پروفایل ${user.name} در گیفتی‌نو`,
          text: `لیست آرزوهای ${user.name} را در گیفتی‌نو ببینید! کد معرف: ${user.referralCode}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  if (!isOpen) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&color=4c1d95`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">اشتراک‌گذاری پروفایل</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                <CloseIcon />
            </button>
        </div>

        {/* Card Content */}
        <div className="p-6 flex flex-col items-center">
            {/* ID Card Visual */}
            <div className="w-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 rounded-2xl p-1 shadow-lg mb-6 relative">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 flex flex-col items-center relative overflow-hidden">
                    {/* Decorative Background Circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-100 dark:bg-violet-900/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-100 dark:bg-rose-900/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-violet-500 to-fuchsia-500 mb-3 z-10">
                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 p-0.5 overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-2xl">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white z-10">{user.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 z-10">@GiftinoApp</p>

                    {/* QR Code */}
                    <div className="bg-white p-2 rounded-xl shadow-inner border border-slate-100 z-10">
                        <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 object-contain rounded-lg" />
                    </div>
                    
                    <p className="text-[10px] text-slate-400 mt-3 font-medium tracking-wide z-10">اسکن کنید تا پروفایل من را ببینید</p>
                </div>
            </div>

            {/* Actions */}
            <div className="w-full space-y-3">
                {/* Referral Code Box */}
                {user.referralCode && (
                    <div className="bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800 p-3 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-xs text-violet-700 dark:text-violet-300 font-bold mb-0.5">کد دعوت اختصاصی شما</p>
                            <p className="text-[10px] text-violet-600 dark:text-violet-400">با دعوت هر دوست، ۵۰۰۰ تومان هدیه بگیرید</p>
                        </div>
                        <button 
                            onClick={handleCopyCode} 
                            className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-violet-200 dark:border-violet-700 text-sm font-mono font-bold text-slate-700 dark:text-slate-200 shadow-sm active:scale-95 transition-transform min-w-[80px]"
                        >
                            {isCodeCopied ? 'کپی شد!' : user.referralCode}
                        </button>
                    </div>
                )}

                <div className="flex gap-2">
                    <div className="flex-grow relative">
                        <input 
                            type="text" 
                            readOnly 
                            value={shareUrl} 
                            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs py-3 pl-3 pr-10 rounded-xl focus:outline-none"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <ShareIcon />
                        </div>
                    </div>
                    <button 
                        onClick={handleCopy} 
                        className={`px-4 rounded-xl flex items-center justify-center transition-all ${isCopied ? 'bg-green-500 text-white' : 'bg-slate-800 dark:bg-slate-700 text-white'}`}
                    >
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button 
                        onClick={handleNativeShare}
                        className="col-span-2 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-violet-500/20"
                    >
                        ارسال دعوت‌نامه برای دوستان
                    </button>
                    <a 
                        href={`https://wa.me/?text=${encodeURIComponent(`سلام! من لیست آرزوهام رو در گیفتی‌نو ساختم. با کد دعوت ${user.referralCode} ثبت‌نام کن و ۵۰۰۰ تومن هدیه بگیر:\n${shareUrl}`)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="py-2.5 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                    >
                        <WhatsAppIcon /> واتس‌اپ
                    </a>
                    <a 
                        href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`دعوت به گیفتی‌نو! کد معرف: ${user.referralCode}`)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="py-2.5 bg-sky-50 dark:bg-sky-900/10 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold hover:bg-sky-100 dark:hover:bg-sky-900/20 transition-colors"
                    >
                        <TelegramIcon /> تلگرام
                    </a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileShareModal;
