
import React, { useState, useMemo, useEffect } from 'react';
import { User, SystemLog, GatewaySettings, Transaction, Wallet, Wishlist } from '../types';
import { checkConnection } from '../services/supabaseClient';
import { getDatabaseSnapshot, restoreDatabase, getGatewaySettings, updateGatewaySettings, createCharityUser } from '../services/api';
import AdminCharityModal from './AdminCharityModal';

interface AdminDashboardProps {
  users: User[];
  systemLogs: SystemLog[];
  transactions: Transaction[];
  wallets: Wallet[];
  wishlists: Wishlist[];
  onReturnToApp: () => void;
  onToggleBan: (userId: string) => void;
}

const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const SearchIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 text-slate-400"} viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const UserRemoveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" /></svg>;
const LockClosedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H3a2 2 0 01-2-2v-5a2 2 0 012-2h2zm4-2a3 3 0 00-3 3v2h6V9a3 3 0 00-3-3z" clipRule="evenodd" /></svg>;
const LockOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 116 0v2h2V7a5 5 0 00-5-5z" /></svg>;
const ServerStackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm0 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V9zm0 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z" /></svg>;
const DatabaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8-4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>;
const CloudDownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>;
const CloudUploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>;
const CreditCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const TrendingUpIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const VerifiedBadge = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  users, 
  systemLogs, 
  transactions, 
  wallets, 
  wishlists, 
  onReturnToApp, 
  onToggleBan 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs' | 'settings'>('overview');
  const [isCharityModalOpen, setCharityModalOpen] = useState(false);
  const [gatewaySettings, setGatewaySettings] = useState<GatewaySettings | null>(null);
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Supabase state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
      getGatewaySettings().then(setGatewaySettings);
      // Load Supabase config from localStorage
      const savedConfig = localStorage.getItem('GIFTINO_SUPABASE_CONFIG');
      if (savedConfig) {
          try {
              const { url, key } = JSON.parse(savedConfig);
              setSupabaseUrl(url || '');
              setSupabaseKey(key || '');
          } catch(e) {
              console.error("Failed to parse Supabase config from localStorage", e);
          }
      }
  }, []);
  
  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    setConnectionError(null);
    try {
        const result = await checkConnection(supabaseUrl, supabaseKey);
        if (result.success) {
            setConnectionStatus('success');
        } else {
            setConnectionStatus('error');
            setConnectionError(result.message || 'خطای نامشخص در اتصال.');
        }
    } catch(e: any) {
        setConnectionStatus('error');
        setConnectionError(e.message || 'خطای بحرانی در زمان تست اتصال.');
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const config = { url: supabaseUrl, key: supabaseKey };
    localStorage.setItem('GIFTINO_SUPABASE_CONFIG', JSON.stringify(config));
    alert('تنظیمات Supabase با موفقیت ذخیره شد.');
    setConnectionStatus('idle'); // Reset status after saving
  };


  const handleBackup = async () => {
      try {
        const data = await getDatabaseSnapshot();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `giftino-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
      } catch (error) {
        alert(error instanceof Error ? error.message : "خطا در تهیه نسخه پشتیبان");
      }
  };

  const handleRestore = async () => {
      if (!backupFile) return;
      if (!window.confirm('آیا مطمئن هستید؟ این عمل داده‌های فعلی را بازنویسی می‌کند.')) return;
      
      const reader = new FileReader();
      reader.onload = async (e) => {
          try {
              const json = JSON.parse(e.target?.result as string);
              const success = await restoreDatabase(json);
              if(success) {
                  alert('بازگردانی با موفقیت انجام شد. صفحه رفرش می‌شود.');
                  window.location.reload();
              } else {
                  throw new Error("Invalid backup file structure.");
              }
          } catch (err) {
              alert('خطا در بازگردانی فایل پشتیبان.');
          }
      };
      reader.readAsText(backupFile);
  };

  const handleSaveGateway = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if(gatewaySettings) {
            await updateGatewaySettings(gatewaySettings);
            alert('تنظیمات درگاه ذخیره شد.');
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : "خطا در ذخیره تنظیمات درگاه");
      }
  };

  const totalUsers = users.length;
  const totalTransactions = transactions.length;
  const totalVolume = transactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);

  return (
    <div className="fixed inset-0 z-40 bg-slate-900 text-slate-100 font-sans flex flex-col">
        <header className="bg-slate-800 border-b border-slate-700 shadow-md px-6 py-4 sticky top-0 z-20">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white"><ShieldCheckIcon /></div>
                    <h1 className="text-xl font-bold">پنل مدیریت سیستم</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={onReturnToApp} className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors text-sm">
                        <BackIcon /> بازگشت به برنامه
                    </button>
                </div>
            </div>
        </header>

        <div className="container mx-auto px-6 py-8 flex-grow overflow-y-auto">
            <div className="flex gap-4 mb-8 border-b border-slate-700 pb-1 overflow-x-auto">
                <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>نمای کلی</button>
                <button onClick={() => setActiveTab('users')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'users' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>کاربران</button>
                <button onClick={() => setActiveTab('logs')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'logs' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>لاگ‌های سیستم</button>
                <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>تنظیمات و نگهداری</button>
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <h3 className="text-slate-400 text-sm font-bold mb-2">کل کاربران</h3>
                        <p className="text-3xl font-bold text-white">{totalUsers}</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <h3 className="text-slate-400 text-sm font-bold mb-2">تعداد تراکنش‌ها</h3>
                        <p className="text-3xl font-bold text-white">{totalTransactions}</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <h3 className="text-slate-400 text-sm font-bold mb-2">حجم کل تراکنش‌ها</h3>
                        <p className="text-3xl font-bold text-emerald-400">{totalVolume.toLocaleString('fa-IR')} <span className="text-sm text-slate-500">تومان</span></p>
                    </div>
                    
                    <div className="md:col-span-3 mt-8">
                        <button onClick={() => setCharityModalOpen(true)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg transition-colors flex items-center gap-2">
                            <PlusIcon /> ایجاد حساب موسسه خیریه
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="p-4 bg-slate-700/50 border-b border-slate-700">
                        <div className="relative max-w-md">
                            <SearchIcon className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="جستجوی کاربر..." 
                                className="w-full pr-10 pl-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-sm text-slate-300">
                            <thead className="bg-slate-700 text-slate-200 font-bold">
                                <tr>
                                    <th className="p-4">نام</th>
                                    <th className="p-4">ایمیل</th>
                                    <th className="p-4">نقش</th>
                                    <th className="p-4">وضعیت</th>
                                    <th className="p-4 text-center">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {users.filter(u => (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                                    <tr key={user.id} className="hover:bg-slate-700/30">
                                        <td className="p-4">{user.name} {user.role === 'charity' && <VerifiedBadge />}</td>
                                        <td className="p-4 font-mono text-slate-400">{user.email}</td>
                                        <td className="p-4"><span className="bg-slate-700 px-2 py-1 rounded text-xs">{user.role}</span></td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${user.status === 'banned' ? 'bg-red-900/50 text-red-400' : 'bg-emerald-900/50 text-emerald-400'}`}>
                                                {user.status === 'banned' ? 'مسدود' : 'فعال'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {user.role !== 'admin' && (
                                                <button onClick={() => onToggleBan(user.id)} className="text-slate-400 hover:text-white transition-colors" title={user.status === 'banned' ? 'رفع مسدودی' : 'مسدود کردن'}>
                                                    {user.status === 'banned' ? <LockOpenIcon /> : <LockClosedIcon />}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto max-h-[600px]">
                        <table className="w-full text-right text-sm text-slate-300">
                            <thead className="bg-slate-700 text-slate-200 font-bold sticky top-0">
                                <tr>
                                    <th className="p-4">زمان</th>
                                    <th className="p-4">نوع</th>
                                    <th className="p-4">کاربر</th>
                                    <th className="p-4">جزئیات</th>
                                    <th className="p-4">IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {systemLogs.slice(0, 100).map(log => (
                                    <tr key={log.id} className="hover:bg-slate-700/30">
                                        <td className="p-4 font-mono text-xs text-slate-500">{new Date(log.createdAt).toLocaleString('fa-IR')}</td>
                                        <td className="p-4"><span className="bg-slate-700 px-2 py-1 rounded text-xs">{log.type}</span></td>
                                        <td className="p-4 font-mono text-xs">{log.userId || '-'}</td>
                                        <td className="p-4">{log.details}</td>
                                        <td className="p-4 font-mono text-xs">{log.userIp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><DatabaseIcon /> مدیریت پایگاه داده</h3>
                        <div className="space-y-6">
                            {/* Supabase Connection */}
                            <div>
                                <h4 className="font-semibold text-slate-300 mb-2">اتصال به پایگاه داده Supabase</h4>
                                <form onSubmit={handleSaveSupabaseConfig} className="space-y-4 bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Supabase URL</label>
                                        <input type="url" value={supabaseUrl} onChange={e => setSupabaseUrl(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white font-mono text-sm" placeholder="https://xyz.supabase.co" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Supabase Anon Key</label>
                                        <input type="password" value={supabaseKey} onChange={e => setSupabaseKey(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white font-mono text-sm" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button type="button" onClick={handleTestConnection} disabled={connectionStatus === 'testing'} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50">
                                            {connectionStatus === 'testing' ? 'در حال تست...' : 'تست اتصال'}
                                        </button>
                                        <button type="submit" className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors">ذخیره تنظیمات</button>
                                    </div>
                                    {connectionStatus === 'success' && <p className="text-sm text-emerald-400 text-center">اتصال با موفقیت برقرار شد.</p>}
                                    {connectionStatus === 'error' && <p className="text-sm text-red-400 text-center break-all">{connectionError}</p>}
                                </form>
                            </div>
                            
                            <div className="border-t border-slate-700 pt-6 space-y-4">
                                <h4 className="font-semibold text-slate-300 mb-2">پشتیبان‌گیری و بازگردانی</h4>
                                <button onClick={handleBackup} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                                    <CloudDownloadIcon /> دانلود نسخه پشتیبان (Backup)
                                </button>
                                <div className="border-t border-slate-700 pt-4">
                                    <label className="block text-sm text-slate-400 mb-2">بازگردانی نسخه پشتیبان</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="file" 
                                            accept=".json"
                                            onChange={(e) => setBackupFile(e.target.files ? e.target.files[0] : null)}
                                            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600"
                                        />
                                        <button onClick={handleRestore} disabled={!backupFile} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                            <CloudUploadIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><CreditCardIcon /> تنظیمات درگاه پرداخت</h3>
                        {gatewaySettings && (
                            <form onSubmit={handleSaveGateway} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">درگاه فعال</label>
                                    <select 
                                        value={gatewaySettings.provider}
                                        onChange={e => setGatewaySettings({...gatewaySettings, provider: e.target.value as any})}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white"
                                    >
                                        <option value="zarinpal">زرین‌پال</option>
                                        <option value="nextpay">نکست‌پی</option>
                                        <option value="saman">بانک سامان</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">کد پذیرنده (Merchant ID)</label>
                                    <input 
                                        type="text" 
                                        value={gatewaySettings.merchantId}
                                        onChange={e => setGatewaySettings({...gatewaySettings, merchantId: e.target.value})}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white font-mono text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        id="sandbox"
                                        checked={gatewaySettings.isSandbox}
                                        onChange={e => setGatewaySettings({...gatewaySettings, isSandbox: e.target.checked})}
                                        className="rounded bg-slate-900 border-slate-600 text-indigo-600"
                                    />
                                    <label htmlFor="sandbox" className="text-sm text-slate-300">حالت آزمایشی (Sandbox)</label>
                                </div>
                                <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors">
                                    ذخیره تنظیمات
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>

        <AdminCharityModal 
            isOpen={isCharityModalOpen} 
            onClose={() => setCharityModalOpen(false)} 
            onCreateCharity={createCharityUser} 
        />
    </div>
  );
};

export default AdminDashboard;
