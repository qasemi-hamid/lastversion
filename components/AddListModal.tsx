
import React, { useState, useEffect, useRef } from 'react';
import { ProfileType, WishlistPrivacy, Template, User } from '../types';
import { processFileForUpload } from '../services/imageService';
import { listTemplates } from '../data/templates';

interface AddListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddList: (details: {
    name: string;
    privacy: WishlistPrivacy;
    coverImage?: string;
    items?: any[];
    beneficiary?: { name: string; shaba?: string; address?: string; isThirdParty: boolean; giftType: 'cash' | 'physical' };
  }, type?: ProfileType) => void | Promise<void>;
  profileType: ProfileType;
  currentUser?: User | null;
  onNavigateTab?: (tab: any) => void;
  onSearchUsers?: (query: string) => Promise<User[]>;
}

// Added React.FC to allow React built-in props like 'key' when using in maps
const TemplateCard: React.FC<{ template: Template; onClick: () => void }> = ({ template, onClick }) => (
    <button 
        onClick={onClick}
        className="group relative h-44 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800"
    >
        <img src={template.coverImage} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 p-5 flex flex-col justify-end text-right">
            <span className="text-2xl mb-1">{template.icon}</span>
            <h4 className="text-white font-black text-sm">{template.title}</h4>
            <p className="text-[9px] text-white/70 font-bold line-clamp-2 mt-1">{template.description}</p>
        </div>
    </button>
);

// Added React.FC to allow React built-in props like 'key' when using in maps
const SelectorCard: React.FC<{ title: string; icon: string; color: string; onClick: () => void }> = ({ title, icon, color, onClick }) => (
    <button 
        onClick={onClick}
        className="group flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-transparent hover:border-indigo-500 hover:bg-white transition-all text-right w-full"
    >
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <div className="flex-1">
            <h3 className="font-black text-slate-800 dark:text-white text-sm">{title}</h3>
            <span className="text-[10px] text-slate-500 font-bold">انتخاب و شروع &larr;</span>
        </div>
    </button>
);

const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

const AddListModal: React.FC<AddListModalProps> = ({ isOpen, onClose, onAddList, profileType, onNavigateTab, currentUser }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 'templates'>(1);
  const [activeType, setActiveType] = useState<ProfileType>(profileType);
  const [name, setName] = useState('');
  const [privacy, setPrivacy] = useState<WishlistPrivacy>(profileType === 'charity' ? 'public' : 'private');
  const [coverImage, setCoverImage] = useState<string>('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      if (isOpen) {
          setStep(1);
          setActiveType(profileType);
          setCoverImage('');
          setName('');
          setPrivacy(profileType === 'charity' ? 'public' : 'private');
      }
  }, [isOpen, profileType]);

  const handleTemplateSelect = (template: Template) => {
      onAddList({
          name: template.title,
          privacy: activeType === 'charity' ? 'public' : template.privacy,
          coverImage: template.coverImage,
          items: template.items
      }, activeType);
      onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddList({ name: name.trim(), privacy: activeType === 'charity' ? 'public' : privacy, coverImage }, activeType);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden transform transition-all flex flex-col relative animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
      >
        {step === 1 && (
            <div className="p-8 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar text-center">
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">ایجاد پویش جدید</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Create New Campaign</p>
                </div>
                
                <div className="space-y-3">
                    {profileType === 'charity' && (
                        <SelectorCard title="انتخاب از پویش‌های آماده" icon="✨" color="bg-indigo-600 text-white" onClick={() => setStep('templates')} />
                    )}
                    <SelectorCard title="طراحی پویش جدید (دستی)" icon="✏️" color="bg-rose-100 text-rose-600" onClick={() => setStep(3)} />
                </div>
                
                <button onClick={onClose} className="w-full py-3 mt-4 text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">بستن</button>
            </div>
        )}

        {step === 'templates' && (
            <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black">کمپین‌های کارشناسی شده</h2>
                    <button onClick={() => setStep(1)} className="text-xs font-black text-indigo-600">برگشت</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {listTemplates.charity.map((t, idx) => (
                        <TemplateCard key={idx} template={t} onClick={() => handleTemplateSelect(t)} />
                    ))}
                </div>
            </div>
        )}

        {step === 3 && (
            <div className="animate-fade-in max-h-[85vh] overflow-y-auto custom-scrollbar">
                <div 
                    className="relative h-40 bg-slate-900 flex items-center justify-center overflow-hidden cursor-pointer group"
                    onClick={() => !isProcessingImage && fileInputRef.current?.click()}
                >
                    {isProcessingImage ? (
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-20">
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="text-[10px] text-white font-black">در حال بهینه‌سازی...</span>
                        </div>
                    ) : (coverImage && coverImage !== '') ? (
                        <img src={coverImage} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-rose-600 to-amber-500 opacity-60"></div>
                    )}
                    <div className="relative z-10 flex flex-col items-center text-white drop-shadow-lg">
                        <PhotoIcon />
                        <span className="text-xs font-black mt-2">{coverImage ? 'تغییر عکس' : 'انتخاب عکس کاور'}</span>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={async (e) => {
                        if (e.target.files?.[0]) {
                            setIsProcessingImage(true);
                            try {
                                const res = await processFileForUpload(e.target.files[0]);
                                setCoverImage(res);
                            } finally { setIsProcessingImage(false); }
                        }
                    }} />
                </div>
                
                <form onSubmit={handleManualSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase mr-1">نام یا عنوان پویش</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 rounded-2xl outline-none text-slate-900 dark:text-white font-bold text-sm focus:border-indigo-500 transition-all" placeholder="مثلاً: کمک به کودکان کار" required autoFocus />
                    </div>
                    
                    {activeType !== 'charity' && (
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase mr-1">دسترسی</label>
                            <select 
                                value={privacy} 
                                onChange={e => setPrivacy(e.target.value as WishlistPrivacy)}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 rounded-2xl outline-none text-slate-900 dark:text-white font-bold text-sm"
                            >
                                <option value="private">خصوصی</option>
                                <option value="friends">دوستان</option>
                                <option value="public">عمومی (نمایش در پویش‌ها)</option>
                            </select>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs">بازگشت</button>
                        <button type="submit" disabled={!name.trim()} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-lg disabled:opacity-50">ایجاد و انتشار</button>
                    </div>
                </form>
            </div>
        )}
      </div>
    </div>
  );
};

export default AddListModal;
