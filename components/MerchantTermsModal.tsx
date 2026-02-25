
import React, { useState } from 'react';

interface MerchantTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignAndRegister: () => void;
  mobileNumber: string;
}

const ShieldExclamationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
    </svg>
);

const PenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const MERCHANT_TERMS = `
<div class="space-y-4 text-justify text-sm leading-7 text-slate-700 dark:text-slate-300">
    <p class="font-bold text-red-600 dark:text-red-400">توجه: این قرارداد حاوی تعهدات حقوقی و مالی سنگین است. لطفاً با دقت مطالعه کنید.</p>

    <div>
        <strong>۱. تعهد تحویل و صحت کالا:</strong>
        <p>فروشنده متعهد می‌شود کالای فروخته شده را دقیقاً مطابق با مشخصات، تصویر و توضیحات درج شده در پلتفرم، در زمان مقرر تحویل خریدار دهد. هرگونه مغایرت، خرابی یا نقص فنی در کالا تماماً بر عهده فروشنده است.</p>
    </div>

    <div>
        <strong>۲. گارانتی و خدمات پس از فروش:</strong>
        <p>فروشنده موظف است تمامی کالاهای مشمول گارانتی را با کارت گارانتی معتبر ارسال کند. در صورت معیوب بودن کالا، فروشنده موظف به تعویض بی قید و شرط یا عودت وجه است.</p>
    </div>

    <div>
        <strong>۳. هزینه‌های مرجوعی (خسارت):</strong>
        <p>در صورتی که خریدار به دلیل "نقص فنی"، "مغایرت ظاهری" یا "عدم اصالت" کالا را مرجوع کند، تمامی هزینه‌های ارسال و بازگشت کالا بر عهده فروشنده است.</p>
    </div>
    
    <div>
        <strong>۴. تسویه حساب و امانت:</strong>
        <p>مبلغ پرداختی مشتری تا زمان "تایید تحویل و سلامت کالا" توسط مشتری (حداکثر ۷ روز پس از دریافت)، نزد پلتفرم به امانت می‌ماند.</p>
    </div>
</div>
`;

const MerchantTermsModal: React.FC<MerchantTermsModalProps> = ({ isOpen, onClose, onSignAndRegister, mobileNumber }) => {
    const [step, setStep] = useState<'read' | 'sign'>('read');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isSending, setIsSending] = useState(false);

    // MASTER SIGNATURE CODE
    const MASTER_SIGN_CODE = "772025";

    if (!isOpen) return null;

    const handleSendCode = async () => {
        setIsSending(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSending(false);
        setStep('sign');
        console.log(`Master Sign Code for ${mobileNumber}: ${MASTER_SIGN_CODE}`);
    };

    const handleVerify = () => {
        if (otp === MASTER_SIGN_CODE) {
            onSignAndRegister();
        } else {
            setError('کد امضای وارد شده نامعتبر است.');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/95 z-[80] flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
                    <ShieldExclamationIcon />
                    <div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white">قرارداد همکاری فروشندگان</h2>
                        <p className="text-xs text-red-500 font-bold">امضای دیجیتال بر اساس شماره {mobileNumber}</p>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900">
                    <div dangerouslySetInnerHTML={{ __html: MERCHANT_TERMS }} />
                </div>

                <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    {step === 'read' ? (
                        <div>
                             <p className="text-xs text-slate-500 mb-4 text-center">
                                جهت ثبت نهایی فروشگاه و تایید حقوقی قرارداد، نیاز به امضای دیجیتال است.
                             </p>
                             <div className="flex gap-3">
                                 <button onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold">انصراف</button>
                                 <button onClick={handleSendCode} disabled={isSending} className="flex-[2] py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg">
                                     {isSending ? 'در حال آماده‌سازی...' : 'شروع فرآیند امضا'}
                                 </button>
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">کد ۶ رقمی امضا را وارد کنید</label>
                                <input 
                                    type="text" 
                                    value={otp}
                                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-center text-2xl font-black tracking-[0.3em] focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="------"
                                    maxLength={6}
                                    autoFocus
                                />
                                {error && <p className="text-xs text-red-500 mt-2 font-bold text-center">{error}</p>}
                            </div>
                            <button onClick={handleVerify} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all">
                                <PenIcon />
                                تایید و امضای سیستمی قرارداد
                            </button>
                            <button onClick={() => setStep('read')} className="w-full text-xs text-slate-400 hover:text-slate-600">مطالعه مجدد قرارداد</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MerchantTermsModal;
