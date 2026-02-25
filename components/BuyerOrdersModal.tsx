
import React, { useState, useEffect } from 'react';
import { User, Order } from '../types';
import { updateOrderStatus } from '../services/api'; 

interface BuyerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  orders: Order[];
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;

const BuyerOrdersModal: React.FC<BuyerOrdersModalProps> = ({ isOpen, onClose, currentUser, orders }) => {
    const [activeTab, setActiveTab] = useState<'purchased' | 'received'>('purchased');
    const [currentOrders, setCurrentOrders] = useState<Order[]>([]);

    useEffect(() => {
        if(isOpen) {
            const filtered = orders.filter(o => 
                activeTab === 'purchased' ? o.buyerId === currentUser.id : o.receiverId === currentUser.id
            );
            setCurrentOrders(filtered.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
    }, [isOpen, orders, activeTab, currentUser.id]);

    const handleConfirmDelivery = async (orderId: string) => {
        await updateOrderStatus(orderId, 'delivered');
        alert('تحویل کالا با موفقیت تایید شد. مبلغ برای فروشنده آزاد گردید.');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-[70] flex justify-center items-center p-4" onClick={onClose} dir="rtl">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-xl flex flex-col max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <TruckIcon /> پیگیری و تاریخچه هدایا
                    </h2>
                    <button onClick={onClose} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-full"><CloseIcon /></button>
                </div>

                <div className="flex p-2 bg-slate-50 dark:bg-slate-800/50">
                    <button onClick={() => setActiveTab('purchased')} className={`flex-1 py-3 text-xs font-black rounded-2xl transition-all ${activeTab === 'purchased' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>خریدهای من</button>
                    <button onClick={() => setActiveTab('received')} className={`flex-1 py-3 text-xs font-black rounded-2xl transition-all ${activeTab === 'received' ? 'bg-white shadow text-rose-600' : 'text-slate-500'}`}>هدایای دریافتی</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {currentOrders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-black text-sm text-slate-900 dark:text-white">{order.items[0]?.name}</h4>
                                    <p className="text-[10px] text-slate-400 mt-1">سفارش: #{order.id.slice(-6)}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                                    order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                    {order.status === 'pending' ? 'در حال آماده‌سازی' : 
                                     order.status === 'shipped' ? 'ارسال شده' : 'تحویل شد'}
                                </span>
                            </div>

                            {order.status === 'shipped' && (
                                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-black text-blue-700 dark:text-blue-300">جزئیات ارسال:</span>
                                        <span className="text-[10px] bg-white dark:bg-slate-700 px-2 py-0.5 rounded-lg font-bold">{order.deliveryMethod === 'courier' ? 'پیک موتوری' : 'مرسوله پستی'}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">رهگیری: <span className="font-mono font-bold text-blue-600">{order.trackingCode}</span></p>
                                    
                                    {order.receiverId === currentUser.id && (
                                        <button 
                                            onClick={() => handleConfirmDelivery(order.id)}
                                            className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckIcon /> تایید دریافت هدیه
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {currentOrders.length === 0 && (
                        <div className="py-20 text-center text-slate-400 font-bold">موردی یافت نشد.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyerOrdersModal;
