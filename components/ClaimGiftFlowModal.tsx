
import React, { useState, useEffect, useMemo } from 'react';
import { WishlistItem, Wishlist, User } from '../types';
import * as api from '../services/api';
import PaymentModal from './PaymentModal';

interface ClaimGiftFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WishlistItem;
  wishlist: Wishlist;
  currentUser: User;
  onSuccess: () => void;
}

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
);

const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const VerifiedBadge = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const ClaimGiftFlowModal: React.FC<ClaimGiftFlowModalProps> = ({ isOpen, onClose, item, wishlist, currentUser, onSuccess }) => {
    const [step, setStep] = useState<'address' | 'payment'>('address');
    const [selectedAddress, setSelectedAddress] = useState('');
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
    const [newAddressInput, setNewAddressInput] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showGateway, setShowGateway] = useState(false);
    const [merchant, setMerchant] = useState<User | null>(null);

    // تعیین اولویت آدرس‌ها
    const addressOptions = useMemo(() => {
        const options = [];
        if (wishlist.beneficiary?.address) {
            options.push({ label: `آدرس گیرنده (ثبت شده در لیست: ${wishlist.beneficiary.name})`, value: wishlist.beneficiary.address, type: 'recipient' });
        }
        if (currentUser.address) {
            options.push({ label: `آدرس شما (هدیه دهنده: ${currentUser.name})`, value: currentUser.address, type: 'giver' });
        }
        return options;
    }, [wishlist, currentUser]);

    useEffect(() => {
        if (isOpen) {
            setStep('address');
            setIsAddingNewAddress(false);
            setNewAddressInput('');
            
            const recipientAddr = addressOptions.find(o => o.type === 'recipient');
            setSelectedAddress(recipientAddr ? recipientAddr.value : (addressOptions[0]?.value || ''));
            
            // پیدا کردن فروشنده در سیستم
            const findMerchant = async () => {
                const allUsers = await api.getAllUsersForAdmin();
                const m = allUsers.find(u => u.role === 'merchant' && (u.shopName === item.purchasedFrom || u.name === item.purchasedFrom));
                setMerchant(m || null);
                
                // اگر فروشنده در سیستم باشد یا لینک خارجی نداشته باشد یا تستی باشد، خرید داخلی است
                const isInternalStore = !!m || (item.purchasedFrom && !item.link.includes('http')) || item.isTest;
                setIsInternal(isInternalStore);
            };
            findMerchant();
        }
    }, [isOpen, addressOptions, item]);

    const handleAddNewAddress = async () => {
        if (!newAddressInput.trim()) return;
        setIsLoading(true);
        try {
            await api.updateUserProfile(currentUser.id, { address: newAddressInput.trim() });
            setSelectedAddress(newAddressInput.trim());
            setIsAddingNewAddress(false);
        } catch (e) {
            alert('خطا در ثبت آدرس');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmAddress = () => {
        if (!selectedAddress) {
            alert('لطفاً یک آدرس برای ارسال انتخاب کنید یا آدرس جدید ثبت کنید.');
            return;
        }
        setStep('payment');
    };

    const handleFinalAction = async () => {
        if (isInternal) {
            setShowGateway(true);
        } else {
            setIsLoading(true);
            try {
                await api.claimItem(item.id, currentUser.id);
                navigator.clipboard.writeText(selectedAddress);
                alert('آدرس با موفقیت کپی شد. اکنون در سایت مقصد خرید را تکمیل کنید.');
                window.open(item.link, '_blank');
                onSuccess();
                onClose();
            } catch (e) {
                alert('خطایی رخ داد.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handlePaymentComplete = async () => {
        setIsLoading(true);
        try {
            await api.claimItem(item.id, currentUser.id);
            if (item.price) {
                await api.createOrder(
                    currentUser.id, 
                    merchant?.id || 'internal-merchant-id', 
                    wishlist.ownerId, 
                    [{ name: item.name, price: item.price, quantity: 1 }], 
                    selectedAddress
                );
            }
            setShowGateway(false);
            onSuccess();
            onClose();
        } catch (e) {
            alert('خطا در ثبت نهایی سفارش');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
                
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white">رزرو و تهیه هدیه</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Secure Gift Procurement</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>

                <div className="p-8">
                    <div className="flex items-center gap-4 mb-8 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 overflow-hidden shadow-sm flex-shrink-0">
                            {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🎁</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">{item.name}</h4>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-xs text-emerald-600 font-black">{item.price?.toLocaleString('fa-IR')} تومان</span>
                                {isInternal && <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/40 rounded-lg text-[8px] font-black text-blue-600 border border-blue-100"><VerifiedBadge /> خرید مستقیم</div>}
                            </div>
                        </div>
                    </div>

                    {step === 'address' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 flex items-center gap-2"><MapPinIcon /> تایید آدرس ارسال کالا</h3>
                                {!isAddingNewAddress && (
                                    <button 
                                        onClick={() => setIsAddingNewAddress(true)}
                                        className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 flex items-center gap-1"
                                    >
                                        <PlusIcon /> آدرس جدید
                                    </button>
                                )}
                            </div>
                            
                            {isAddingNewAddress ? (
                                <div className="space-y-4 animate-fade-in">
                                    <textarea 
                                        value={newAddressInput}
                                        onChange={e => setNewAddressInput(e.target.value)}
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-900 rounded-2xl outline-none text-xs font-bold min-h-[100px] resize-none"
                                        placeholder="آدرس دقیق پستی: استان، شهر، خیابان، پلاک، واحد..."
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => setIsAddingNewAddress(false)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-[10px]">انصراف</button>
                                        <button 
                                            onClick={handleAddNewAddress} 
                                            disabled={!newAddressInput.trim() || isLoading}
                                            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] shadow-lg shadow-indigo-500/20"
                                        >
                                            {isLoading ? '...' : 'ثبت و انتخاب'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {addressOptions.length > 0 ? addressOptions.map((opt, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => setSelectedAddress(opt.value)}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddress === opt.value ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 shadow-md' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-rose-200'}`}
                                        >
                                            <p className="text-[10px] font-black text-rose-600 mb-1">{opt.label}</p>
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{opt.value}</p>
                                        </div>
                                    )) : (
                                        <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border-2 border-dashed border-amber-200 rounded-2xl text-center">
                                            <p className="text-xs text-amber-700 font-bold mb-3">هیچ آدرسی در سیستم یافت نشد.</p>
                                            <button 
                                                onClick={() => setIsAddingNewAddress(true)}
                                                className="py-2 px-4 bg-amber-600 text-white rounded-xl font-black text-[10px]"
                                            >
                                                ثبت اولین آدرس
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!isAddingNewAddress && (
                                <button 
                                    onClick={handleConfirmAddress}
                                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all mt-4"
                                >
                                    تایید آدرس و ادامه
                                </button>
                            )}
                        </div>
                    )}

                    {step === 'payment' && (
                        <div className="space-y-6 animate-fade-in text-center">
                            {isInternal ? (
                                <>
                                    <div className="flex justify-center mb-4"><ShieldCheckIcon /></div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">خرید مستقیم از گیفتی‌نو</h3>
                                    <p className="text-sm text-slate-500 font-bold leading-relaxed px-4">این کالا توسط فروشگاه <span className="text-indigo-600">«{item.purchasedFrom}»</span> تامین می‌شود. با پرداخت وجه، سفارش شما مستقیماً ثبت خواهد شد.</p>
                                    
                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 text-right">
                                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-3"><span>مبلغ نهایی:</span> <span className="text-emerald-600 text-base">{item.price?.toLocaleString('fa-IR')} ت</span></div>
                                        <div className="flex justify-between text-xs font-bold text-slate-400"><span>مقصد ارسال:</span> <span className="text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{selectedAddress}</span></div>
                                    </div>

                                    <button 
                                        onClick={handleFinalAction}
                                        disabled={isLoading}
                                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/30 flex justify-center items-center gap-2 active:scale-95 transition-all"
                                    >
                                        {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'اتصال به درگاه و نهایی کردن خرید'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-center mb-4 text-rose-500"><ExternalLinkIcon /></div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">خرید از سایت مرجع</h3>
                                    <p className="text-sm text-slate-500 font-bold leading-relaxed px-4">این کالا در سایت‌های خارجی (مانند دیجی‌کالا) موجود است. با کلیک، آدرس کپی شده و شما به سایت مقصد هدایت می‌شوید تا خرید را تکمیل کنید.</p>
                                    
                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-rose-500"><MapPinIcon /></div>
                                        <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase">آدرس مقصد (کپی می‌شود):</p><p className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{selectedAddress}</p></div>
                                    </div>

                                    <button 
                                        onClick={handleFinalAction}
                                        className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-rose-500/30 flex justify-center items-center gap-2 active:scale-95 transition-all"
                                    >
                                        رزرو و مشاهده لینک خرید
                                    </button>
                                </>
                            )}
                            <button onClick={() => setStep('address')} className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">بازگشت و اصلاح آدرس</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        {showGateway && (
            <PaymentModal 
                isOpen={showGateway} 
                onClose={() => setShowGateway(false)} 
                itemName={item.name}
                paymentAmount={item.price || 0}
                onConfirmPayment={handlePaymentComplete}
            />
        )}
        </>
    );
};

export default ClaimGiftFlowModal;
