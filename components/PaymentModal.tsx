
import React, { useState, useEffect } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName?: string;
  paymentAmount?: number;
  recipientId?: string;
  onConfirmPayment: (payerName?: string) => void;
  feeRate?: number;
}

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
);

const ButtonSpinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const BankIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const formatPrice = (price?: number) => {
    if (typeof price !== 'number') return '';
    return price.toLocaleString('fa-IR') + ' تومان';
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, itemName, paymentAmount, recipientId, onConfirmPayment, feeRate = 0 }) => {
  const [step, setStep] = useState<'review' | 'redirecting' | 'gateway' | 'processing' | 'success'>('review');
  const [payerName, setPayerName] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
      if (isOpen) {
          setStep('review');
          setPayerName('');
          setIsChecking(false);
      }
  }, [isOpen]);

  const handleConnectToGateway = () => {
      setIsChecking(true);
      setTimeout(() => {
          setStep('redirecting');
          setTimeout(() => {
              setStep('gateway');
              setIsChecking(false);
          }, 1000);
      }, 500);
  };

  const handleGatewayPayment = () => {
      setStep('processing');
      setTimeout(() => {
          try {
              onConfirmPayment(payerName.trim() || undefined);
          } catch (e) {
              console.error("Payment callback error:", e);
          }
          setStep('success');
          setTimeout(() => {
              onClose();
          }, 3000);
      }, 1500);
  };

  const handleGatewayCancel = () => {
      setStep('review');
  };

  if (!isOpen) return null;

  const fee = paymentAmount ? Math.round(paymentAmount * (feeRate / 100)) : 0;
  const totalPayable = (paymentAmount || 0) + fee;

  // Render Full Screen Gateway (Simulated)
  if (step === 'gateway' || (step === 'processing' && !isOpen)) { 
      return (
          <div className="fixed inset-0 bg-gray-100 z-[100] flex flex-col items-center justify-center p-4 animate-fade-in">
              <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border-t-8 border-yellow-400">
                  <div className="flex justify-center mb-6">
                      <div className="bg-yellow-50 p-4 rounded-full">
                          <BankIcon />
                      </div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-xl mb-2 text-center">درگاه پرداخت الکترونیک</h3>
                  <p className="text-xs text-gray-400 mb-8 text-center">شبیه‌ساز پرداخت شاپرک (محیط آزمایشی)</p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 space-y-3">
                      <div className="flex justify-between text-sm">
                          <span className="text-gray-500">پذیرنده:</span>
                          <span className="font-bold text-gray-800">گیفتی‌نو (واسط)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-gray-500">مبلغ کل تراکنش:</span>
                          <span className="font-bold text-emerald-600 text-lg">{formatPrice(totalPayable)}</span>
                      </div>
                  </div>

                  <div className="space-y-3">
                      {step === 'processing' ? (
                          <div className="w-full py-4 bg-gray-100 rounded-lg flex items-center justify-center gap-2 text-gray-500 font-bold">
                              <ButtonSpinner /> در حال انتقال...
                          </div>
                      ) : (
                          <>
                              <button 
                                  type="button" 
                                  onClick={handleGatewayPayment} 
                                  className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-green-500/20 active:scale-95"
                              >
                                  پرداخت موفق (تایید)
                              </button>
                              <button 
                                  type="button" 
                                  onClick={handleGatewayCancel} 
                                  className="w-full py-3.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold transition-colors"
                              >
                                  انصراف
                              </button>
                          </>
                      )}
                  </div>
                  
                  <div className="mt-8 text-center">
                      <p className="text-[10px] text-gray-400">
                          این یک صفحه شبیه‌سازی شده است و تراکنش واقعی بانکی انجام نمی‌شود.
                      </p>
                  </div>
              </div>
          </div>
      );
  }

  // Normal Modal Flow
  return (
    <div className="fixed inset-0 bg-black/80 z-[90] flex justify-center items-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md m-4 overflow-hidden relative transition-all" onClick={(e) => e.stopPropagation()}>
        
        {step === 'review' && (
            <div className="animate-fade-in text-center">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">تایید نهایی پرداخت</h2>
                
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 mb-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">بابت:</p>
                    <p className="text-lg font-bold text-violet-600 dark:text-violet-400 mb-4">{itemName}</p>
                    
                    <div className="flex justify-between items-center text-sm border-t border-slate-200 dark:border-slate-700 pt-3">
                        <span className="text-slate-600 dark:text-slate-300">مبلغ خالص هدیه:</span>
                        <span className="font-bold text-slate-800 dark:text-white">{formatPrice(paymentAmount)}</span>
                    </div>
                    {fee > 0 && (
                        <div className="flex justify-between items-center text-sm mt-2 text-rose-500">
                            <span>+ کارمزد خدمات (بر عهده پرداخت‌کننده):</span>
                            <span>{formatPrice(fee)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center text-lg font-black mt-4 pt-2 border-t-2 border-dashed border-slate-200 dark:border-slate-700">
                        <span className="text-slate-800 dark:text-white">مبلغ قابل پرداخت شما:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{formatPrice(totalPayable)}</span>
                    </div>
                </div>

                <div className="mb-6 text-right">
                    <label className="block text-xs font-bold text-slate-500 mb-2 mr-1">نام شما (اختیاری)</label>
                    <input 
                        type="text" 
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        placeholder="مثلاً: علی (دوست قدیمی)"
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-violet-500 transition-all"
                    />
                </div>

                <button 
                    type="button"
                    onClick={handleConnectToGateway}
                    disabled={isChecking}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isChecking ? (
                        <ButtonSpinner />
                    ) : (
                        `اتصال به درگاه (${formatPrice(totalPayable)})`
                    )}
                </button>
                <button type="button" onClick={onClose} disabled={isChecking} className="mt-4 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-50">
                    انصراف
                </button>
            </div>
        )}

        {(step === 'redirecting' || step === 'processing') && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in">
                <LoadingSpinner />
                <p className="mt-4 font-bold text-slate-700 dark:text-white">
                    {step === 'redirecting' ? 'در حال انتقال به درگاه...' : 'در حال ثبت تراکنش...'}
                </p>
                <p className="text-xs text-slate-500 mt-1">لطفاً شکیبا باشید</p>
            </div>
        )}

        {step === 'success' && (
            <div className="py-10 text-center animate-bounce-in">
                <div className="flex justify-center">
                    <ShieldCheckIcon />
                </div>
                <h2 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mb-2">پرداخت موفق!</h2>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 mb-4 mx-2">
                    <p className="text-emerald-800 dark:text-emerald-200 text-sm font-bold mb-1">
                        هدیه شما ثبت شد
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        مبلغ {formatPrice(paymentAmount)} به صورت خالص برای گیرنده ارسال شد.
                    </p>
                </div>
                <div className="w-16 h-1 bg-emerald-200 rounded-full mx-auto animate-pulse"></div>
            </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;
