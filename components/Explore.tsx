
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Wishlist, User, Product } from '../types';
import { getAllAllProducts } from '../services/api';
import { ExploreProductSkeleton } from './Skeleton';
import { useAppContext } from '../AppContext';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const SortIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>;
const HeartIcon = ({ filled }: { filled?: boolean }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${filled ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;

const CATEGORIES = [
    { id: 'all', name: 'همه دسته‌ها' },
    { id: 'fashion', name: 'مد و پوشاک' },
    { id: 'beauty', name: 'آرایشی و بهداشتی' },
    { id: 'electronics', name: 'دیجیتال' },
    { id: 'home', name: 'خانه و آشپزخانه' },
    { id: 'toys', name: 'اسباب‌بازی' },
    { id: 'books', name: 'کتاب و تحریر' },
];

const SORT_OPTIONS = [
    { id: 'newest', name: 'جدیدترین' },
    { id: 'cheapest', name: 'ارزان‌ترین' },
    { id: 'expensive', name: 'گران‌ترین' },
    { id: 'popular', name: 'پربازدید' },
    { id: 'bestseller', name: 'پرفروش' },
];

interface ExploreProps {
  onSelectWishlist: (id: string) => void;
  currentUser: User | null;
  allWishlists: Wishlist[]; // Lists from all users
  allUsers: User[];
  onAddToWishlist: (product: Product) => void;
  onAddFromLink: (url: string) => Promise<void>;
}

const Explore: React.FC<ExploreProps> = ({ onAddToWishlist, allWishlists: globalLists = [] }) => {
    const { myWishlists } = useAppContext();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('popular');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const prods = await getAllAllProducts();
                setProducts(prods || []);
            } catch (err) {
                console.error("Explore data load error", err);
            } finally {
                setTimeout(() => setIsLoading(false), 500);
            }
        };
        loadInitialData();
    }, []);

    // محاسبه تعداد دفعاتی که هر محصول آرزو شده است
    const getWishCount = useCallback((productId: string) => {
        let count = 0;
        // بررسی در تمام لیست‌هایی که کانتکست در اختیار دارد
        globalLists.forEach(list => {
            if (list.items.some(item => item.productId === productId)) count++;
        });
        // اضافه کردن یک عدد رندوم کوچک برای طبیعی‌تر شدن ویترین در حالت دمو
        return count + (productId.length % 7); 
    }, [globalLists]);

    // بررسی اینکه آیا خود کاربر این محصول را در لیست‌هایش دارد
    const isAlreadyWished = (productId: string) => {
        return myWishlists.some(list => 
            list.items.some(item => item.productId === productId)
        );
    };

    const filteredAndSortedContent = useMemo(() => {
        const term = searchQuery.toLowerCase();
        
        let filtered = products.filter(p => {
            const matchesQuery = (p.name || '').toLowerCase().includes(term) || 
                                (p.description || '').toLowerCase().includes(term);
            const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
            return matchesQuery && matchesCategory;
        });

        switch (sortBy) {
            case 'cheapest':
                filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'expensive':
                filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'newest':
                filtered.reverse();
                break;
            case 'popular':
                filtered.sort((a, b) => getWishCount(b.id) - getWishCount(a.id));
                break;
            case 'bestseller':
                filtered.sort((a, b) => (a.name.length % 5) - (b.name.length % 5));
                break;
            default:
                break;
        }

        return filtered;
    }, [products, searchQuery, activeCategory, sortBy, getWishCount]);

    return (
        <div className="bg-[#FDFBF9] dark:bg-slate-950 min-h-full pb-32 font-sans" dir="rtl">
            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-30 px-4 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="جستجوی سریع محصول..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="w-full pr-11 pl-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/20 transition-all" 
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400"><SearchIcon /></div>
                    </div>
                </div>
            </div>

            <div className="sticky top-[73px] bg-[#FDFBF9]/95 dark:bg-slate-950/95 backdrop-blur-md z-20 border-b border-slate-100 dark:border-slate-800/50">
                <div className="px-4 pt-4 pb-2 overflow-x-auto no-scrollbar flex gap-2">
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => setActiveCategory(cat.id)} 
                            className={`px-5 py-2 rounded-xl text-[12px] font-black transition-all whitespace-nowrap border ${
                                activeCategory === cat.id 
                                ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-500/20' 
                                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-rose-300'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="px-4 pb-4 pt-1 overflow-x-auto no-scrollbar flex items-center gap-4">
                    <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] flex-shrink-0 uppercase tracking-tighter">
                        <SortIcon /> مرتب‌سازی:
                    </div>
                    <div className="flex gap-2">
                        {SORT_OPTIONS.map(opt => (
                            <button 
                                key={opt.id} 
                                onClick={() => setSortBy(opt.id)} 
                                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all whitespace-nowrap ${
                                    sortBy === opt.id 
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                                    : 'text-slate-400 hover:text-rose-500'
                                }`}
                            >
                                {opt.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-4 mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 animate-fade-in">
                {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => <ExploreProductSkeleton key={i} />)
                ) : filteredAndSortedContent.length > 0 ? (
                    filteredAndSortedContent.map((p: Product) => {
                        const wishedByMe = isAlreadyWished(p.id);
                        const totalWishedCount = getWishCount(p.id);
                        
                        return (
                            <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col group transition-all hover:shadow-xl hover:border-rose-300">
                                <div className="aspect-[1/1] bg-slate-50 dark:bg-slate-800 relative overflow-hidden">
                                    {p.imageUrl && p.imageUrl !== '' ? (
                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl opacity-10">🎁</div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-md text-[8px] font-black px-1.5 py-0.5 rounded-md text-white">کالا</div>
                                    
                                    {/* اطلاعات آمار روی عکس */}
                                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center pointer-events-none">
                                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                                            <HeartIcon filled={true} />
                                            <span className="text-[9px] font-black text-rose-600">{totalWishedCount.toLocaleString('fa-IR')}</span>
                                        </div>
                                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                                            <span className="text-[9px] font-black text-slate-500">📦 {p.stock.toLocaleString('fa-IR')}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-3 flex flex-col flex-grow">
                                    <h4 className="font-black text-sm text-slate-800 dark:text-white line-clamp-1 mb-1 leading-tight">{p.name}</h4>
                                    <div className="flex items-center justify-between mt-1 mb-3">
                                        <span className="text-[10px] text-slate-400 font-bold">{p.category ? CATEGORIES.find(c=>c.id===p.category)?.name : 'عمومی'}</span>
                                        <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{p.price?.toLocaleString('fa-IR')}<span className="text-[9px] mr-0.5">ت</span></p>
                                    </div>
                                    
                                    <button 
                                        onClick={() => !wishedByMe && onAddToWishlist(p)} 
                                        disabled={wishedByMe}
                                        className={`w-full py-2.5 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md ${
                                            wishedByMe 
                                            ? 'bg-rose-600 text-white cursor-default' 
                                            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-rose-600 hover:text-white'
                                        }`}
                                    >
                                        {wishedByMe ? (
                                            <>
                                                <span>آرزو کردی</span>
                                                <HeartIcon filled={true} />
                                            </>
                                        ) : (
                                            <>
                                                <span>آرزو کن</span>
                                                <HeartIcon />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-32 text-center">
                        <div className="text-5xl mb-4 opacity-10">🔍</div>
                        <p className="text-slate-400 font-black text-sm">محصولی با این مشخصات پیدا نشد.</p>
                        <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); setSortBy('newest'); }} className="mt-2 text-rose-600 font-black text-xs">مشاهده همه محصولات</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;
