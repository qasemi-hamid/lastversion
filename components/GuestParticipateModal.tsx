
import React, { useState, useMemo } from 'react';
import { WishlistItem, User } from '../types';
import PaymentModal from './PaymentModal';

interface GuestParticipateModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WishlistItem;
  ownerName: string;
  onSuccess: (amount: number, name: string) => void;
}

const BankIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const GuestParticipateModal: React.FC<GuestParticipateModalProps> = ({ isOpen, onClose, item, ownerName, onSuccess }) => {
    const [amount, setAmount] = useState<number>(0);
    const [payerName, setPayerName] = useState('');
    const [showPayment, setShowPayment] = useState(false);

    if (!isOpen) return null;

    const handleProceed = () => {
        if (amount < 1000) {
            alert('حداقل مبلغ مشارکت ۱۰۰۰ تومان است.');
            return;
        }
        setShowPayment(true);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/95 z-[150] flex justify-center items-center p-4 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
                
                <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800">
                    <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">🎁</div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">مشارکت سریع در آرزوی «{ownerName}»</h2>
                    <p className="text-xs text-slate-500 font-bold mt-2">برای این هدیه: <span className="text-rose-600">{item.name}</span></p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-3">
                        <BankIcon />
                        <div className="text-right">
                            <p className="text-[10px] font-black text-blue-800 dark:text-blue-300 uppercase">واریز مستقیم به حساب بانکی (شبا)</p>
                            <p className="text-[9px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">بدون واسطه و بدون نیاز به ثبت‌نام در سیستم</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase mr-1">مبلغ مشارکت (تومان)</label>
                        <input 
                            type="number" 
                            value={amount || ''} 
                            onChange={e => setAmount(Number(e.target.value))}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-black text-2xl text-center text-emerald-600 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                            placeholder="۰"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase mr-1">نام شما (اختیاری)</label>
                        <input 
                            type="text" 
                            value={payerName} 
                            onChange={e => setPayerName(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm text-center"
                            placeholder="مثلاً: علی (دوست قدیمی)"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-xs">انصراف</button>
                        <button 
                            onClick={handleProceed}
                            className="flex-[2] py-4 bg-rose-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-rose-500/20 active:scale-95 transition-all"
                        >
                            تایید و اتصال به درگاه
                        </button>
                    </div>
                </div>
            </div>

            {showPayment && (
                <PaymentModal 
                    isOpen={showPayment} 
                    onClose={() => setShowPayment(false)} 
                    itemName={item.name}
                    paymentAmount={amount}
                    onConfirmPayment={() => {
                        onSuccess(amount, payerName);
                        setShowPayment(false);
                    }}
                />
            )}
        </div>
    );
};

export default GuestParticipateModal;
