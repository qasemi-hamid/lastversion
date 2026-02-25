
import React, { useState, useEffect } from 'react';
import { Wallet, Transaction, VirtualCard, User } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: Wallet | null;
  activeVirtualCards: VirtualCard[]; 
  onShowCardDetails: (card: VirtualCard) => void;
  onCreateNewCard: () => void;
  currentUser?: User | null;
  onWithdraw: (amount: number, shaba: string) => Promise<void>;
}

const formatPrice = (price?: number) => {
  if (typeof price !== 'number') return '';
  return price.toLocaleString('fa-IR');
}

const formatTimeAgo = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `همین الان`;
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    if (hours < 24) return `${hours} ساعت پیش`;
    return `${days} روز پیش`;
};

const formatFullDateTime = (isoDate: string): string => {
    try {
        const date = new Date(isoDate);
        return date.toLocaleString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return '';
    }
}

const getTransactionIcon = (tx: Transaction) => {
    const commonClasses = "h-5 w-5";
    switch (tx.type) {
        case 'payout':
        case 'withdrawal':
             return <svg xmlns="http://www.w3.org/2000/svg" className={`${commonClasses} text-blue-600 dark:text-blue-400`} viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>;
        case 'refund':
            return <svg xmlns="http://www.w3.org/2000/svg" className={`${commonClasses} text-orange-600 dark:text-orange-400`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>;
        case 'contribution':
        case 'cash_gift':
            if (tx.amount > 0) { 
                return <svg xmlns="http://www.w3.org/2000/svg" className={`${commonClasses} text-green-600 dark:text-green-400`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>;
            } else { 
                return <svg xmlns="http://www.w3.org/2000/svg" className={`${commonClasses} text-red-600 dark:text-red-400`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H3a2 2 0 01-2-2v-5a2 2 0 012-2zm10 0V7a3 3 0 10-6 0v2h6z" clipRule="evenodd" /></svg>;
            }
        default:
             return <svg xmlns="http://www.w3.org/2000/svg" className={`${commonClasses} text-slate-500`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
    }
};

const getTransactionTypeText = (tx: Transaction) => {
    switch (tx.type) {
        case 'payout': return { text: 'واریز مستقیم به حساب', color: 'text-blue-600 dark:text-blue-400' };
        case 'withdrawal': return { text: 'انتقال وجه خارج شده', color: 'text-red-600 dark:text-red-400' };
        case 'refund': return { text: 'برگشت هدیه', color: 'text-orange-600 dark:text-orange-400' };
        case 'contribution':
            if (tx.amount > 0) return { text: 'هدیه دریافتی (تسهیم شده)', color: 'text-green-600 dark:text-green-400' };
            return { text: 'هدیه پرداخت شده', color: 'text-slate-600 dark:text-slate-400' };
        default: return { text: 'رویداد مالی', color: 'text-slate-500' };
    }
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, wallet }) => {
  const [totalSettled, setTotalSettled] = useState(0);

  useEffect(() => {
      if (wallet) {
          const total = wallet.transactions
            .filter(t => t.type === 'contribution' && t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);
          setTotalSettled(total);
      }
  }, [wallet]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 w-full max-w-xl m-4 max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 flex-shrink-0 px-2">
            <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">شفافیت مالی و تراکنش‌ها</h2>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Financial Transparency Log</p>
            </div>
            <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-black whitespace-nowrap border border-indigo-200/50">
                تسویه آنی فعال
            </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-violet-800 p-6 rounded-[2rem] mb-6 text-white shadow-xl relative overflow-hidden flex-shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
            <div className="relative z-10 text-center">
                <span className="text-white/70 text-[10px] font-black block mb-2 uppercase tracking-wider">مجموع هدایای مستقیم واریز شده</span>
                <p className="text-4xl font-black tracking-tighter">{formatPrice(totalSettled)} <span className="text-sm font-normal text-white/60">تومان</span></p>
                <div className="mt-4 py-2 px-4 bg-black/20 rounded-xl text-[10px] font-bold text-indigo-100 leading-relaxed inline-block">
                    تمامی مبالغ بدون توقف در اپلیکیشن، مستقیم به شبای شما واریز شده‌اند.
                </div>
            </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
            <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 mb-4 px-4 flex-shrink-0 uppercase tracking-widest border-r-4 border-indigo-500 pr-2">تاریخچه تراکنش‌های مستقیم</h3>
            <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                {wallet && wallet.transactions.length > 0 ? (
                    <ul className="space-y-3 pb-4">
                        {wallet.transactions.map(tx => {
                            const typeInfo = getTransactionTypeText(tx);
                            const isCredit = tx.amount >= 0;
                            return (
                                <li key={tx.id} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-300 transition-all">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">{getTransactionIcon(tx)}</div>
                                            <span className={`text-xs font-black ${typeInfo.color}`}>{typeInfo.text}</span>
                                        </div>
                                        <span className={`text-sm font-black dir-ltr ${isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {isCredit ? '+' : ''}{formatPrice(tx.amount)}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 mt-3">
                                        <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                            {tx.description}
                                        </div>
                                        <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <span>{formatFullDateTime(tx.date)}</span>
                                            <span className="opacity-60">{formatTimeAgo(tx.date)}</span>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                        <p className="text-sm font-bold opacity-50">هنوز تراکنشی ثبت نشده است.</p>
                    </div>
                )}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
                <button type="button" onClick={onClose} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-lg active:scale-95">
                    بستن گزارش
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
