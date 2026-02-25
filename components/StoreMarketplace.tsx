
import React, { useState, useMemo, useEffect } from 'react';
import { User, Product } from '../types';
import { MOCK_MERCHANTS } from '../data/seedData';
import { getAllMerchants } from '../services/api';
import { StoreCardSkeleton } from './Skeleton';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const VerifiedBadge = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" /></svg>;
const FireIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.355-1.5-.375-.515-.395-1.052-.2-1.997zM10 18a5 5 0 01-4-8c.463-1.247 1.156-2.322 1.812-3.105a11.957 11.957 0 011.81 7.33 1 1 0 001.314.933L13.5 14.5A3.5 3.5 0 0110 18z" clipRule="evenodd" /></svg>;

const CATEGORIES = [
    { id: 'fashion', name: 'مد و پوشاک', icon: '👕' },
    { id: 'beauty', name: 'آرایشی', icon: '💄' },
    { id: 'electronics', name: 'دیجیتال', icon: '💻' },
    { id: 'home', name: 'خانه', icon: '🏠' },
    { id: 'toys', name: 'سرگرمی', icon: '🎮' },
    { id: 'food', name: 'سوپرمارکت', icon: '🛒' },
];

const StoreCard: React.FC<{ merchant: any, onSelect: (m: any) => void, isFeatured?: boolean }> = ({ merchant, onSelect, isFeatured }) => (
    <div 
        onClick={() => onSelect(merchant)} 
        className={`bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group flex flex-col ${isFeatured ? 'ring-2 ring-indigo-500/20' : ''}`}
    >
        <div className="h-28 bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${(merchant.coverImage && merchant.coverImage !== '') ? merchant.coverImage : 'https://images.unsplash.com/photo-1472851294608-415522f97817?w=400&q=80'}')` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            {isFeatured && <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-lg shadow-lg">برتر ماه</div>}
        </div>
        <div className="px-4 pb-5 -mt-10 relative z-10 text-center flex-grow">
            <div className="w-16 h-16 mx-auto rounded-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden shadow-lg flex items-center justify-center">
                {merchant.avatar && merchant.avatar !== '' ? <img src={merchant.avatar} className="w-full h-full object-cover" /> : <div className="text-xl font-black text-slate-300">{(merchant.shopName||merchant.name||'ف').charAt(0)}</div>}
            </div>
            <h4 className="font-black text-sm mt-3 flex items-center justify-center gap-1 text-slate-900 dark:text-white truncate px-2">
                {merchant.shopName || merchant.name} <VerifiedBadge />
            </h4>
            <p className="text-[9px] text-slate-400 font-bold mt-1 line-clamp-1">تامین‌کننده رسمی محصولات اورجینال</p>
            <div className="mt-4 py-2.5 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black group-hover:bg-indigo-600 group-hover:text-white transition-all border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center justify-center gap-2">
                ورود به فروشگاه <span className="text-xs">←</span>
            </div>
        </div>
    </div>
);

interface StoreMarketplaceProps {
  currentUser: User | null;
  onSelectMerchant: (merchant: any) => void;
  merchants: any[];
  onAddToWishlist: (product: Product) => void;
}

const StoreMarketplace: React.FC<StoreMarketplaceProps> = ({ onSelectMerchant }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [realMerchants, setRealMerchants] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await getAllMerchants();
            setRealMerchants(data || []);
        } finally {
            setTimeout(() => setIsLoading(false), 600);
        }
    };

    const allStores = useMemo(() => {
        const unique = new Map();
        // First add real ones
        realMerchants.forEach(m => unique.set(m.id, m));
        // Add mock ones only if ID or ShopName is not already present
        MOCK_MERCHANTS.forEach(m => { 
            const alreadyExists = unique.has(m.id) || Array.from(unique.values()).some((existing: any) => existing.shopName === m.shopName);
            if(!alreadyExists) unique.set(m.id, m); 
        });
        
        return Array.from(unique.values()).filter(m => 
            (m.shopName || m.name || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [realMerchants, searchQuery]);

    const featuredStores = useMemo(() => allStores.slice(0, 4), [allStores]);

    return (
        <div className="flex flex-col h-full bg-[#FDFBF9] dark:bg-slate-950 pb-24 overflow-y-auto" dir="rtl">
            {/* Minimalist Search Header */}
            <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">بازارچه برندها</h2>
                        <span className="text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">کلیک و خرید با تخفیف ویژه</span>
                    </div>
                    <div className="relative group">
                        <input 
                            type="text" 
                            placeholder="جستجوی نام فروشگاه یا برند (دیجی‌کالا، بانی‌مد و...)" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="w-full pr-11 pl-4 py-3.5 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm font-bold text-slate-900 dark:text-white transition-all outline-none shadow-inner" 
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><SearchIcon /></div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full px-6 py-6 space-y-10">
                
                {/* Categories Row */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-r-4 border-indigo-500 pr-3">دسته‌بندی فروشگاه‌ها</h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {CATEGORIES.map(cat => (
                            <button key={cat.id} className="flex flex-col items-center gap-3 flex-shrink-0 group">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-indigo-50 transition-all">
                                    {cat.icon}
                                </div>
                                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 group-hover:text-indigo-600">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured / Top Stores */}
                {!searchQuery && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-r-4 border-rose-500 pr-3 flex items-center gap-2">
                                <FireIcon /> برترین فروشگاه‌های منتخب
                            </h3>
                            <button className="text-[10px] font-black text-indigo-600 hover:underline">مشاهده همه</button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => <StoreCardSkeleton key={i} />)
                            ) : (
                                featuredStores.map(m => <StoreCard key={m.id} merchant={m} onSelect={onSelectMerchant} isFeatured={true} />)
                            )}
                        </div>
                    </div>
                )}

                {/* All Stores / Bestsellers */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-r-4 border-slate-300 pr-3">
                        {searchQuery ? `نتایج جستجو برای "${searchQuery}"` : 'پرفروش‌ترین برندها'}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, i) => <StoreCardSkeleton key={i} />)
                        ) : (
                            allStores.length > 0 ? (
                                allStores.map(m => <StoreCard key={m.id} merchant={m} onSelect={onSelectMerchant} />)
                            ) : (
                                <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                    <div className="text-4xl mb-3">🔍</div>
                                    <p className="text-slate-400 font-bold">فروشگاهی با این نام یافت نشد.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreMarketplace;
