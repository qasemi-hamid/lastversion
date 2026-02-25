
import React, { useState, useMemo, useEffect } from 'react';
import { User, Transaction, Wishlist, Wallet, Partner } from '../types';
import { getPartners, addPartner, deletePartner, getStoreClickStats } from '../services/api';

interface ManagerDashboardProps {
  users: User[];
  transactions: Transaction[];
  wishlists: Wishlist[];
  wallets: Wallet[];
  onLogout: () => void;
}

// Icons (Keep existing icons, add new ones if needed)
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const CashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ScaleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>;
const ExclamationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ServerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const RadarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;

// Helper to extract domain from URL
const getDomain = (url: string) => {
    try {
        if (!url) return 'نامشخص';
        // Handle URLs without protocol
        const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
        const hostname = new URL(urlWithProtocol).hostname;
        return hostname.replace(/^www\./, '');
    } catch {
        return 'نامشخص';
    }
};

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ users, transactions, wishlists, wallets, onLogout }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'bi' | 'partners'>('overview');
    const [partners, setPartners] = useState<Partner[]>([]);
    const [clickStats, setClickStats] = useState<{name: string, domain: string, count: number}[]>([]);

    // Partner Form State
    const [newPartnerDomain, setNewPartnerDomain] = useState('');
    const [newPartnerName, setNewPartnerName] = useState('');
    const [newPartnerParam, setNewPartnerParam] = useState('');
    const [newPartnerValue, setNewPartnerValue] = useState('');
    const [newPartnerRate, setNewPartnerRate] = useState('');

    useEffect(() => {
        getPartners().then(setPartners).catch(err => console.error("Error loading partners", err));
        
        // Load Click Stats for BI
        const loadStats = async () => {
            const stats = await getStoreClickStats();
            setClickStats(stats);
        };
        loadStats();
        // Refresh every 30s
        const interval = setInterval(loadStats, 30000);
        return () => clearInterval(interval);
    }, []);
    
    const handleAddPartner = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if(newPartnerDomain && newPartnerParam && newPartnerValue) {
                const newPartner: Partner = {
                    id: `p-${Date.now()}`,
                    name: newPartnerName || newPartnerDomain,
                    domain: newPartnerDomain,
                    affiliateParam: newPartnerParam,
                    affiliateValue: newPartnerValue,
                    commissionRate: Number(newPartnerRate) || 0,
                    isActive: true
                };
                const updated = await addPartner(newPartner);
                setPartners(updated);
                setNewPartnerDomain('');
                setNewPartnerName('');
                setNewPartnerParam('');
                setNewPartnerValue('');
                setNewPartnerRate('');
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : "خطا در افزودن شریک");
        }
    };
    
    const handleDeletePartner = async (id: string) => {
        try {
            const updated = await deletePartner(id);
            setPartners(updated);
        } catch (error) {
            alert(error instanceof Error ? error.message : "خطا در حذف شریک");
        }
    };

    // --- KPI Calculations ---
    const totalUsers = users.length;
    const activeUsers = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const transactingUsers = new Set(transactions.filter(t => new Date(t.date) > thirtyDaysAgo).map(t => t.userId));
        return users.filter(u => transactingUsers.has(u.id)).length;
    }, [users, transactions]);

    const { totalDeposited, totalWithdrawn, totalProfit, dailyProfit, revenueData } = useMemo(() => {
        let deposited = 0;
        let withdrawn = 0;
        let profit = 0;
        let daily = 0;
        const today = new Date().toDateString();
        
        const chartDays = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return { date: d.toLocaleDateString('fa-IR', { weekday: 'short' }), key: d.toDateString(), in: 0, out: 0 };
        });

        transactions.forEach(t => {
            const tDate = new Date(t.date).toDateString();
            const chartDay = chartDays.find(d => d.key === tDate);

            if (t.type === 'contribution') {
                deposited += t.amount;
                if (chartDay) chartDay.in += t.amount;
                
                const recipient = users.find(u => u.id === t.userId);
                const isCharity = recipient?.role === 'charity';

                if (!isCharity) {
                    const fee = t.amount * 0.025;
                    profit += fee;
                    if (tDate === today) {
                        daily += fee;
                    }
                }
            } else if (t.type === 'withdrawal' || t.type === 'payout') {
                const amount = Math.abs(t.amount);
                withdrawn += amount;
                if (chartDay) chartDay.out += amount;
            }
        });

        const maxVal = Math.max(...chartDays.map(d => Math.max(d.in, d.out)), 1);
        const normalizedChart = chartDays.map(d => ({
            ...d,
            inHeight: (d.in / maxVal) * 100,
            outHeight: (d.out / maxVal) * 100,
            inLabel: d.in,
            outLabel: d.out
        }));

        return { 
            totalDeposited: deposited, 
            totalWithdrawn: withdrawn, 
            totalProfit: profit,
            dailyProfit: daily,
            revenueData: normalizedChart
        };
    }, [transactions, users]);

    const totalFloat = useMemo(() => {
        return wallets.reduce((sum, w) => sum + w.balance, 0);
    }, [wallets]);
    
    const pendingWithdrawals = useMemo(() => {
        return transactions
            .filter(t => t.type === 'withdrawal' && Math.abs(t.amount) > 10000000)
            .slice(0, 3);
    }, [transactions]);

    const topActiveUsers = useMemo(() => {
        const userActivity = new Map<string, number>();
        transactions.forEach(t => {
            if(t.userId) {
                userActivity.set(t.userId, (userActivity.get(t.userId) || 0) + 1);
            }
        });
        
        return Array.from(userActivity.entries())
            .map(([id, count]) => ({ user: users.find(u => u.id === id), count }))
            .filter(item => item.user)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }, [transactions, users]);

    const topRichUsers = useMemo(() => {
        return wallets
            .map(w => ({ user: users.find(u => u.id === w.userId), balance: w.balance }))
            .filter(item => item.user && item.user.role !== 'charity' && item.user.role !== 'manager' && item.user.role !== 'admin')
            .sort((a, b) => b.balance - a.balance)
            .slice(0, 10);
    }, [wallets, users]);

    const { topPartners, topStores } = useMemo(() => {
        const storeSales = new Map<string, number>();
        wishlists.forEach(list => {
            list.items.forEach(item => {
                if ((item.status === 'funded' || item.status === 'settled') && item.link && item.price) {
                    const domain = getDomain(item.link);
                    if (domain !== 'نامشخص') {
                        storeSales.set(domain, (storeSales.get(domain) || 0) + item.price);
                    }
                }
            });
        });

        const allStores = Array.from(storeSales.entries())
            .map(([domain, sales]) => ({ domain, sales }))
            .sort((a, b) => b.sales - a.sales);

        const activePartnerDomains = partners.map(p => p.domain);

        const partnersList = allStores
            .filter(s => activePartnerDomains.some(pd => s.domain.includes(pd)))
            .map(s => {
                const partner = partners.find(p => s.domain.includes(p.domain));
                const rate = partner ? partner.commissionRate : 2.5;
                return { ...s, profit: s.sales * (rate / 100) };
            })
            .slice(0, 10);
            
        const topSelling = allStores.slice(0, 10);

        return { 
            topPartners: partnersList, 
            topStores: topSelling,
        };
    }, [wishlists, partners]);


    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
            <header className="bg-slate-800 border-b border-slate-700 shadow-md sticky top-0 z-20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-wide">داشبورد مدیریت کسب‌وکار</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-700 rounded-lg p-1 overflow-x-auto">
                            <button onClick={() => setActiveTab('overview')} className={`px-3 py-1.5 text-sm rounded-md transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-600'}`}>نمای کلی</button>
                            <button onClick={() => setActiveTab('bi')} className={`px-3 py-1.5 text-sm rounded-md transition-all whitespace-nowrap ${activeTab === 'bi' ? 'bg-amber-600 text-white shadow' : 'text-slate-300 hover:bg-slate-600'}`}>هوش تجاری</button>
                            <button onClick={() => setActiveTab('partners')} className={`px-3 py-1.5 text-sm rounded-md transition-all whitespace-nowrap ${activeTab === 'partners' ? 'bg-violet-600 text-white shadow' : 'text-slate-300 hover:bg-slate-600'}`}>شرکا</button>
                        </div>
                         <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium">
                            <LogoutIcon /> خروج
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8 space-y-8">
                
                {activeTab === 'overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex items-start justify-between hover:border-blue-500/50 transition-colors">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">کاربران کل / فعال</p>
                                    <h3 className="text-3xl font-bold text-white">{totalUsers} <span className="text-lg text-slate-500 font-normal">/ {activeUsers}</span></h3>
                                    <p className="text-xs text-green-400 mt-2">+۱۲٪ رشد ماهانه</p>
                                </div>
                                <div className="p-3 bg-slate-700 rounded-lg text-blue-400"><UsersIcon /></div>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex items-start justify-between hover:border-green-500/50 transition-colors">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">گردش مالی (واریزی)</p>
                                    <h3 className="text-3xl font-bold text-white">{totalDeposited.toLocaleString('fa-IR')} <span className="text-sm">تومان</span></h3>
                                    <p className="text-xs text-slate-500 mt-2">خروجی: {totalWithdrawn.toLocaleString('fa-IR')}</p>
                                </div>
                                <div className="p-3 bg-slate-700 rounded-lg text-green-400"><MoneyIcon /></div>
                            </div>
                             <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex items-start justify-between hover:border-cyan-500/50 transition-colors">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">نقدینگی سیستم (Float)</p>
                                    <h3 className="text-3xl font-bold text-cyan-400">{totalFloat.toLocaleString('fa-IR')} <span className="text-sm text-white">تومان</span></h3>
                                    <p className="text-xs text-cyan-300 mt-2">تعهدات به کاربران</p>
                                </div>
                                <div className="p-3 bg-slate-700 rounded-lg text-cyan-400"><ScaleIcon /></div>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex items-start justify-between hover:border-emerald-500/50 transition-colors">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">سود خالص (از غیرخیریه)</p>
                                    <h3 className="text-3xl font-bold text-emerald-400">{totalProfit.toLocaleString('fa-IR')} <span className="text-sm text-white">تومان</span></h3>
                                    <p className="text-xs text-emerald-300 mt-2">سود امروز: {dailyProfit.toLocaleString('fa-IR')}</p>
                                </div>
                                <div className="p-3 bg-slate-700 rounded-lg text-emerald-400"><TrendingUpIcon /></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><ChartIcon /> روند مالی (۷ روز گذشته)</h3>
                                    <div className="flex gap-3 text-xs">
                                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> ورودی</div>
                                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> خروجی</div>
                                    </div>
                                </div>
                                <div className="h-64 flex items-end justify-between gap-2 px-2">
                                    {revenueData.map((day, idx) => (
                                        <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end">
                                            <div className="w-full flex gap-1 items-end justify-center h-full max-w-[40px]">
                                                <div className="w-1/2 bg-emerald-500 hover:bg-emerald-400 transition-all rounded-t-sm relative" style={{ height: `${Math.max(day.inHeight, 2)}%` }} title={`ورودی: ${day.inLabel.toLocaleString('fa-IR')}`}></div>
                                                <div className="w-1/2 bg-red-500 hover:bg-red-400 transition-all rounded-t-sm relative" style={{ height: `${Math.max(day.outHeight, 2)}%` }} title={`خروجی: ${day.outLabel.toLocaleString('fa-IR')}`}></div>
                                            </div>
                                            <span className="text-xs text-slate-400 mt-2">{day.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><ClockIcon /> کارتابل (نیاز به اقدام)</h3>
                                    <div className="space-y-3">
                                        {pendingWithdrawals.length > 0 ? pendingWithdrawals.map(tx => (
                                            <div key={tx.id} className="bg-slate-700/50 p-3 rounded-lg border border-slate-600 flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-slate-400">درخواست برداشت وجه</p>
                                                    <p className="text-sm font-bold text-white">{Math.abs(tx.amount).toLocaleString('fa-IR')} <span className="text-[10px]">تومان</span></p>
                                                </div>
                                                <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-500">بررسی</button>
                                            </div>
                                        )) : (
                                            <p className="text-sm text-slate-500 text-center py-4">موردی برای بررسی وجود ندارد.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><ServerIcon /> وضعیت سلامت سیستم</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-300">سرور اصلی (API)</span>
                                            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> فعال (99.9%)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'bi' && (
                    <div className="space-y-8 animate-fade-in">
                         {/* Opportunity Radar (New Section) */}
                         <div className="bg-gradient-to-r from-violet-900/40 to-slate-800 p-6 rounded-xl border border-violet-600/50 shadow-lg">
                             <div className="flex items-center justify-between mb-6">
                                 <div>
                                    <h3 className="text-xl font-bold text-violet-300 mb-2 flex items-center gap-2"><RadarIcon /> رادار فرصت‌ها (پربازدیدترین فروشگاه‌های غیرهمکار)</h3>
                                    <p className="text-slate-300 text-sm max-w-2xl">این جدول نشان می‌دهد کاربران شما بیشتر روی کدام فروشگاه‌ها کلیک می‌کنند. با این فروشگاه‌ها تماس بگیرید و لینک همکاری (Affiliate) بسازید.</p>
                                 </div>
                             </div>
                             
                             <div className="overflow-x-auto rounded-lg border border-slate-600">
                                 <table className="w-full text-right text-sm">
                                     <thead className="bg-slate-700 text-slate-300">
                                         <tr>
                                             <th className="p-3">رتبه</th>
                                             <th className="p-3">نام فروشگاه</th>
                                             <th className="p-3">آدرس دامنه</th>
                                             <th className="p-3 text-center">تعداد کلیک (هدایت)</th>
                                             <th className="p-3 text-center">وضعیت</th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-slate-700 bg-slate-800">
                                         {clickStats.map((stat, idx) => {
                                             // Check if already a partner
                                             const isPartner = partners.some(p => p.domain.includes(stat.domain) || stat.domain.includes(p.domain));
                                             return (
                                                 <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                                                     <td className="p-3 text-slate-500 font-mono">{idx + 1}</td>
                                                     <td className="p-3 text-white font-bold">{stat.name}</td>
                                                     <td className="p-3 text-slate-400 font-mono" dir="ltr">{stat.domain}</td>
                                                     <td className="p-3 text-center font-mono text-emerald-400 font-bold text-lg">{stat.count}</td>
                                                     <td className="p-3 text-center">
                                                         {isPartner ? (
                                                             <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded text-xs">همکار فعلی</span>
                                                         ) : (
                                                             <span className="bg-amber-900/50 text-amber-400 px-2 py-1 rounded text-xs animate-pulse">فرصت همکاری</span>
                                                         )}
                                                     </td>
                                                 </tr>
                                             );
                                         })}
                                         {clickStats.length === 0 && (
                                             <tr>
                                                 <td colSpan={5} className="p-8 text-center text-slate-500">هنوز داده‌ای ثبت نشده است.</td>
                                             </tr>
                                         )}
                                     </tbody>
                                 </table>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><UsersIcon /> ۱۰ مشتری پر کار</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-right text-sm">
                                        <thead className="text-slate-400 border-b border-slate-700"><tr><th className="pb-2">#</th><th className="pb-2">نام کاربر</th><th className="pb-2 text-center">تعداد تراکنش</th></tr></thead>
                                        <tbody className="text-slate-300">
                                            {topActiveUsers.map((item, idx) => (
                                                <tr key={item.user?.id} className="border-b border-slate-700/50 hover:bg-slate-700/30"><td className="py-3 text-slate-500">{idx + 1}</td><td className="py-3 font-medium text-white">{item.user?.name}</td><td className="py-3 text-center font-mono bg-slate-700/30 rounded">{item.count}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><CashIcon /> ۱۰ پروفایل پر پول</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-right text-sm">
                                        <thead className="text-slate-400 border-b border-slate-700"><tr><th className="pb-2">#</th><th className="pb-2">نام کاربر</th><th className="pb-2 text-left">موجودی (تومان)</th></tr></thead>
                                        <tbody className="text-slate-300">
                                            {topRichUsers.map((item, idx) => (
                                                <tr key={item.user?.id} className="border-b border-slate-700/50 hover:bg-slate-700/30"><td className="py-3 text-slate-500">{idx + 1}</td><td className="py-3 font-medium text-white">{item.user?.name}</td><td className="py-3 text-left font-mono text-emerald-400 font-bold">{item.balance.toLocaleString('fa-IR')}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                             <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BriefcaseIcon /> شرکای پر سود</h3>
                                <div className="space-y-3">
                                    {topPartners.map((store, idx) => (<div key={idx} className="flex justify-between items-center p-3 bg-emerald-900/10 border border-emerald-900/30 rounded-lg"><span className="text-sm font-medium text-emerald-200">{idx + 1}. {store.domain}</span><span className="text-xs font-bold text-emerald-400">+{Math.round(store.profit).toLocaleString('fa-IR')} <span className="font-light">سود</span></span></div>))}
                                </div>
                            </div>
                            <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><GlobeIcon /> پرفروش‌ترین فروشگاه‌ها (داخلی)</h3>
                                <div className="space-y-3">
                                    {topStores.map((store, idx) => (<div key={idx} className="flex justify-between items-center p-2 border-b border-slate-700/50 last:border-0"><span className="text-sm text-slate-300">{store.domain}</span><span className="text-xs font-mono text-slate-400">{store.sales.toLocaleString('fa-IR')}</span></div>))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'partners' && (
                    <div className="max-w-5xl mx-auto space-y-8">
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><BriefcaseIcon /> مدیریت شرکای تجاری (Affiliate)</h3>
                             <form onSubmit={handleAddPartner} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 items-end bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                                <div className="md:col-span-1"><label className="block text-xs text-slate-400 mb-1">نام فروشگاه</label><input type="text" className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-200 text-sm" value={newPartnerName} onChange={e => setNewPartnerName(e.target.value)} required /></div>
                                <div className="md:col-span-1"><label className="block text-xs text-slate-400 mb-1">دامنه (بدون www)</label><input type="text" className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-200 text-sm font-mono" value={newPartnerDomain} onChange={e => setNewPartnerDomain(e.target.value)} required dir="ltr" /></div>
                                <div className="md:col-span-1"><label className="block text-xs text-slate-400 mb-1">پارامتر</label><input type="text" className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-200 text-sm font-mono" value={newPartnerParam} onChange={e => setNewPartnerParam(e.target.value)} required dir="ltr" /></div>
                                <div className="md:col-span-1"><label className="block text-xs text-slate-400 mb-1">مقدار</label><input type="text" className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-200 text-sm font-mono" value={newPartnerValue} onChange={e => setNewPartnerValue(e.target.value)} required dir="ltr" /></div>
                                <div className="md:col-span-1 flex gap-2"><div className="flex-1"><label className="block text-xs text-slate-400 mb-1">کمیسیون (%)</label><input type="number" className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-200 text-sm" value={newPartnerRate} onChange={e => setNewPartnerRate(e.target.value)} required /></div><button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors h-[38px] mt-auto"><PlusIcon /></button></div>
                             </form>
                             <div className="overflow-x-auto rounded-lg border border-slate-600">
                                 <table className="w-full text-right text-sm">
                                     <thead className="bg-slate-700 text-slate-300"><tr><th className="p-3">نام</th><th className="p-3">دامنه</th><th className="p-3">کمیسیون</th><th className="p-3 text-center">عملیات</th></tr></thead>
                                     <tbody className="divide-y divide-slate-700 bg-slate-800">
                                         {partners.map(p => (<tr key={p.id} className="hover:bg-slate-700/30 transition-colors"><td className="p-3 text-white font-medium">{p.name}</td><td className="p-3 text-slate-400 font-mono" dir="ltr">{p.domain}</td><td className="p-3 text-emerald-400 font-bold">{p.commissionRate}%</td><td className="p-3 text-center"><button onClick={() => handleDeletePartner(p.id)} className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-colors"><TrashIcon /></button></td></tr>))}
                                     </tbody>
                                 </table>
                             </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default ManagerDashboard;
