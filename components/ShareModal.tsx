
import React, { useState, useEffect, useCallback } from 'react';
import { Wishlist, ProfileType, User } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Wishlist | null;
  profileType: ProfileType;
  currentUser?: User | null;
}

const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, wishlist, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'normal' | 'direct' | 'referral'>('normal');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen || !wishlist) return null;

  const normalUrl = `${window.location.origin}/?list=${wishlist.id}`;
  const directUrl = `${window.location.origin}/?participate=${wishlist.items[0]?.id || wishlist.id}`;
  const refUrl = `${window.location.origin}/?ref=${currentUser?.id || 'join'}`;

  const copyToClipboard = (text: string, id: string) => {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
  };

  const tabs = [
      { id: 'normal', label: 'لینک لیست آرزو', desc: 'مشاهده کامل لیست توسط دیگران' },
      { id: 'direct', label: 'مشارکت مستقیم (بدون ثبت‌نام)', desc: 'لینک سریع واریز به شبا' },
      { id: 'referral', label: 'لینک عضویت (دعوت)', desc: 'کسب امتیاز با دعوت دوستان' }
  ];

  const currentUrl = activeTab === 'normal' ? normalUrl : activeTab === 'direct' ? directUrl : refUrl;

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">اشتراک‌گذاری</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><CloseIcon /></button>
        </div>

        <div className="p-2 flex bg-slate-50 dark:bg-slate-800/50">
            {tabs.map(t => (
                <button 
                    key={t.id} 
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${activeTab === t.id ? 'bg-white dark:bg-slate-700 shadow text-indigo-600' : 'text-slate-400'}`}
                >
                    {t.label}
                </button>
            ))}
        </div>

        <div className="p-8 space-y-6">
            <div className="text-center">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                    {tabs.find(t => t.id === activeTab)?.desc}
                </p>
            </div>

            <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"><LinkIcon /></div>
                <input 
                    type="text" 
                    readOnly 
                    value={currentUrl} 
                    className="w-full pr-12 pl-14 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-mono text-[10px] text-slate-500 dir-ltr outline-none"
                />
                <button 
                    onClick={() => copyToClipboard(currentUrl, activeTab)}
                    className={`absolute left-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl font-black text-[10px] transition-all flex items-center gap-2 ${copiedId === activeTab ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}
                >
                    {copiedId === activeTab ? <CheckIcon /> : <CopyIcon />}
                    {copiedId === activeTab ? 'کپی شد' : 'کپی لینک'}
                </button>
            </div>

            {activeTab === 'direct' && (
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/50">
                    <p className="text-[10px] text-amber-700 dark:text-amber-300 font-bold leading-relaxed text-center">
                        این لینک به کاربر اجازه می‌دهد مستقیماً مبلغ مشارکت را انتخاب کرده و به درگاه بانکی متصل شود. کاربر هیچ نیازی به ثبت‌نام یا ورود نخواهد داشت.
                    </p>
                </div>
            )}

            <button onClick={onClose} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all">بستن</button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
