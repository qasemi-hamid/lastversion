
import React from 'react';
import { Order, User } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  merchant: User;
  buyer?: User;
  recipient?: User;
}

const PrintIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order, merchant, buyer, recipient }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[80] flex justify-center items-center p-4 print:p-0 print:bg-white print:absolute print:inset-0 print:z-[100]">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none print:w-full print:h-full" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 print:hidden bg-slate-50 dark:bg-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white">جزئیات سفارش و فاکتور</h3>
            <div className="flex gap-2">
                <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    <PrintIcon /> چاپ فاکتور
                </button>
                <button onClick={onClose} className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                    <CloseIcon />
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900" id="invoice-content" dir="rtl">
            
            <div className="border-b-2 border-slate-800 pb-6 mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black mb-2 candy-text">Giftino</h1>
                    <p className="text-sm font-bold opacity-70">صورتحساب فروش کالا و خدمات</p>
                </div>
                <div className="text-left text-sm">
                    <p><span className="font-bold">شماره سفارش:</span> <span className="font-mono text-base">{order.id.slice(-8).toUpperCase()}</span></p>
                    <p><span className="font-bold">تاریخ:</span> <span className="dir-ltr">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</span></p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="border rounded-2xl p-5 bg-slate-50 dark:bg-slate-800/50 print:bg-transparent print:border-slate-300">
                    <h4 className="font-black text-[10px] text-slate-400 mb-2 uppercase tracking-widest">فروشنده</h4>
                    <p className="font-black text-lg mb-1">{merchant.shopName || merchant.name}</p>
                    <p className="text-xs opacity-80 whitespace-pre-line leading-relaxed">{merchant.address || 'آدرس ثبت نشده'}</p>
                    <p className="text-sm font-black mt-3 font-mono dir-ltr text-right">{merchant.contactNumber || merchant.mobile}</p>
                </div>

                <div className="border rounded-2xl p-5 bg-slate-50 dark:bg-slate-800/50 print:bg-transparent print:border-slate-300">
                    <h4 className="font-black text-[10px] text-slate-400 mb-2 uppercase tracking-widest">خریدار / تحویل گیرنده</h4>
                    <p className="font-black text-lg mb-1">{recipient?.name || buyer?.name || 'کاربر مهمان'}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-1 leading-relaxed">
                        <span className="font-bold">سفارش دهنده:</span> {buyer?.name || 'ناشناس'}
                    </p>
                    <p className="text-xs opacity-80 whitespace-pre-line leading-relaxed">
                        <span className="font-bold">آدرس تحویل:</span> {order.deliveryAddress}
                    </p>
                </div>
            </div>

            <div className="mb-8 overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="bg-slate-800 text-white text-xs">
                            <th className="py-4 px-3 font-black">#</th>
                            <th className="py-4 px-3 font-black">شرح کالا / خدمات</th>
                            <th className="py-4 px-3 text-center font-black">تعداد</th>
                            <th className="py-4 px-3 text-left font-black">مبلغ واحد (تومان)</th>
                            <th className="py-4 px-3 text-left font-black">مبلغ کل (تومان)</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-bold">
                        {order.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-200 dark:border-slate-700">
                                <td className="py-4 px-3 text-slate-400">{idx + 1}</td>
                                <td className="py-4 px-3">{item.name}</td>
                                <td className="py-4 px-3 text-center font-mono">{item.quantity}</td>
                                <td className="py-4 px-3 text-left font-mono">{item.price.toLocaleString('fa-IR')}</td>
                                <td className="py-4 px-3 text-left font-mono">{(item.price * item.quantity).toLocaleString('fa-IR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end mb-12">
                <div className="w-full max-w-xs space-y-3 bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">جمع کل:</span>
                        <span className="font-mono">{order.totalAmount.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between text-base font-black">
                        <span>مبلغ قابل پرداخت:</span>
                        <span className="font-mono text-emerald-600">{order.totalAmount.toLocaleString('fa-IR')} تومان</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-auto pt-8 border-t border-dashed border-slate-300 print:block print:mt-12">
                <div className="text-center">
                    <p className="font-black text-xs text-slate-400 mb-12">مهر و امضای فروشنده</p>
                    <div className="h-20 flex items-center justify-center border border-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-200 italic">Signature / Stamp Space</span>
                    </div>
                </div>
                <div className="text-center print:hidden">
                    <p className="font-black text-xs text-slate-400 mb-12">امضای تحویل گیرنده</p>
                    <div className="h-20 border border-slate-50 rounded-xl"></div>
                </div>
            </div>
            
            <p className="text-center text-[9px] font-bold text-slate-400 mt-10">
                این فاکتور توسط سیستم یکپارچه گیفتی‌نو (Giftino) صادر شده و فاقد ارزش معاملاتی مستقیم بدون تایید پلتفرم است.
            </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
