
import React, { useState, useEffect, useMemo } from 'react';
import { User, Product, Order, Wishlist, WishlistItem, Friendship, Wallet } from '../types';
import { 
    getMerchantOrders, 
    getMerchantProducts, 
    deleteProduct, 
    updateProduct,
    updateOrderDelivery, 
    updateUserProfile,
    getMerchantOpportunities,
    createNotification,
    verifyShahkar,
    getFriendships,
    getAllUsersForAdmin
} from '../services/api';
import AddProductModal from './AddProductModal';
import InvoiceModal from './InvoiceModal';
import ShipmentModal from './ShipmentModal';
import MakeOfferModal from './MakeOfferModal';
import FriendsManagement from './FriendsManagement';
import WalletModal from './WalletModal';

interface MerchantDashboardProps {
    currentUser: User;
    onAddProduct: (product: any) => Promise<void>;
    onLogout: () => void;
    onRefreshData: () => Promise<void>;
    isSyncing?: boolean;
    friendships: Friendship[];
    allUsers: User[];
    processedFriends: { user: User, friendshipId: string }[];
    pendingRequests: { user: User, friendship: Friendship }[];
    acceptRequest: (id: string) => Promise<void>;
    sendRequest: (id: string) => Promise<void>;
    declineOrRemove: (id: string) => Promise<void>;
    onSearchUsers: (query: string) => Promise<User[]>;
}

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 v4a1 1 0 001 1m-6 0h6" /></svg>;
const BoxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>;
const RadarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}> <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;

const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ 
    currentUser: initialUser, onAddProduct, onLogout, onRefreshData, isSyncing,
    friendships, allUsers, processedFriends, pendingRequests, acceptRequest, sendRequest, declineOrRemove, onSearchUsers
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'opportunities' | 'orders' | 'social' | 'account'>('overview');
    const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
    const [currentUser, setCurrentUser] = useState<User>(initialUser);
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [hotDemands, setHotDemands] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [offerTarget, setOfferTarget] = useState<any | null>(null);
    const [sentOfferIds, setSentOfferIds] = useState<string[]>([]);
    
    const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
    const [selectedOrderForShipment, setSelectedOrderForShipment] = useState<Order | null>(null);

    const [editName, setEditName] = useState(currentUser.shopName || currentUser.name);
    const [editAddress, setEditAddress] = useState(currentUser.address || '');
    const [editShaba, setEditShaba] = useState(currentUser.shaba || '');
    const [editNationalCode, setEditNationalCode] = useState(currentUser.nationalCode || '');
    const [editAccountHolder, setEditAccountHolder] = useState(currentUser.accountHolderName || '');
    const [editPhone, setEditPhone] = useState(currentUser.contactNumber || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isShahkarLoading, setIsShahkarLoading] = useState(false);

    const loadData = async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const [p, o, demands] = await Promise.all([
                getMerchantProducts(currentUser.id),
                getMerchantOrders(currentUser.id),
                getMerchantOpportunities() 
            ]);
            setProducts(p || []); 
            setOrders(o || []);
            setHotDemands(demands || []);
        } catch (e) {
            console.error("Dashboard Load Error:", e);
        } finally {
            if (!silent) setTimeout(() => setIsLoading(false), 500);
        }
    };

    useEffect(() => { loadData(); }, [currentUser.id]);

    const handleRefresh = async () => {
        await onRefreshData();
        await loadData();
    };

    const handleShahkarVerify = async () => {
        if (!editNationalCode || editNationalCode.length !== 10) {
            alert('لطفاً ابتدا کد ملی ۱۰ رقمی خود را در بخش زیر وارد کنید.');
            return;
        }
        setIsShahkarLoading(true);
        try {
            const res = await verifyShahkar(currentUser.id, editNationalCode, currentUser.mobile || '');
            if (res.success) {
                setCurrentUser(prev => ({ ...prev, shahkarVerified: true }));
                alert(res.message);
            } else {
                alert(res.message);
            }
        } finally {
            setIsShahkarLoading(false);
        }
    };

    const handleUpdateAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const updated = await updateUserProfile(currentUser.id, {
                shopName: editName,
                address: editAddress,
                shaba: editShaba.replace(/\s/g, '').toUpperCase(),
                nationalCode: editNationalCode,
                accountHolderName: editAccountHolder,
                contactNumber: editPhone
            });
            setCurrentUser(updated);
            alert('اطلاعات با موفقیت ذخیره شد.');
        } catch (e) {
            alert('خطا در بروزرسانی اطلاعات.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleProductAction = async (productData: any) => {
        setIsLoading(true);
        try {
            if (productToEdit) {
                await updateProduct(productToEdit.id, productData);
                alert('محصول با موفقیت ویرایش شد.');
            } else {
                await onAddProduct(productData);
                alert('محصول جدید ثبت شد.');
            }
            setProductToEdit(null);
            // بارگذاری مجدد داده‌ها به صورت اجباری
            await loadData(false);
        } catch (err) {
            alert('خطا در ثبت تغییرات');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (window.confirm('آیا از حذف این محصول مطمئن هستید؟')) {
            try {
                await deleteProduct(id);
                await loadData();
                alert('محصول با موفقیت حذف شد.');
            } catch (error) {
                console.error("Delete failed:", error);
                alert('خطا در حذف محصول. مجدداً تلاش کنید.');
            }
        }
    };

    const filteredOrders = useMemo(() => {
        if (orderFilter === 'all') return orders;
        return orders.filter(o => o.status === orderFilter);
    }, [orders, orderFilter]);

    const totalSales = useMemo(() => orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0), [orders]);

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden" dir="rtl">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center shadow-sm z-30">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg overflow-hidden border border-white/20">
                        {currentUser.avatar && currentUser.avatar !== '' ? <img src={currentUser.avatar} className="w-full h-full object-cover" /> : <div className="text-xl font-black">{editName.charAt(0)}</div>}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{currentUser.shopName || currentUser.name}</h1>
                            {currentUser.shahkarVerified && <ShieldCheckIcon />}
                            
                            <button 
                                onClick={handleRefresh}
                                disabled={isSyncing}
                                className={`mr-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all ${isSyncing ? 'animate-spin' : ''}`}
                                title="بروزرسانی داده‌ها"
                            >
                                <RefreshIcon />
                            </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            {currentUser.shahkarVerified ? (
                                <span className="flex items-center gap-1 text-[8px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded uppercase border border-emerald-100">فروشگاه تایید شده ✓</span>
                            ) : (
                                <span className="flex items-center gap-1 text-[8px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded uppercase border border-rose-100">عدم تایید هویت فروشگاه</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsWalletOpen(true)} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-indigo-600 hover:scale-105 transition-all"><WalletIcon /></button>
                    <button onClick={onLogout} className="text-xs font-black text-slate-400 hover:text-rose-500 transition-colors">خروج</button>
                </div>
            </header>

            <nav className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 shadow-sm flex-shrink-0">
                <div className="flex gap-6 max-w-5xl mx-auto overflow-x-auto no-scrollbar">
                    {[
                        { id: 'overview', label: 'پیشخوان', icon: <HomeIcon /> },
                        { id: 'products', label: 'محصولات', icon: <BoxIcon /> },
                        { id: 'opportunities', label: 'فرصت‌های فروش', icon: <RadarIcon /> },
                        { id: 'orders', label: 'سفارشات', icon: <TruckIcon /> },
                        { id: 'social', label: 'ارتباطات', icon: <UserIcon /> },
                        { id: 'account', label: 'امنیت و مالی', icon: <ShieldCheckIcon /> },
                    ].map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => setActiveTab(tab.id as any)} 
                            className={`flex items-center gap-2 py-4 px-1 text-sm font-black border-b-2 transition-all relative whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'border-indigo-600 text-indigo-600' 
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {tab.icon} 
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            <main className="flex-1 overflow-y-auto p-4 sm:p-8 container mx-auto max-w-6xl pb-24">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-black text-slate-500">در حال دریافت اطلاعات...</p>
                    </div>
                ) : (
                    <>
                    {activeTab === 'products' && (
                        <div className="space-y-6 animate-fade-in">
                             <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">محصولات من</h2>
                                <button onClick={() => { setProductToEdit(null); setIsAddProductOpen(true); }} className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-black text-xs shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
                                    <PlusIcon /> محصول جدید
                                </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.length > 0 ? products.map(p => (
                                    <div key={p.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm group hover:shadow-xl transition-all">
                                        <div className="aspect-square bg-slate-50 dark:bg-slate-800 relative overflow-hidden">
                                            {p.imageUrl && p.imageUrl !== '' ? <img src={p.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🎁</div>}
                                            <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setProductToEdit(p); setIsAddProductOpen(true); }} className="p-2.5 bg-white/90 dark:bg-slate-800/90 rounded-xl text-indigo-600 hover:bg-white transition-all shadow-md">
                                                    <EditIcon />
                                                </button>
                                                <button onClick={() => handleDeleteProduct(p.id)} className="p-2.5 bg-rose-50/90 dark:bg-rose-900/90 rounded-xl text-rose-600 hover:bg-rose-100 transition-all shadow-md">
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h4 className="font-black text-xs text-slate-800 dark:text-white line-clamp-2 h-10 leading-relaxed mb-1">{p.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold line-clamp-1 mb-3">{p.description || 'بدون توضیح'}</p>
                                            <p className="text-emerald-600 font-black text-base">{p.price.toLocaleString('fa-IR')} ت</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                        <p className="text-slate-400 font-bold">هنوز محصولی اضافه نکرده‌اید.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'opportunities' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <RadarIcon /> آرزوهای داغ (فرصت فروش)
                            </h2>
                            <p className="text-xs text-slate-500 font-bold -mt-4">محصولاتی که کاربران در لیست‌های خود قرار داده‌اند و منتظر پیشنهاد قیمت هستند.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {hotDemands.length > 0 ? hotDemands.map(demand => (
                                    <div key={demand.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-rose-400 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 overflow-hidden shadow-inner">
                                                {demand.imageUrl && demand.imageUrl !== '' ? <img src={demand.imageUrl} className="w-full h-full object-cover" /> : <div className="text-2xl h-full w-full flex items-center justify-center">🎁</div>}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-sm text-slate-900 dark:text-white">{demand.name}</h4>
                                                <p className="text-[10px] text-slate-400 mt-1 font-bold">قیمت مدنظر کاربر: {demand.price?.toLocaleString('fa-IR')} ت</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setOfferTarget(demand)}
                                            disabled={sentOfferIds.includes(demand.id)}
                                            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-lg transition-all ${
                                                sentOfferIds.includes(demand.id) 
                                                ? 'bg-emerald-100 text-emerald-600 cursor-not-allowed' 
                                                : 'bg-rose-600 text-white hover:scale-105'
                                            }`}
                                        >
                                            {sentOfferIds.includes(demand.id) ? 'پیشنهاد شد ✓' : 'ثبت پیشنهاد'}
                                        </button>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                        <p className="text-slate-400 font-bold">فرصت جدیدی یافت نشد.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'social' && (
                        <div className="animate-fade-in h-full flex flex-col">
                             <FriendsManagement 
                                currentUser={currentUser} 
                                allUsers={allUsers}
                                friendships={friendships}
                                friends={processedFriends}
                                pendingRequests={pendingRequests}
                                onSendRequest={sendRequest}
                                onAcceptRequest={acceptRequest}
                                onDeclineOrRemove={declineOrRemove}
                                onSearchUsers={onSearchUsers}
                             />
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
                            {!currentUser.shahkarVerified && (
                                <div className="bg-gradient-to-br from-rose-500 to-indigo-600 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                                    <div className="relative z-10">
                                        <h3 className="text-lg font-black mb-2 flex items-center gap-2">⚠️ احراز هویت فروشگاه الزامی است</h3>
                                        <p className="text-xs opacity-90 leading-relaxed mb-6 font-bold">برای فعال‌سازی تسویه حساب و ثبت پیشنهاد قیمت، باید مالکیت سیم‌کارت و کد ملی شما در سامانه مرکزی تایید شود.</p>
                                        <button 
                                            onClick={handleShahkarVerify}
                                            disabled={isShahkarLoading}
                                            className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            {isShahkarLoading ? <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> : 'استعلام هویت فروشگاه'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleUpdateAccount} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
                                <h3 className="text-lg font-black mb-4">تنظیمات فروشگاه و تسویه</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase mr-1">نام فروشگاه</label>
                                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase mr-1">شماره تماس (ثابت/همراه)</label>
                                        <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase mr-1">کد ملی مالک</label>
                                        <input type="text" value={editNationalCode} onChange={e => setEditNationalCode(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm dir-ltr" maxLength={10} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase mr-1">نام صاحب حساب بانکی</label>
                                        <input type="text" value={editAccountHolder} onChange={e => setEditAccountHolder(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase mr-1">شماره شبا (IBAN)</label>
                                    <input type="text" value={editShaba} onChange={e => setEditShaba(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-mono dir-ltr text-left text-sm" placeholder="IR00 0000 0000 0000 0000 0000 00" />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase mr-1">آدرس فیزیکی فروشگاه/دفتر</label>
                                    <textarea value={editAddress} onChange={e => setEditAddress(e.target.value)} rows={3} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm resize-none" placeholder="استان، شهر، خیابان..."></textarea>
                                </div>

                                <button type="submit" disabled={isUpdating} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all">
                                    {isUpdating ? "در حال ذخیره..." : "ذخیره تغییرات نهایی"}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">مدیریت سفارشات</h2>
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                    {(['all', 'pending', 'shipped', 'delivered'] as const).map(f => (
                                        <button key={f} onClick={() => setOrderFilter(f)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${orderFilter === f ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                                            {f === 'all' ? 'همه' : f === 'pending' ? 'جاری' : f === 'shipped' ? 'ارسال شده' : 'تحویل شده'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {filteredOrders.length > 0 ? filteredOrders.map(order => (
                                    <div key={order.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-[10px] font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg uppercase">#{order.id.slice(-6)}</span>
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black ${
                                                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                        {order.status === 'pending' ? 'در انتظار ارسال' : order.status === 'shipped' ? 'ارسال شده' : 'تکمیل شده'}
                                                    </span>
                                                </div>
                                                <h4 className="font-black text-sm text-slate-800 dark:text-white">{order.items.map(i => i.name).join('، ')}</h4>
                                                <p className="text-[10px] text-slate-400 mt-2 font-bold line-clamp-1">📍 مقصد: {order.deliveryAddress}</p>
                                            </div>
                                            <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                                                <button onClick={() => setSelectedOrderForInvoice(order)} className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black hover:bg-slate-200 transition-all">فاکتور</button>
                                                {order.status === 'pending' && (
                                                    <button onClick={() => setSelectedOrderForShipment(order)} className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-lg hover:bg-indigo-700 transition-all">ثبت ارسال</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                        <p className="text-slate-400 font-bold">سفارشی در این بخش یافت نشد.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                    <p className="text-slate-400 text-[10px] font-black uppercase mb-1">فروش کل</p>
                                    <p className="text-2xl font-black text-emerald-600">{totalSales.toLocaleString('fa-IR')} <span className="text-xs">تومان</span></p>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                    <p className="text-slate-400 text-[10px] font-black uppercase mb-1">محصولات فعال</p>
                                    <p className="text-2xl font-black text-indigo-600">{products.length}</p>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                    <p className="text-slate-400 text-[10px] font-black uppercase mb-1">فرصت‌های فروش</p>
                                    <p className="text-2xl font-black text-rose-500">{hotDemands.length}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    </>
                )}
            </main>

            <AddProductModal 
                isOpen={isAddProductOpen} 
                onClose={() => { setIsAddProductOpen(false); setProductToEdit(null); }} 
                onAdd={handleProductAction} 
                initialProduct={productToEdit}
            />
            <ShipmentModal isOpen={!!selectedOrderForShipment} onClose={() => setSelectedOrderForShipment(null)} order={selectedOrderForShipment} onShip={async(d)=> {await updateOrderDelivery(selectedOrderForShipment!.id, d); loadData(); }} />
            <InvoiceModal isOpen={!!selectedOrderForInvoice} onClose={() => setSelectedOrderForInvoice(null)} order={selectedOrderForInvoice} merchant={currentUser} buyer={allUsers.find(u => u.id === selectedOrderForInvoice?.buyerId)} recipient={allUsers.find(u => u.id === selectedOrderForInvoice?.receiverId)} />
            <MakeOfferModal isOpen={!!offerTarget} onClose={() => setOfferTarget(null)} item={offerTarget} onConfirm={async (p, d) => {
                if (!offerTarget) return;
                await createNotification({
                    userId: offerTarget.ownerId,
                    message: `فروشگاه ${currentUser.shopName || currentUser.name} پیشنهادی برای "${offerTarget.name}" با قیمت ${p.toLocaleString('fa-IR')} تومان ثبت کرد.`,
                    type: 'offer_received',
                    relatedItemId: offerTarget.id,
                    merchantName: currentUser.shopName || currentUser.name,
                    offerPrice: p
                });
                setSentOfferIds([...sentOfferIds, offerTarget.id]);
                setOfferTarget(null);
                alert('پیشنهاد شما برای کاربر ارسال شد.');
            }} />
            <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} wallet={currentUser.wallet || null} activeVirtualCards={[]} onShowCardDetails={()=>{}} onCreateNewCard={()=>{}} currentUser={currentUser} onWithdraw={async()=>{}} />
        </div>
    );
};

export default MerchantDashboard;
