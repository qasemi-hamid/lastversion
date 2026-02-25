
import React, { useState, useEffect, useRef } from 'react';
import * as api from '../services/api';
import DatabaseSetupModal from './DatabaseSetupModal';
import MerchantTermsModal from './MerchantTermsModal';
import { CommunityFeed } from './CommunityFeed';

interface LoginProps {
  onLogin: (credentials: { usernameOrEmail: string; password: string; isMerchant: boolean; isOtp?: boolean; directUser?: any }) => Promise<void>;
  onRegister: (newUser: any) => Promise<{ success: boolean; message?: string; user?: any }>;
  onSocialLogin: (provider: 'google' | 'facebook' | 'apple') => void;
  onCancel: () => void;
  onForgotPasswordClick: () => void;
}

const PhoneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>);
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>;

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, onForgotPasswordClick }) => {
  const [step, setStep] = useState<'identifier' | 'password' | 'otp' | 'merchant_reg'>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  
  const [shopName, setShopName] = useState('');
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isDbOpen, setIsDbOpen] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let t: any;
    if (resendTimer > 0) t = setInterval(() => setResendTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const handleIdentifierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const isMobile = /^09\d{9}$/.test(identifier.trim());
      if (isMobile) {
        setStep('otp');
        setResendTimer(60);
      } else {
        setStep('password');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleFinalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await onLogin({ 
        usernameOrEmail: identifier, 
        password: step === 'otp' ? '12345' : password, 
        isMerchant: false 
      });
    } catch (err: any) {
      setError(err.message || 'ورود ناموفق بود. لطفاً اطلاعات را بررسی کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
      setError(null);
      setIsLoading(true);
      try {
          await onLogin({ usernameOrEmail: 'user@gmail.com', password: 'user', isMerchant: false });
      } catch (err: any) {
          setError(err.message || 'ورود تستی ناموفق بود.');
      } finally {
          setIsLoading(false);
      }
  };

  const performMerchantRegister = async () => {
      setIsTermsOpen(false);
      setIsLoading(true);
      try {
          const result = await onRegister({ name: shopName, email: identifier, password: password, role: 'merchant', shopName, status: 'active' });
          if (result.success && result.user) {
              await onLogin({ usernameOrEmail: identifier, password: password, isMerchant: true, directUser: result.user });
          } else {
              setError(result.message || 'خطا در ثبت نام.');
          }
      } catch (e) { setError('خطا در ارتباط با سرور.'); } finally { setIsLoading(false); }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 min-h-screen">
        <div className="text-center mb-4 animate-fade-in flex flex-col items-center">
            <h1 className="text-5xl font-black candy-text tracking-tighter mb-1">Giftino</h1>
            <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] opacity-80">همراه هوشمند آرزوهای شما</p>
        </div>

        <div className="bg-white dark:bg-slate-900 w-full max-w-[360px] rounded-[2rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] border border-slate-100/50 dark:border-slate-800 p-6 sm:p-8 relative overflow-hidden transition-all duration-500 z-10">
            
            {step === 'identifier' && (
                <form onSubmit={handleIdentifierSubmit} className="space-y-4 animate-fade-in">
                    <div className="text-center space-y-1">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">ورود یا ثبت‌نام</h2>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">ایمیل یا شماره موبایل خود را وارد کنید.</p>
                    </div>

                    <div className="relative group pt-1">
                        <input 
                            type="text" required autoFocus value={identifier} 
                            onChange={(e) => { setIdentifier(e.target.value); setError(null); }} 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500/20 rounded-xl outline-none text-slate-900 dark:text-white dir-ltr font-black focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300 text-sm" 
                            placeholder="0912xxxxxxx" 
                        />
                        <div className="absolute inset-y-0 left-3 flex items-center text-slate-300 group-focus-within:text-blue-500 transition-colors"><PhoneIcon /></div>
                    </div>

                    {error && <p className="text-[10px] text-rose-600 font-black text-center bg-rose-50 dark:bg-rose-900/20 py-1.5 rounded-lg border border-rose-100 dark:border-rose-800/30">{error}</p>}
                    
                    <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-500/25 active:scale-[0.97] transition-all flex items-center justify-center gap-2">
                        {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'تایید و ادامه'}
                    </button>

                    <div className="pt-1 space-y-2">
                        <button type="button" onClick={handleDemoLogin} className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[10px] hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                            <span>🚀</span> ورود سریع
                        </button>
                        <button type="button" onClick={() => setStep('merchant_reg')} className="w-full text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 group">
                            <StoreIcon />
                            پنل فروشندگان
                        </button>
                    </div>
                </form>
            )}

            {step === 'password' && (
                <form onSubmit={handleFinalLogin} className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <div className="text-right">
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">رمز عبور</h2>
                            <p className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-lg inline-block dir-ltr mt-0.5">{identifier}</p>
                        </div>
                        <button type="button" onClick={() => setStep('identifier')} className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-600 transition-all">
                            <BackIcon />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div className="relative group">
                            <input 
                                ref={passwordRef} type={showPassword ? "text" : "password"} required autoFocus value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500/20 rounded-xl text-slate-900 dark:text-white font-black outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm" 
                                placeholder="••••••••" 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-blue-500 transition-colors">
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        <button type="button" onClick={onForgotPasswordClick} className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 hover:underline mr-1">فراموشی رمز عبور؟</button>
                    </div>

                    {error && <p className="text-[10px] text-rose-600 font-black text-center bg-rose-50 dark:bg-rose-900/20 py-1.5 rounded-lg border border-rose-100">{error}</p>}

                    <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-sm shadow-xl active:scale-[0.97] transition-all flex items-center justify-center">
                        {isLoading ? <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div> : 'ورود به حساب'}
                    </button>
                </form>
            )}

            {step === 'otp' && (
                <form onSubmit={handleFinalLogin} className="space-y-6 animate-fade-in text-center">
                    <div className="space-y-1">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">تایید هویت</h2>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold px-4">کد ارسال شده به <span className="dir-ltr inline-block font-mono text-blue-600">{identifier}</span> را وارد کنید.</p>
                    </div>

                    <div className="space-y-4">
                        <input 
                            ref={otpRef} type="text" required maxLength={5} autoFocus 
                            className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-white font-black text-center text-3xl tracking-[0.4em] outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-100" 
                            placeholder="•••••" 
                        />
                        <div className="flex flex-col items-center gap-2">
                            {resendTimer > 0 ? (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                    <span className="text-[9px] font-black text-slate-500">{resendTimer} ثانیه</span>
                                </div>
                            ) : (
                                <button type="button" onClick={() => setResendTimer(60)} className="text-[10px] font-black text-indigo-600 hover:underline">دریافت مجدد</button>
                            )}
                        </div>
                    </div>

                    {error && <p className="text-[10px] text-rose-600 font-black text-center bg-rose-50 dark:bg-rose-900/20 py-1.5 rounded-lg">{error}</p>}

                    <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-black text-sm shadow-xl active:scale-[0.97] transition-all">
                        تایید و ورود
                    </button>
                </form>
            )}

            {step === 'merchant_reg' && (
                <form onSubmit={(e) => { e.preventDefault(); setIsTermsOpen(true); }} className="space-y-3 animate-fade-in">
                    <div className="text-center">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">ثبت‌نام فروشگاه</h2>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold px-4">به تامین‌کنندگان گیفتی‌نو بپیوندید.</p>
                    </div>

                    <div className="space-y-3 pt-1">
                        <input type="text" required value={shopName} onChange={e => setShopName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-white font-bold text-xs" placeholder="نام فروشگاه" />
                        <input type="email" required value={identifier} onChange={e => setIdentifier(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-white font-bold text-xs dir-ltr" placeholder="ایمیل سازمانی" />
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-white font-bold text-xs" placeholder="رمز عبور" />
                    </div>

                    <button type="submit" className="w-full py-3.5 mt-2 bg-indigo-600 text-white rounded-xl font-black text-sm shadow-xl active:scale-[0.97] transition-all">ایجاد پنل</button>
                    <button type="button" onClick={() => setStep('identifier')} className="w-full text-[9px] font-black text-slate-400 hover:text-slate-600">بازگشت</button>
                </form>
            )}
        </div>
        
        <div className="w-full max-w-xs mt-6 px-4">
            <CommunityFeed isLogin={true} />
        </div>

        <div className="mt-4 flex justify-center opacity-20 hover:opacity-100 transition-opacity">
            <button onClick={() => setIsDbOpen(true)} className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] py-1 px-3 rounded-full border border-slate-200 dark:border-slate-800">DB Config</button>
        </div>

        <DatabaseSetupModal isOpen={isDbOpen} onClose={() => setIsDbOpen(false)} />
        <MerchantTermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} mobileNumber={identifier} onSignAndRegister={performMerchantRegister} />
    </div>
  );
};

export default Login;
