
import React, { useState, useEffect, useMemo } from 'react';
import { User, Product, Review, Wishlist } from '../types';
import { getMerchantProducts, getMerchantReviews, toggleFollow, submitReview } from '../services/api';
import ReviewModal from './ReviewModal';
import { ExploreProductSkeleton } from './Skeleton';
import { useAppContext } from '../AppContext';

interface StoreProfileProps {
  currentUser: User | null;
  merchant: User;
  onBack: () => void;
  onAddToWishlist: (product: Product) => void;
  userWishlists: Wishlist[];
}

const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
const VerifiedBadge = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-7 w-7 text-blue-400"} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
    </svg>
);
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" /><path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" /></svg>;
const HeartIcon = ({ filled }: { filled?: boolean }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${filled ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;

const StoreProfile: React.FC<StoreProfileProps> = ({ merchant, onBack, onAddToWishlist }) => {
    const { myWishlists } = useAppContext();
    const [products, setProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('products');

    useEffect(() => { loadStoreData(); }, [merchant.id]);

    const loadStoreData = async () => {
        setIsLoading(true);
        try {
            const [prods, revs] = await Promise.all([ 
                getMerchantProducts(merchant.id), 
                getMerchantReviews(merchant.id) 
            ]);
            setProducts(prods || []); 
            setReviews(revs || []);
        } finally { 
            setTimeout(() => setIsLoading(false), 600); 
        }
    };

    // بررسی اینکه آیا خود کاربر این محصول را در لیست‌هایش دارد
    const isAlreadyWished = (productId: string) => {
        return myWishlists.some(list => 
            list.items.some(item => item.productId === productId)
        );
    };

    return (
        <div className="flex flex-col h-full bg-[#FDFBF9] dark:bg-slate-950 pb-20 overflow-y-auto" dir="rtl">
            <header className="relative flex-shrink-0">
                <div className="h-72 sm:h-80 w-full overflow-hidden bg-slate-900 relative">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${merchant.coverImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d9?w=1200&q=80'})` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#FDFBF9] dark:to-slate-950"></div>
                    <button onClick={onBack} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/30 rounded-full text-white backdrop-blur-xl transition-all z-20 border border-white/10 active:scale-90"><BackIcon /></button>
                </div>
                
                <div className="px-6 -mt-20 relative z-10 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-[2.5rem] border-[6px] border-[#FDFBF9] dark:border-slate-950 shadow-2xl overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center">
                        {merchant.avatar ? <img src={merchant.avatar} className="w-full h-full object-cover" /> : <div className="text-4xl font-black text-slate-300">{(merchant.shopName || merchant.name).charAt(0)}</div>}
                    </div>
                    <div className="text-center mt-4">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                            {merchant.shopName || merchant.name}
                            <VerifiedBadge className="w-6 h-6" />
                        </h1>
                        <div className="flex flex-col items-center gap-1 mt-2">
                            {merchant.shahkarVerified && (
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100">
                                    <ShieldCheckIcon />
                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">هویت فروشنده تایید شده در شاهکار</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <nav className="mt-8 px-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex gap-8 justify-center">
                    <button onClick={() => setActiveTab('products')} className={`pb-4 px-2 text-sm font-black transition-all border-b-2 ${activeTab === 'products' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-400'}`}>محصولات ({products.length})</button>
                    <button onClick={() => setActiveTab('reviews')} className={`pb-4 px-2 text-sm font-black transition-all border-b-2 ${activeTab === 'reviews' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-400'}`}>نظرات</button>
                </div>
            </nav>

            <main className="p-6">
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => <ExploreProductSkeleton key={i} />)}
                    </div>
                ) : activeTab === 'products' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                        {products.map(p => {
                            const isOutOfStock = p.stock <= 0;
                            const hasReservations = p.reservedStock > 0;
                            const wishedByMe = isAlreadyWished(p.id);
                            
                            return (
                                <div key={p.id} className={`bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col group transition-all hover:shadow-2xl ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}>
                                    <div className="aspect-square bg-slate-50 dark:bg-slate-800 relative overflow-hidden">
                                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
                                        
                                        {/* آمار محصول */}
                                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center pointer-events-none">
                                            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                                                <HeartIcon filled={true} />
                                                <span className="text-[9px] font-black text-rose-600">{(p.id.length % 5 + 1).toLocaleString('fa-IR')}</span>
                                            </div>
                                            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                                                <span className="text-[9px] font-black text-slate-500">📦 {p.stock.toLocaleString('fa-IR')}</span>
                                            </div>
                                        </div>

                                        {isOutOfStock && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span className="bg-white text-slate-900 px-4 py-1.5 rounded-full font-black text-[10px] shadow-xl uppercase">ناموجود</span>
                                            </div>
                                        )}
                                        {!isOutOfStock && hasReservations && (
                                            <div className="absolute top-3 right-3 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-tighter animate-pulse">
                                                {p.reservedStock} رزرو شده
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h4 className="font-black text-xs text-slate-800 dark:text-white line-clamp-2 mb-1 leading-relaxed h-10">{p.name}</h4>
                                        <div className="flex justify-between items-center mb-3">
                                            <p className="text-base font-black text-emerald-600">{p.price?.toLocaleString('fa-IR')} ت</p>
                                        </div>
                                        
                                        <button 
                                            onClick={() => !isOutOfStock && !wishedByMe && onAddToWishlist(p)} 
                                            disabled={isOutOfStock || wishedByMe}
                                            className={`w-full py-3 rounded-2xl text-[11px] font-black flex items-center justify-center gap-2 transition-all shadow-lg ${
                                                isOutOfStock 
                                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                                : wishedByMe
                                                ? 'bg-rose-600 text-white cursor-default'
                                                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-rose-600 hover:text-white active:scale-95'
                                            }`}
                                        >
                                            {wishedByMe ? (
                                                <>
                                                    <HeartIcon filled={true} />
                                                    <span>آرزو کردی</span>
                                                </>
                                            ) : (
                                                <>
                                                    <GiftIcon />
                                                    <span>{isOutOfStock ? 'موجود نیست' : 'آرزو کن'}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center text-slate-400 font-bold">هنوز نظری برای این فروشگاه ثبت نشده است.</div>
                )}
            </main>
        </div>
    );
};

export default StoreProfile;
