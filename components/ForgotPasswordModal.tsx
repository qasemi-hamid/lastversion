
import React, { useState } from 'react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFindPassword: (email: string) => Promise<string | null>;
}

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onFindPassword }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSuccess(false);
    setIsLoading(true);
    if (!email.trim()) {
        setMessage('لطفاً ایمیل خود را وارد کنید.');
        setIsLoading(false);
        return;
    }
    
    const foundPassword = await onFindPassword(email);
    setIsLoading(false);

    if (foundPassword) {
        setMessage(`رمز عبور شما: ${foundPassword}`);
        setIsSuccess(true);
    } else {
        setMessage('کاربری با این ایمیل یافت نشد یا رمز عبوری برای آن ثبت نشده است.');
        setIsSuccess(false);
    }
  };
  
  const handleClose = () => {
      setEmail('');
      setMessage(null);
      setIsLoading(false);
      setIsSuccess(false);
      onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={handleClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">بازیابی رمز عبور</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          ایمیل خود را وارد کنید تا رمز عبور شما را بازیابی کنیم. (توجه: در برنامه واقعی، یک لینک بازیابی به ایمیل شما ارسال می‌شود.)
        </p>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="email-forgot" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    آدرس ایمیل
                </label>
                <div className="mt-1">
                    <input
                        id="email-forgot"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                </div>
            </div>
            {message && (
                <p className={`text-sm p-3 rounded-md break-words ${isSuccess ? 'bg-teal-50 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                    {message}
                </p>
            )}
            <div className="flex justify-end gap-3 mt-8">
                <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md font-semibold hover:bg-slate-200 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 transition-colors"
                >
                    بستن
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 w-36 flex justify-center bg-rose-600 text-white rounded-md font-semibold hover:bg-rose-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 dark:focus:ring-offset-slate-800 disabled:bg-slate-400"
                >
                    {isLoading ? <LoadingSpinner /> : 'بازیابی'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
