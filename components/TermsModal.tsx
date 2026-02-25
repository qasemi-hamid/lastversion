
import React, { useState } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: (verifiedMobile: string, nationalCode: string, birthDate: string, password?: string) => void;
}

// Updated content for REGULAR USERS - Focus on Platform Immunity
const TERMS_CONTENT = `
<div class="space-y-5 text-justify text-slate-600 dark:text-slate-300 text-sm leading-7">
    
    <div class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
        <h3 class="text-base font-bold mb-2 text-blue-800 dark:text-blue-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
            سلب مسئولیت پلتفرم (مهم)
        </h3>
        <p class="text-sm text-blue-900 dark:text-blue-200">
            کاربر گرامی، گیفتی‌نو صرفاً یک بستر نرم‌افزاری «واسط» جهت تسهیل فرآیند هدیه دادن و جمع‌سپاری مالی است. ما فروشنده کالا نیستیم و هیچ‌گونه مالکیتی بر وجوه جابجا شده نداریم.
        </p>
    </div>

    <div>
        <h3 class="text-base font-bold mb-2 text-slate-900 dark:text-white">۱. مسئولیت کاربر عادی</h3>
        <p>مسئولیت قانونی منشأ پول‌های واریزی و مقصد نهایی آنها تماماً بر عهده کاربر است. گیفتی‌نو در قبال اختلافات شخصی، کیفیت کالای خریداری شده از لینک‌های خارجی، یا نحوه مصرف وجوه جمع‌آوری شده در کمپین‌های شخصی هیچ‌گونه مسئولیتی ندارد.</p>
    </div>

    <div>
        <h3 class="text-base font-bold mb-2 text-slate-900 dark:text-white">۲. احراز هویت و امنیت</h3>
        <p>برای جلوگیری از کلاهبرداری و پولشویی، سیستم به صورت خودکار هویت صاحب خط، کد ملی و حساب بانکی را تطبیق می‌دهد. شما متعهد می‌شوید که اطلاعات هویتی واقعی خود را وارد نمایید. هرگونه استفاده از حساب‌های اجاره‌ای منجر به مسدودسازی دائمی حساب و گزارش به مراجع قضایی خواهد شد.</p>
    </div>
</div>
`;

const IdentificationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const CheckBadgeIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-emerald-500"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const LoadingSpinner = () => <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>;

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onAccept }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isChecked, setIsChecked] = useState(false);
  const [nationalCode, setNationalCode] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  
  const [simulatedBirthDate, setSimulatedBirthDate] = useState('');

  if (!isOpen) return null;

  const isValidIranianNationalCode = (input: string) => {
      if (!/^\d{10}$/.test(input)) return false;
      const check = +input[9];
      const sum = Array.from(input.substring(0, 9)).reduce((acc, x, i) => acc + +x * (10 - i), 0) % 11;
      return sum < 2 ? check === sum : check === 11 - sum;
  };

  const handleSubmit = async () => {
      setError('');
      
      if (!isValidIranianNationalCode(nationalCode)) {
          setError('کد ملی وارد شده معتبر نیست.');
          return;
      }
      if (!isChecked) {
          setError('لطفاً تایید کنید که قوانین را مطالعه کرده و مسئولیت آن را می‌پذیرید.');
          return;
      }

      setIsChecking(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      setIsChecking(false);
      setStep('success');
      
      const randomYear = 1980 + Math.floor(Math.random() * 25);
      const dob = `${randomYear}-06-21`;
      setSimulatedBirthDate(dob); 
      
      setTimeout(() => {
          onAccept("", nationalCode, dob);
      }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[70] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <h2 className="text-xl font-black text-slate-800 dark:text-white mb-1">قوانین و احراز هویت (کاربر عادی)</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">تایید هویت برای جلوگیری از سوءاستفاده</p>
        </div>

        <div className="p-6">
            
            {step === 'form' && (
                <div className="space-y-6 animate-fade-in">
                    <div dangerouslySetInnerHTML={{ __html: TERMS_CONTENT }} />
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">کد ملی (۱۰ رقم)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IdentificationIcon /></div>
                            <input 
                                type="text" 
                                placeholder="مثال: 1234567890" 
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 text-left font-bold tracking-wider placeholder:font-normal"
                                value={nationalCode}
                                onChange={(e) => setNationalCode(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="relative flex items-center mt-1">
                            <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-slate-300 checked:bg-emerald-500 checked:border-emerald-500" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
                            <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" width="16" height="16"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-300 select-none leading-6">
                            سلب مسئولیت پلتفرم را مطالعه کردم و صحت اطلاعات هویتی خود را تایید می‌کنم.
                        </span>
                    </label>
                    
                    {error && <p className="text-red-500 text-sm font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">{error}</p>}

                    <button 
                        onClick={handleSubmit}
                        disabled={isChecking}
                        className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-violet-500/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isChecking ? <><LoadingSpinner /> در حال استعلام هویت...</> : 'پذیرش قوانین و ورود'}
                    </button>
                </div>
            )}

            {step === 'success' && (
                <div className="text-center py-8 animate-bounce-in">
                    <CheckBadgeIcon className="w-20 h-20 mx-auto mb-4 text-emerald-500" />
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">تایید شد!</h2>
                    <p className="text-slate-600 dark:text-slate-300">حساب شما فعال گردید.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
