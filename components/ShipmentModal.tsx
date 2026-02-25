
import React, { useState } from 'react';
import { Order } from '../types';

interface ShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onShip: (deliveryData: { method: string, trackingCode: string, courierName?: string }) => Promise<void>;
}

const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>;

const ShipmentModal: React.FC<ShipmentModalProps> = ({ isOpen, onClose, order, onShip }) => {
  const [method, setMethod] = useState<'courier' | 'post' | 'tipax'>('courier');
  const [trackingCode, setTrackingCode] = useState('');
  const [courierName, setCourierName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        await onShip({ method, trackingCode, courierName });
        onClose();
    } catch (e) {
        alert('خطا در ثبت اطلاعات ارسال');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center p-4 backdrop-blur-sm" dir="rtl">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 text-center">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <TruckIcon /> مدیریت ارسال سفارش
            </h2>
        </div>

        <div className="p-8 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] font-black text-slate-400 mb-1 uppercase">آدرس مقصد:</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed">{order.deliveryAddress}</p>
            </div>

            {/* Quick Actions for Couriers */}
            <div className="grid grid-cols-2 gap-3">
                <a href="snapp://" className="flex flex-col items-center justify-center p-4 bg-[#24d156]/10 border border-[#24d156]/30 rounded-2xl group transition-all hover:bg-[#24d156]/20">
                    <span className="text-2xl mb-1">🛵</span>
                    <span className="text-[10px] font-black text-[#1ba143]">درخواست اسنپ</span>
                </a>
                <a href="tapsi://" className="flex flex-col items-center justify-center p-4 bg-[#ff6b00]/10 border border-[#ff6b00]/30 rounded-2xl group transition-all hover:bg-[#ff6b00]/20">
                    <span className="text-2xl mb-1">🚖</span>
                    <span className="text-[10px] font-black text-[#cc5500]">درخواست تپسی</span>
                </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 mr-1">روش ارسال</label>
                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        {[
                            {id:'courier', l:'پیک'},
                            {id:'post', l:'پست'},
                            {id:'tipax', l:'تیپاکس'}
                        ].map(m => (
                            <button key={m.id} type="button" onClick={() => setMethod(m.id as any)} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${method === m.id ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}>{m.l}</button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1 mr-1">
                        {method === 'courier' ? 'شماره تماس پیک / نام شرکت' : 'کد رهگیری مرسوله'}
                    </label>
                    <input 
                        type="text" 
                        required
                        value={trackingCode}
                        onChange={e => setTrackingCode(e.target.value)}
                        className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm"
                        placeholder={method === 'courier' ? "مثلاً: اسنپ - 0912..." : "24 رقم کد پستی"}
                    />
                </div>

                <div className="pt-4 flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-xs">انصراف</button>
                    <button type="submit" disabled={isLoading} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-lg flex items-center justify-center gap-2">
                        {isLoading ? "..." : "تایید و ارسال"}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ShipmentModal;
