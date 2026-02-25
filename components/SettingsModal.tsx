
import React, { useState, useEffect, useRef } from 'react';
import { User, ImportantDate, DateType } from '../types';
import { processFileForUpload } from '../services/imageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUpdateUserProfile: (updatedProfile: Partial<User>) => Promise<void>;
  initialTab?: 'profile' | 'security' | 'dates'; 
  onLogout: () => void;
}

// --- Icons ---
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>);
const ShieldCheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>);
const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);
const CameraIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const HomeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>);
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

// Specific Event Icons
const CakeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.48 3.5 3.5 0 011.791 2.606 3.7 3.7 0 011.299-.658 3.5 3.5 0 013.583.443A3.7 3.7 0 0113.5 15.317V19a2 2 0 104 0v-3.683a3.7 3.7 0 011.055.48 3.5 3.5 0 011.791 2.606 3.7 3.7 0 011.299-.658 3.5 3.5 0 013.583.443 3.7 3.7 0 01.358-1.536V12a2 2 0 00-2-2V9a2 2 0 00-2-2v1a2 2 0 00-2 2V6a2 2 0 00-2-2V3a1 1 0 00-2 0v3zM6 13.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" /></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;

const LoadingSpinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, 
    onClose, 
    currentUser, 
    onUpdateUserProfile, 
    initialTab = 'profile',
    onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'dates'>(initialTab);
  
  // Profile State
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [address, setAddress] = useState(''); 
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  
  // Dates Management
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [newDateType, setNewDateType] = useState<DateType>('birthday');
  const [newDateValue, setNewDateValue] = useState('');
  const [newDateLabel, setNewDateLabel] = useState('');
  const [isAddingDate, setIsAddingDate] = useState(false);

  // Security State
  const [mobile, setMobile] = useState('');
  const [nationalCode, setNationalCode] = useState('');
  const [shaba, setShaba] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  
  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        setActiveTab(initialTab); 
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (isOpen && currentUser) {
        setName(currentUser.name || '');
        setBio(currentUser.bio || '');
        setAvatar(currentUser.avatar || '');
        setAddress(currentUser.address || ''); 
        
        let dates = [...(currentUser.importantDates || [])];
        if (currentUser.birthday && !dates.some(d => d.type === 'birthday')) {
            dates.unshift({ id: 'main-bday', type: 'birthday', date: currentUser.birthday, label: 'تولد خودم' });
        }
        setImportantDates(dates);
        
        setMobile(currentUser.mobile || '');
        setNationalCode(currentUser.nationalCode || '');
        setShaba(currentUser.shaba || '');
        setAccountHolderName(currentUser.accountHolderName || '');
        
        setError(null);
    }
  }, [isOpen, currentUser]);

  const handleAddDate = () => {
      if (!newDateValue) return;
      const newDateObj: ImportantDate = {
          id: `date-${Date.now()}`,
          type: newDateType,
          date: newDateValue,
          label: newDateLabel.trim() || undefined
      };
      setImportantDates([...importantDates, newDateObj]);
      setNewDateValue('');
      setNewDateLabel('');
      setIsAddingDate(false);
  };

  const handleRemoveDate = (id: string) => {
      setImportantDates(importantDates.filter(d => d.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      setError(null);
      
      const cleanShaba = shaba.replace(/\s/g, '').toUpperCase();
      const mainBday = importantDates.find(d => d.type === 'birthday')?.date;

      try {
          await onUpdateUserProfile({
              name,
              bio,
              avatar,
              birthday: mainBday,
              importantDates,
              address, 
              mobile,
              nationalCode,
              shaba: cleanShaba,
              accountHolderName
          });
          onClose();
      } catch (err: any) {
          console.error("Profile Save Error:", err);
          const msg = typeof err === 'string' ? err : (err.message || 'خطای ناشناخته');
          setError(`خطا در ذخیره اطلاعات: ${msg}`);
      } finally {
          setIsSaving(false);
      }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setIsProcessingImage(true);
          try {
              const compressed = await processFileForUpload(e.target.files[0]);
              setAvatar(compressed);
          } catch (err) {
              console.error("Profile image processing failed:", err);
          } finally {
              setIsProcessingImage(false);
          }
      }
  };

  const handleShabaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      if (!val.startsWith('IR') && val.length > 0) {
          if (/[0-9]/.test(val[0])) {
              val = 'IR' + val;
          }
      }
      if (val.length > 26) val = val.slice(0, 26);
      const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      setShaba(formatted);
  };

  // --- Helper Functions for Date Display ---
  const dateTypeLabels: Record<DateType, string> = {
      'birthday': 'تولد خودم',
      'spouse_birthday': 'تولد همسر',
      'child_birthday': 'تولد فرزند',
      'father_birthday': 'تولد پدر',
      'mother_birthday': 'تولد مادر',
      'anniversary': 'سالگرد ازدواج',
      'friend_birthday': 'تولد دوست',
      'other': 'سایر'
  };

  const getEventIcon = (type: DateType) => {
      switch(type) {
          case 'birthday': case 'friend_birthday': case 'child_birthday': case 'father_birthday': case 'mother_birthday': return <CakeIcon />;
          case 'spouse_birthday': case 'anniversary': return <HeartIcon />;
          default: return <StarIcon />;
      }
  };

  const getEventColor = (type: DateType) => {
      switch(type) {
          case 'birthday': return 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/20 dark:text-fuchsia-300';
          case 'spouse_birthday': case 'anniversary': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-300';
          case 'child_birthday': return 'bg-sky-100 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300';
          case 'father_birthday': case 'mother_birthday': return 'bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300';
          default: return 'bg-violet-100 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300';
      }
  };

  const getDaysLeft = (dateString: string) => {
      if(!dateString) return null;
      const today = new Date();
      const target = new Date(dateString);
      const currentYearTarget = new Date(today.getFullYear(), target.getMonth(), target.getDate());
      
      if (currentYearTarget.getTime() === today.setHours(0,0,0,0)) return 0;
      if (currentYearTarget < today) currentYearTarget.setFullYear(today.getFullYear() + 1);
      
      const diff = Math.ceil((currentYearTarget.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                {activeTab === 'profile' ? <><UserIcon /> ویرایش پروفایل</> : 
                 activeTab === 'dates' ? <><CalendarIcon /> تاریخ‌های مهم</> :
                 <><ShieldCheckIcon /> تنظیمات امنیت و مالی</>}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                <CloseIcon />
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 scroll-smooth">
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800">
                    <p>{error}</p>
                </div>
            )}
            
            <form onSubmit={handleSave} className="space-y-6">
                
                {activeTab === 'profile' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            <div className="relative group cursor-pointer" onClick={() => !isProcessingImage && fileInputRef.current?.click()}>
                                <div className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                    {isProcessingImage ? (
                                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (avatar && avatar !== '') ? (
                                        <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400">
                                            {name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                {!isProcessingImage && (
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <CameraIcon />
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                            <p className="text-xs text-slate-400 mt-2">تصویر پروفایل بهینه می‌شود.</p>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نام نمایشی</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none text-slate-800 dark:text-white"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="نام شما"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">بیوگرافی کوتاه</label>
                            <textarea 
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none text-slate-800 dark:text-white resize-none"
                                rows={3}
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                placeholder="درباره خودتان بنویسید..."
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                <HomeIcon /> آدرس پستی
                            </label>
                            <textarea 
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none text-slate-800 dark:text-white resize-none"
                                rows={2}
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="استان، شهر، خیابان..."
                            />
                        </div>
                    </div>
                )}

                {/* --- NEW: DATES TAB --- */}
                {activeTab === 'dates' && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    لیست مناسبت‌های من
                                </label>
                                {!isAddingDate && (
                                    <button 
                                        type="button" 
                                        onClick={() => setIsAddingDate(true)}
                                        className="text-xs bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 hover:bg-violet-200"
                                    >
                                        <PlusIcon /> افزودن مناسبت
                                    </button>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3 mb-4">
                                {importantDates.length > 0 ? importantDates.map((d) => {
                                    const daysLeft = getDaysLeft(d.date);
                                    return (
                                        <div key={d.id} className="relative group overflow-hidden bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3 hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getEventColor(d.type)}`}>
                                                {getEventIcon(d.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-slate-800 dark:text-white truncate">
                                                        {d.label || dateTypeLabels[d.type]}
                                                    </span>
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${daysLeft === 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                                        {daysLeft === 0 ? 'امروز!' : `${daysLeft} روز تا فرارسیدن`}
                                                    </span>
                                                </div>
                                                <div className="mt-1">
                                                    <span className="text-[10px] text-slate-400 font-mono tracking-wider">{d.date}</span>
                                                </div>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveDate(d.id)}
                                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                title="حذف"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    );
                                }) : (
                                    <div className="text-center py-8 text-slate-400 text-xs">هنوز تاریخی ثبت نشده است.</div>
                                )}
                            </div>

                            {isAddingDate && (
                                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border-2 border-violet-100 dark:border-violet-900/50 animate-fade-in-up shadow-lg">
                                    <h4 className="text-xs font-bold text-violet-600 mb-3">ثبت تاریخ جدید</h4>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <select 
                                                value={newDateType} 
                                                onChange={e => setNewDateType(e.target.value as DateType)}
                                                className="bg-slate-50 dark:bg-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-200"
                                            >
                                                {Object.entries(dateTypeLabels).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </select>
                                            <input 
                                                type="date" 
                                                value={newDateValue}
                                                onChange={e => setNewDateValue(e.target.value)}
                                                className="bg-slate-50 dark:bg-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-200 text-center font-mono"
                                            />
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="نام دلخواه (اختیاری، مثلا: تولد علی)"
                                            value={newDateLabel}
                                            onChange={e => setNewDateLabel(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-200"
                                        />
                                        <div className="flex gap-2 pt-1">
                                            <button type="button" onClick={() => setIsAddingDate(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs py-2.5 rounded-lg font-bold transition-colors">لغو</button>
                                            <button type="button" onClick={handleAddDate} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xs py-2.5 rounded-lg font-bold transition-colors shadow-md">ذخیره</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 text-sm text-amber-800 dark:text-amber-200">
                            <p className="font-bold mb-1">اطلاعات هویتی و بانکی</p>
                            <p>این اطلاعات برای واریز هدایای نقدی استفاده می‌شود. نام صاحب حساب باید با کد ملی مطابقت داشته باشد.</p>
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">شماره موبایل</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed dir-ltr"
                                    value={mobile}
                                    readOnly
                                />
                                {currentUser?.isMobileVerified ? (
                                    <span className="px-3 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl text-xs font-bold flex items-center">تایید شده</span>
                                ) : (
                                    <button type="button" className="px-3 py-2 bg-amber-100 text-amber-700 rounded-xl text-xs font-bold">تایید نشده</button>
                                )}
                            </div>
                        </div>

                        {/* National Code */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">کد ملی</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 outline-none text-slate-800 dark:text-white dir-ltr font-mono tracking-widest"
                                value={nationalCode}
                                onChange={e => setNationalCode(e.target.value)}
                                maxLength={10}
                                placeholder="0123456789"
                            />
                        </div>

                        {/* Shaba Input */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">شماره شبا (IBAN)</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    className={`w-full pl-4 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border focus:ring-2 focus:ring-teal-500 outline-none text-slate-800 dark:text-white dir-ltr font-mono tracking-wider ${shaba.replace(/\s/g, '').length === 26 ? 'border-green-500' : 'border-slate-200 dark:border-slate-700'}`}
                                    value={shaba}
                                    onChange={handleShabaChange}
                                    maxLength={32}
                                    placeholder="IR00 0000 0000 0000 0000 0000 00"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        {/* Account Holder Name */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نام صاحب حساب</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 outline-none text-slate-800 dark:text-white"
                                value={accountHolderName}
                                onChange={e => setAccountHolderName(e.target.value)}
                                placeholder="نام و نام خانوادگی مطابق کارت بانکی"
                            />
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
                    <button 
                        type="button" 
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        انصراف
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSaving || isProcessingImage}
                        className="px-8 py-3 rounded-xl font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {(isSaving || isProcessingImage) && <LoadingSpinner />}
                        {(isSaving || isProcessingImage) ? 'در حال پردازش...' : 'ذخیره تغییرات'}
                    </button>
                </div>
            </form>
            
            {activeTab === 'security' && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-500 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 font-bold text-sm transition-colors">
                        <LogoutIcon /> خروج از حساب کاربری
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
