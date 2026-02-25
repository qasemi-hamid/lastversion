
import React, { useState, useMemo, useEffect } from 'react';
import { User, Transaction, Wishlist, Wallet, Partner, SystemLog, GatewaySettings, Order, SystemExpense, ExpenseCategory, SmsSettings, TrafficSettings, CloudStorageSettings, AiSettings } from '../types';
import { getPartners, addPartner, deletePartner, getExpenses, addExpense, deleteExpense, getGatewaySettings, updateGatewaySettings, getDatabaseSnapshot, restoreDatabase, createCharityUser, getStoreClickStats, getSmsSettings, updateSmsSettings, getTrafficSettings, updateTrafficSettings, getCloudSettings, updateCloudSettings, getAiSettings, updateAiSettings, getAllSystemOrders, toggleUserKyc } from '../services/api';
import { checkConnection } from '../services/supabaseClient';
import AdminCharityModal from './AdminCharityModal';

interface UnifiedAdminDashboardProps {
  currentUser: User;
  users: User[];
  transactions: Transaction[];
  wishlists: Wishlist[];
  wallets: Wallet[];
  systemLogs: SystemLog[];
  onLogout: () => void;
  onToggleBan: (userId: string) => void;
  onReturnToApp?: () => void;
  onRefreshData?: () => Promise<void>;
}

// --- Helper Functions ---
const formatMoney = (amount: number | string | undefined) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount || 0);
  return Math.round(num).toLocaleString('fa-IR');
};

// --- Icons ---
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const SearchIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 text-slate-400"} viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const DatabaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8-4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CloudIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
const CpuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const LockClosedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H3a2 2 0 01-2-2v-5a2 2 0 012-2h2zm4-2a3 3 0 00-3 3v2h6V9a3 3 0 00-3-3z" clipRule="evenodd" /></svg>;
const LockOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 116 0v2h2V7a5 5 0 00-5-5z" /></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>;

const VerifiedBadge = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 inline-block mr-1" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
    </svg>
);

const UnifiedAdminDashboard: React.FC<UnifiedAdminDashboardProps> = ({ 
  currentUser, users, systemLogs, transactions, wallets, wishlists, onLogout, onReturnToApp, onToggleBan, onRefreshData 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'kyc' | 'orders' | 'financials' | 'users' | 'system'>('overview');
  const [isCharityModalOpen, setCharityModalOpen] = useState(false);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // System State
  const [gwSettings, setGwSettings] = useState<GatewaySettings | null>(null);
  const [smsSettings, setSmsSettings] = useState<SmsSettings | null>(null);
  const [trafficSettings, setTrafficSettings] = useState<TrafficSettings | null>(null);
  const [cloudSettings, setCloudSettings] = useState<CloudStorageSettings | null>(null);
  const [aiSettings, setAiSettings] = useState<AiSettings | null>(null);
  const [backupFile, setBackupFile] = useState<File | null>(null);

  useEffect(() => {
      Promise.all([ 
          getGatewaySettings(), 
          getAllSystemOrders(),
          getSmsSettings(),
          getTrafficSettings(),
          getCloudSettings(),
          getAiSettings()
      ]).then(([gw, orders, sms, traffic, cloud, ai]) => {
          if (gw) setGwSettings(gw);
          if (orders) setAllOrders(orders);
          if (sms) setSmsSettings(sms);
          if (traffic) setTrafficSettings(traffic);
          if (cloud) setCloudSettings(cloud);
          if (ai) setAiSettings(ai);
      });
  }, []);

  const grossRevenue = useMemo(() => {
        return transactions.filter(t => t.type === 'contribution').reduce((s, t) => {
            const r = users.find(u => u.id === t.userId);
            return r?.role !== 'charity' ? s + (t.amount * 0.025) : s;
        }, 0);
  }, [transactions, users]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return (users || []).filter(u => 
        (u.name || '').toLowerCase().includes(term) || 
        (u.email || '').toLowerCase().includes(term) ||
        (u.shopName || '').toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const handleCharityCreated = async (data: any) => {
      const result = await createCharityUser(data);
      if (result.success) {
          setCharityModalOpen(false);
          alert('موسسه خیریه با موفقیت ایجاد شد.');
          if (onRefreshData) await onRefreshData();
      } else {
          // Fixed: Accessing optional message property or providing fallback to resolve property 'message' does not exist error on line 103
          alert('خطا در ایجاد خیریه: ' + (result.message || 'خطای ناشناخته'));
      }
      return result;
  };

  const handleBackup = async () => {
    const data = await getDatabaseSnapshot();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `giftino-db-snapshot-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  /**
   * Restores the database from a selected JSON backup file.
   */
  const handleRestore = async () => {
    if (!backupFile) return;
    if (!window.confirm('آیا مطمئن هستید؟ این عمل داده‌های فعلی را بازنویسی می‌کند.')) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const json = JSON.parse(e.target?.result as string);
            const success = await restoreDatabase(json);
            if (success) {
                alert('بازگردانی با موفقیت انجام شد. صفحه رفرش می‌شود.');
                window.location.reload();
            }
        } catch (err) {
            alert('خطا در بازگردانی فایل پشتیبان.');
        }
    };
    reader.readAsText(backupFile);
  };

  const handleSaveSystem = async (type: string, data: any) => {
      try {
          if (type === 'gw') await updateGatewaySettings(data);
          if (type === 'sms') await updateSmsSettings(data);
          if (type === 'traffic') await updateTrafficSettings(data);
          if (type === 'cloud') await updateCloudSettings(data);
          if (type === 'ai') await updateAiSettings(data);
          alert('تنظیمات با موفقیت ذخیره شد.');
      } catch (e) {
          alert('خطا در ذخیره تنظیمات.');
      }
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-900 text-slate-100 font-sans flex flex-col overflow-hidden">
        <header className="bg-slate-800 border-b border-slate-700 shadow-md px-6 py-4 sticky top-0 z-20 flex-shrink-0">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg"><ShieldCheckIcon /></div>
                    <div>
                        <h1 className="text-xl font-black text-white">پنل مدیریت فنی و بیزینس</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin Control Center</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {onReturnToApp && <button onClick={onReturnToApp} className="flex items-center gap-2 text-sky-400 hover:text-sky-300 font-black text-sm transition-colors"><BackIcon /> بازگشت</button>}
                    <button onClick={onLogout} className="text-red-400 hover:text-red-300 text-sm font-black transition-colors">خروج</button>
                </div>
            </div>
        </header>

        <div className="container mx-auto px-6 py-8 flex-grow overflow-y-auto">
            <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {[
                        {id: 'overview', label: 'داشبورد'},
                        {id: 'kyc', label: 'احراز هویت'},
                        {id: 'orders', label: 'سفارشات'},
                        {id: 'financials', label: 'تراکنش‌ها'},
                        {id: 'users', label: 'کاربران'},
                        {id: 'system', label: 'فنی و زیرساخت'}
                    ].map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`px-4 py-2 text-xs font-black border-b-2 transition-all whitespace-nowrap uppercase tracking-tighter ${activeTab === t.id ? 'border-indigo-50 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>
                
                <button onClick={() => setCharityModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95">
                   <PlusIcon /> ایجاد خیریه
                </button>
            </div>

            {activeTab === 'system' && (
                <div className="space-y-8 animate-fade-in pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Database Console */}
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                            <h3 className="text-sm font-black text-indigo-400 mb-6 flex items-center gap-2"><DatabaseIcon /> مدیریت دیتابیس (Supabase)</h3>
                            <div className="space-y-4">
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                    <p className="text-xs text-slate-400 mb-4">تهیه اسنپ‌شات کامل از تمام جداول سیستم (JSON)</p>
                                    <div className="flex gap-3">
                                        <button onClick={handleBackup} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-black transition-colors">دانلود نسخه پشتیبان</button>
                                        <label className="flex-1">
                                            <input type="file" className="hidden" accept=".json" onChange={e => setBackupFile(e.target.files?.[0] || null)} />
                                            <div className="w-full py-2.5 bg-indigo-900/30 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-black text-center cursor-pointer">انتخاب فایل بازگردانی</div>
                                        </label>
                                    </div>
                                    {/* Updated: Call handleRestore instead of restoreDatabase directly with backupFile object */}
                                    {backupFile && <button onClick={handleRestore} className="w-full mt-3 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-black transition-colors">بازگردانی "{backupFile.name}"</button>}
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Database Health</span>
                                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-black">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        Online
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Gateway Settings */}
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                            <h3 className="text-sm font-black text-amber-400 mb-6 flex items-center gap-2"><CogIcon /> تنظیمات درگاه پرداخت</h3>
                            {gwSettings && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1">ارائه‌دهنده فعال</label>
                                            <select value={gwSettings.provider} onChange={e => setGwSettings({...gwSettings, provider: e.target.value as any})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-black outline-none focus:border-amber-500">
                                                <option value="zarinpal">زرین‌پال</option>
                                                <option value="nextpay">نکست‌پی</option>
                                                <option value="saman">بانک سامان</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1">کد پذیرنده (MerchantID)</label>
                                            <input type="text" value={gwSettings.merchantId} onChange={e => setGwSettings({...gwSettings, merchantId: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono outline-none focus:border-amber-500" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg">
                                        <input type="checkbox" checked={gwSettings.isSandbox} onChange={e => setGwSettings({...gwSettings, isSandbox: e.target.checked})} className="rounded bg-slate-800 border-slate-700 text-amber-500" />
                                        <label className="text-[10px] font-bold text-slate-400">حالت آزمایشی (Sandbox Mode)</label>
                                    </div>
                                    <button onClick={() => handleSaveSystem('gw', gwSettings)} className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 rounded-lg text-xs font-black transition-colors">ذخیره تنظیمات درگاه</button>
                                </div>
                            )}
                        </div>

                        {/* SMS Panel Settings */}
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                            <h3 className="text-sm font-black text-sky-400 mb-6 flex items-center gap-2">💬 کنسول پیامک و OTP</h3>
                            {smsSettings && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1">پنل پیامک</label>
                                            <select value={smsSettings.provider} onChange={e => setSmsSettings({...smsSettings, provider: e.target.value as any})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-black">
                                                <option value="kavehnegar">کاوه نگار</option>
                                                <option value="ghasedak">قاصدک</option>
                                                <option value="magfa">مگفا</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1">API Key</label>
                                            <input type="password" value={smsSettings.apiKey} onChange={e => setSmsSettings({...smsSettings, apiKey: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono" />
                                        </div>
                                    </div>
                                    <button onClick={() => handleSaveSystem('sms', smsSettings)} className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 rounded-lg text-xs font-black transition-colors">بروزرسانی پنل پیامک</button>
                                </div>
                            )}
                        </div>

                        {/* Cloud Storage / CDN */}
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                            <h3 className="text-sm font-black text-rose-400 mb-6 flex items-center gap-2"><CloudIcon /> ذخیره‌سازی ابری (CDN)</h3>
                            {cloudSettings && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">ارائه‌دهنده ابر</label>
                                        <select value={cloudSettings.provider} onChange={e => setCloudSettings({...cloudSettings, provider: e.target.value as any})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-black">
                                            <option value="arvan">ابر آروان</option>
                                            <option value="liara">لیارا</option>
                                            <option value="minio">Self-Hosted Minio</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="Bucket Name" value={cloudSettings.bucketName} onChange={e => setCloudSettings({...cloudSettings, bucketName: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono" />
                                        <input type="text" placeholder="Endpoint URL" value={cloudSettings.endpoint} onChange={e => setCloudSettings({...cloudSettings, endpoint: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono" dir="ltr" />
                                    </div>
                                    <button onClick={() => handleSaveSystem('cloud', cloudSettings)} className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 rounded-lg text-xs font-black transition-colors">ذخیره کانفیگ آبجکت استوریج</button>
                                </div>
                            )}
                        </div>

                        {/* Traffic & SEO Technical */}
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                            <h3 className="text-sm font-black text-emerald-400 mb-6 flex items-center gap-2">🚀 ترافیک و هدایت هوشمند</h3>
                            {trafficSettings && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1">CPC پیش‌فرض (تومان)</label>
                                            <input type="number" value={trafficSettings.defaultCpc} onChange={e => setTrafficSettings({...trafficSettings, defaultCpc: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-black" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1">تاخیر ریدایرکت (ثانیه)</label>
                                            <input type="number" value={trafficSettings.redirectDelay} onChange={e => setTrafficSettings({...trafficSettings, redirectDelay: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-black" />
                                        </div>
                                    </div>
                                    <button onClick={() => handleSaveSystem('traffic', trafficSettings)} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-black transition-colors">ذخیره تنظیمات هدایت</button>
                                </div>
                            )}
                        </div>

                        {/* AI Engine Config */}
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                            <h3 className="text-sm font-black text-violet-400 mb-6 flex items-center gap-2"><CpuIcon /> تنظیمات موتور هوش مصنوعی</h3>
                            {aiSettings && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">مدل فعال (Gemini/OpenAI)</label>
                                        <input type="text" value={aiSettings.modelName} onChange={e => setAiSettings({...aiSettings, modelName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono" />
                                    </div>
                                    <button onClick={() => handleSaveSystem('ai', aiSettings)} className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 rounded-lg text-xs font-black transition-colors">ذخیره تنظیمات AI</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* System Logs Terminal */}
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
                        <div className="p-4 bg-slate-700/50 flex justify-between items-center">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">System Logs Terminal</h3>
                            <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded font-mono text-slate-500">Last 50 events</span>
                        </div>
                        <div className="p-4 bg-slate-950 font-mono text-[10px] leading-relaxed h-64 overflow-y-auto custom-scrollbar">
                            {systemLogs.length > 0 ? systemLogs.map(log => (
                                <div key={log.id} className="mb-1 border-b border-white/5 pb-1">
                                    <span className="text-slate-600">[{new Date(log.createdAt).toLocaleTimeString()}]</span>{' '}
                                    <span className={log.status === 'failure' ? 'text-red-400' : 'text-emerald-400'}>{log.type.toUpperCase()}</span>:{' '}
                                    <span className="text-slate-300">{log.details}</span>{' '}
                                    <span className="text-slate-600">IP: {log.userIp}</span>
                                </div>
                            )) : (
                                <div className="text-slate-700 italic">No logs detected in the current buffer...</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                        <p className="text-[10px] text-slate-400 font-black uppercase mb-1">کل کاربران</p>
                        <p className="text-3xl font-black">{(users || []).length}</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                        <p className="text-[10px] text-slate-400 font-black uppercase mb-1">فروش تایید شده</p>
                        <p className="text-3xl font-black text-emerald-500">{formatMoney(grossRevenue)}</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                        <p className="text-[10px] text-slate-400 font-black uppercase mb-1">سفرها و دنگ‌ها</p>
                        <p className="text-3xl font-black text-sky-500">{wishlists.filter(w => w.type !== 'personal').length}</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                        <p className="text-[10px] text-slate-400 font-black uppercase mb-1">موسسات خیریه</p>
                        <p className="text-3xl font-black text-rose-500">{(users || []).filter(u => u.role === 'charity').length}</p>
                    </div>
                </div>
            )}

            {activeTab === 'kyc' && (
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
                    <table className="w-full text-right text-sm">
                        <thead className="bg-slate-700/50 text-slate-400 font-black uppercase">
                            <tr><th className="p-4">نام کاربر/فروشگاه</th><th className="p-4">کد ملی / شبا</th><th className="p-4">نقش</th><th className="p-4 text-center">وضعیت</th><th className="p-4 text-center">عملیات</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {(users || []).filter(u => u.role !== 'admin').map(user => (
                                <tr key={user.id} className="hover:bg-slate-700/30">
                                    <td className="p-4 font-bold">{user.shopName || user.name}</td>
                                    <td className="p-4 font-mono text-xs">{user.nationalCode || '---'} / {user.shaba ? 'ثبت شده' : '---'}</td>
                                    <td className="p-4"><span className="bg-slate-900 px-2 py-0.5 rounded text-[10px]">{user.role}</span></td>
                                    <td className="p-4 text-center">
                                        {user.kycVerified ? 
                                            <span className="bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded-lg text-[10px] font-black">تایید شده</span> : 
                                            <span className="bg-amber-900/50 text-amber-400 px-2 py-1 rounded-lg text-[10px] font-black">در انتظار تایید</span>}
                                    </td>
                                    <td className="p-4 text-center">
                                        {/* Updated: Enabled KYC toggle button */}
                                        <button 
                                            onClick={async () => {
                                                try {
                                                    await toggleUserKyc(user.id);
                                                    if(onRefreshData) await onRefreshData();
                                                } catch(e) {
                                                    alert('خطا در تغییر وضعیت احراز هویت');
                                                }
                                            }}
                                            className="px-3 py-1.5 rounded-lg text-[10px] font-black bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                                        >
                                            {user.kycVerified ? 'لغو تایید' : 'تایید هویت'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
                    <div className="p-4 bg-slate-700/50 border-b border-slate-700">
                        <div className="relative max-w-md">
                            <SearchIcon className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="جستجوی کاربر (نام، ایمیل، خیریه)..." 
                                className="w-full pr-10 pl-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <table className="w-full text-right text-sm">
                        <thead className="bg-slate-700/50 text-slate-400 font-black uppercase">
                            <tr><th className="p-4">نام</th><th className="p-4">ایمیل/کاربری</th><th className="p-4">نقش</th><th className="p-4 text-center">وضعیت</th><th className="p-4 text-center">عملیات</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-700/30">
                                    <td className="p-4 font-bold">{user.shopName || user.name}</td>
                                    <td className="p-4 font-mono text-xs text-slate-400">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black ${user.role === 'charity' ? 'bg-rose-900/30 text-rose-400' : 'bg-slate-900 text-slate-400'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black ${user.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {user.status === 'active' ? 'فعال' : 'مسدود'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {user.role !== 'admin' && (
                                            <button onClick={() => onToggleBan(user.id)} className="text-slate-500 hover:text-rose-500 transition-colors">
                                                {user.status === 'active' ? <LockClosedIcon /> : <LockOpenIcon />}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        <AdminCharityModal isOpen={isCharityModalOpen} onClose={() => setCharityModalOpen(false)} onCreateCharity={handleCharityCreated} />
    </div>
  );
};

export default UnifiedAdminDashboard;
