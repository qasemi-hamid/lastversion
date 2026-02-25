
import React, { useState, useMemo } from 'react';
import { Wishlist, User, MicroItem } from '../types';
import { useAppContext } from '../AppContext';
import AddListModal from './AddListModal';
import AddMicroItemModal from './AddMicroItemModal';

interface CharityDashboardProps {
  wishlists: Wishlist[];
  users: User[];
  onViewList: (listId: string) => void;
  currentUser?: User;
  onLogout: () => void;
}

// Icons
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011-1h2a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>;
const ChartPieIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;
const MegaphoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>;
const SmileIcon = () => <span className="text-lg">🍦</span>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

const CharityDashboard: React.FC<CharityDashboardProps> = ({ wishlists, onViewList, currentUser, onLogout }) => {
    const { addMicroItem, microItems, createList, showToast } = useAppContext();
    const [activeTab, setActiveTab] = useState<'analytics' | 'campaigns' | 'micro' | 'donors'>('analytics');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddMicroModalOpen, setIsAddMicroModalOpen] = useState(false);

    const myMicroItems = useMemo(() => {
        if (!currentUser) return [];
        return microItems.filter(m => m.charityId === currentUser.id);
    }, [microItems, currentUser]);

    const stats = useMemo(() => {
        let totalRaised = 0;
        const donorIds = new Set();
        let completedItems = 0;
        let totalItems = 0;

        wishlists.forEach(list => {
            list.items.forEach(item => {
                totalItems++;
                const raisedForItem = (item.contributions || []).reduce((sum, c) => sum + c.amount, 0);
                totalRaised += raisedForItem;
                (item.contributions || []).forEach(c => donorIds.add(c.userId));
                if (item.status === 'funded' || item.status === 'settled' || (item.price && raisedForItem >= item.price)) {
                    completedItems++;
                }
            });
        });

        const campaignProgress = wishlists.map(list => {
            const target = list.items.reduce((s, i) => s + (i.price || 0), 0);
            const raised = list.items.reduce((s, i) => s + (i.contributions || []).reduce((sum, c) => sum + c.amount, 0), 0);
            return {
                id: list.id,
                name: list.name,
                percent: target > 0 ? Math.round((raised / target) * 100) : 0,
                raised
            };
        }).sort((a, b) => b.percent - a.percent);

        return { totalRaised, donorCount: donorIds.size, completedItems, totalItems, activeCampaigns: wishlists.length, campaignProgress };
    }, [wishlists]);

    const handleCopy = (text: string, msg: string) => {
        navigator.clipboard.writeText(text);
        showToast(msg);
    };

    const handleAddMicro = async (item: any) => {
        if (!currentUser) return;
        await addMicroItem({ ...item, charityId: currentUser.id });
        setIsAddMicroModalOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 pb-20 overflow-y-auto" dir="rtl">
            <header className="p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
                            <HeartIcon />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 dark:text-white">مدیریت خیریه</h1>
                            <p className="text-xs text-slate-500 font-bold mt-1">شفافیت و مهربانی</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={onLogout}
                            className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 rounded-xl transition-all active:scale-90"
                            title="خروج از حساب"
                        >
                            <LogoutIcon />
                        </button>
                         <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95"
                        >
                            <PlusIcon /> کمپین جدید
                        </button>
                    </div>
                </div>

                <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto no-scrollbar">
                    {[
                        { id: 'analytics', label: 'آمار و لینک‌ها', icon: <ChartPieIcon /> },
                        { id: 'campaigns', label: 'کمپین‌ها', icon: <MegaphoneIcon /> },
                        { id: 'micro', label: 'سهم لبخند', icon: <SmileIcon /> },
                        { id: 'donors', label: 'حامیان', icon: <HeartIcon /> }
                    ].map(t => (
                        <button 
                            key={t.id} 
                            onClick={() => setActiveTab(t.id as any)}
                            className={`flex-1 min-w-[90px] flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === t.id ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm scale-[1.02]' : 'text-slate-500'}`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>
            </header>

            <main className="p-6 space-y-6 animate-fade-in">
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        {/* Quick Links Section */}
                        <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-10 -mt-10 blur-2xl"></div>
                            <div className="relative z-10">
                                <h3 className="text-sm font-black mb-4 flex items-center gap-2">🔗 لینک‌های سریع اشتراک‌گذاری</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <button 
                                        onClick={() => handleCopy(`${window.location.origin}/?ref=${currentUser?.id}`, 'لینک عضویت کپی شد')}
                                        className="flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/20 rounded-xl"><ShareIcon /></div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black">لینک دعوت و عضویت</p>
                                                <p className="text-[8px] opacity-70">برای جذب نیکوکاران جدید</p>
                                            </div>
                                        </div>
                                        <LinkIcon />
                                    </button>
                                    <button 
                                        onClick={() => handleCopy(`${window.location.origin}/?participate=all`, 'لینک مشارکت مستقیم کپی شد')}
                                        className="flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/20 rounded-xl"><HeartIcon /></div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black">لینک مشارکت بدون ثبت‌نام</p>
                                                <p className="text-[8px] opacity-70">اتصال مستقیم به درگاه و شبا</p>
                                            </div>
                                        </div>
                                        <LinkIcon />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* KPI Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">مجموع کمک‌ها</p>
                                <p className="text-lg font-black text-emerald-600">{stats.totalRaised.toLocaleString('fa-IR')} <span className="text-[10px]">ت</span></p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">نیکوکاران</p>
                                <p className="text-lg font-black text-indigo-600">{stats.donorCount.toLocaleString('fa-IR')} <span className="text-[10px]">نفر</span></p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'campaigns' && (
                    <div className="space-y-4">
                        {wishlists.map(list => (
                            <div key={list.id} className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-indigo-400 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">
                                        {list.coverImage ? (
                                            <img src={list.coverImage} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">❤️</div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white">{list.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${list.privacy === 'public' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {list.privacy === 'public' ? 'انتشار عمومی (در پویش‌ها)' : 'خصوصی'}
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-bold">{list.items.length} آیتم</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleCopy(`${window.location.origin}/?list=${list.id}`, 'لینک عمومی کپی شد')}
                                        className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all"
                                        title="کپی لینک مستقیم"
                                    >
                                        <LinkIcon />
                                    </button>
                                    <button onClick={() => onViewList(list.id)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
                                        <MegaphoneIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'micro' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setIsAddMicroModalOpen(true)}
                                className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border-2 border-dashed border-sky-200 flex flex-col items-center justify-center text-center group hover:border-sky-400 transition-all min-h-[140px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 mb-3 group-hover:scale-110 transition-transform"><PlusIcon /></div>
                                <span className="text-[10px] font-black text-sky-600">آیتم جدید لبخند</span>
                            </button>
                            {myMicroItems.map(item => (
                                <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                                    <span className="text-4xl mb-3">{item.icon}</span>
                                    <span className="text-xs font-black mb-1">{item.name}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${item.color} bg-opacity-20`}>{item.price.toLocaleString('fa-IR')} ت</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <AddListModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onAddList={async (details, type) => {
                    // Force public privacy for charity campaigns
                    await createList({ ...details, privacy: 'public' }, 'charity');
                }} 
                profileType="charity" 
                currentUser={currentUser} 
            />
            <AddMicroItemModal isOpen={isAddMicroModalOpen} onClose={() => setIsAddMicroModalOpen(false)} onAdd={handleAddMicro} />
        </div>
    );
};

export default CharityDashboard;
