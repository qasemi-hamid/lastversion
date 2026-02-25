
import React, { useState } from 'react';

interface CharityCreationData {
    name: string;
    email: string;
    password: string;
    shaba: string;
    accountHolderName: string;
    contactNumber: string;
    responsiblePersonName: string;
    responsiblePersonNationalId: string;
    address: string;
}

interface AdminCharityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCharity: (data: CharityCreationData) => Promise<{ success: boolean; message?: string }>;
}

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const VerifiedBadge = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 inline-block mr-1" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
    </svg>
);

const AdminCharityModal: React.FC<AdminCharityModalProps> = ({ isOpen, onClose, onCreateCharity }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shaba, setShaba] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [responsiblePersonName, setResponsiblePersonName] = useState('');
  const [responsiblePersonNationalId, setResponsiblePersonNationalId] = useState('');
  const [address, setAddress] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleShabaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (val.length > 26) val = val.slice(0, 26);
      
      // Auto-prepend IR logic
      if (val.length > 0 && !val.startsWith('IR')) {
           if (/[0-9]/.test(val[0])) {
               val = 'IR' + val;
           }
      }
      
      setShaba(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    if (!name.trim() || !email.trim() || !password.trim() || !shaba.trim() || !accountHolderName.trim() || !contactNumber.trim() || !responsiblePersonName.trim() || !responsiblePersonNationalId.trim()) {
      setError('لطفاً تمام فیلدهای اجباری را پر کنید.');
      setIsLoading(false);
      return;
    }
    
    if (shaba.length !== 26) {
        setError('شماره شبا باید دقیقاً ۲۶ کاراکتر باشد.');
        setIsLoading(false);
        return;
    }

    const result = await onCreateCharity({ 
        name, 
        email, 
        password, 
        shaba, 
        accountHolderName, 
        contactNumber, 
        responsiblePersonName, 
        responsiblePersonNationalId,
        address 
    });
    
    setIsLoading(false);
    if (result.success) {
        setSuccessMsg('موسسه خیریه با موفقیت ایجاد و اطلاعات حقوقی آن ثبت شد.');
        setTimeout(() => {
            setSuccessMsg(null);
            onClose();
        }, 2500);
    } else {
        setError(result.message || 'خطا در ایجاد حساب.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">تعریف موسسه خیریه جدید</h2>
        
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-sm text-slate-600 dark:text-slate-300">
            <p className="flex items-center gap-1 font-semibold text-blue-800 dark:text-blue-200 mb-1">
                <VerifiedBadge />
                ثبت اطلاعات حقوقی و مالی
            </p>
            <p>لطفاً اطلاعات زیر را بر اساس مدارک رسمی موسسه وارد کنید. شماره شبا و اطلاعات مسئول پس از ثبت، توسط کاربر خیریه قابل تغییر نخواهد بود.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Account Info */}
          <div>
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">۱. اطلاعات دسترسی</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">نام موسسه <span className="text-red-500">*</span></label>
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ایمیل (نام کاربری) <span className="text-red-500">*</span></label>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    required
                    dir="ltr"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">رمز عبور <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>
              </div>
          </div>

          {/* Section 2: Financial Info */}
          <div>
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">۲. اطلاعات بانکی (غیرقابل تغییر توسط کاربر)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">شماره شبا <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input
                        type="text"
                        value={shaba}
                        onChange={handleShabaChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-mono text-left tracking-wider ${shaba.length === 26 ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-slate-300 dark:border-slate-600'}`}
                        placeholder="IR00 0000 0000 0000 0000 0000 00"
                        required
                        dir="ltr"
                        maxLength={26}
                        />
                        <div className={`absolute right-3 top-2.5 text-xs font-mono font-bold ${shaba.length === 26 ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                            {shaba.length} / 26
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">نام صاحب حساب <span className="text-red-500">*</span></label>
                    <input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    required
                    />
                </div>
              </div>
          </div>

          {/* Section 3: Legal & Responsible Info */}
          <div>
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">۳. اطلاعات مسئول و تماس</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">نام و نام خانوادگی مسئول <span className="text-red-500">*</span></label>
                    <input
                    type="text"
                    value={responsiblePersonName}
                    onChange={(e) => setResponsiblePersonName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">کد ملی مسئول <span className="text-red-500">*</span></label>
                    <input
                    type="text"
                    value={responsiblePersonNationalId}
                    onChange={(e) => setResponsiblePersonNationalId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">شماره تماس (همراه/ثابت) <span className="text-red-500">*</span></label>
                    <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    required
                    />
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">آدرس دفتر مرکزی</label>
                    <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    rows={2}
                    />
                </div>
              </div>
          </div>
          
          {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</p>}
          {successMsg && <p className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">{successMsg}</p>}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md font-semibold hover:bg-slate-200 dark:bg-slate-600 dark:text-slate-200">انصراف</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-teal-600 text-white rounded-md font-semibold hover:bg-teal-700 transition-colors disabled:bg-teal-800">
                {isLoading ? 'در حال ثبت...' : 'تایید و ایجاد حساب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCharityModal;
