
import React, { useState, useEffect } from 'react';
import { checkConnection } from '../services/supabaseClient';

interface DatabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DatabaseSetupModal: React.FC<DatabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [connStatus, setConnStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [connMsg, setConnMsg] = useState('');
  const [showSql, setShowSql] = useState(false);

  useEffect(() => {
      if (isOpen) {
          const saved = localStorage.getItem('GIFTINO_SUPABASE_CONFIG');
          if (saved) {
              try {
                  const p = JSON.parse(saved);
                  setUrl(p.url || '');
                  setKey(p.key || '');
              } catch (e) {}
          }
      }
  }, [isOpen]);

  const sqlCode = `-- ۱. اصلاح جدول کاربران و محصولات (در صورت وجود از قبل)
ALTER TABLE users ADD COLUMN IF NOT EXISTS important_dates JSONB DEFAULT '[]';
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS shaba TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_holder_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS shahkar_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS contact_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS shop_name TEXT;

-- ۲. ایجاد/اصلاح جدول محصولات
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE products ADD COLUMN IF NOT EXISTS merchant_id UUID REFERENCES users(id);

-- ۳. ایجاد جدول لیست‌های آرزو
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  privacy TEXT DEFAULT 'friends',
  type TEXT DEFAULT 'personal',
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ۴. ایجاد جدول آیتم‌ها (اصلاح شده)
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  link TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'open',
  is_group_gift BOOLEAN DEFAULT false,
  allow_offers BOOLEAN DEFAULT false,
  claimed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  purchased_from TEXT,
  is_test BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- اطمینان از وجود ستون‌های حیاتی در صورت وجود جدول از قبل
ALTER TABLE items ADD COLUMN IF NOT EXISTS purchased_from TEXT;
ALTER TABLE items ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT false;
ALTER TABLE items ADD COLUMN IF NOT EXISTS product_id UUID;

-- ۵. ایجاد جدول سفارشات
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  merchant_id UUID REFERENCES users(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  items JSONB DEFAULT '[]',
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  delivery_address TEXT,
  delivery_method TEXT,
  tracking_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ۶. ایجاد جدول دوستی‌ها
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, receiver_id)
);`;

  if (!isOpen) return null;
  
  const handleTestAndSave = async () => {
      setConnStatus('checking');
      setConnMsg('');
      try {
          const res = await checkConnection(url, key);
          if (res.success) {
              setConnStatus('success');
              setConnMsg('اتصال برقرار شد! تنظیمات ذخیره گردید.');
              localStorage.setItem('GIFTINO_SUPABASE_CONFIG', JSON.stringify({ url, key }));
              setTimeout(() => onClose(), 1500);
          } else {
              throw new Error(res.message);
          }
      } catch (e: any) {
          setConnStatus('error');
          setConnMsg(e.message || 'خطا در اتصال به دیتابیس.');
      }
  };

  const copySql = () => {
      navigator.clipboard.writeText(sqlCode);
      alert('کد SQL کپی شد. لطفاً آن را در کنسول Supabase اجرا کنید.');
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl flex flex-col shadow-2xl overflow-hidden p-8 border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">تنظیمات دیتابیس</h2>
        
        {!showSql ? (
            <div className="space-y-5">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-[10px] rounded-xl border border-amber-100">
                    توجه: اگر آرزوها ثبت نمی‌شوند، کدهای SQL زیر را کپی کرده و در پنل Supabase خود اجرا کنید تا ستون‌های مورد نیاز ساخته شوند.
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Supabase URL</label>
                    <input type="text" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-mono text-xs dir-ltr outline-none" value={url} onChange={e => setUrl(e.target.value)} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Anon Key</label>
                    <input type="password" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-mono text-xs dir-ltr outline-none" value={key} onChange={e => setKey(e.target.value)} />
                </div>
                
                <div className="pt-4 space-y-3">
                    <button onClick={handleTestAndSave} disabled={connStatus === 'checking'} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                        {connStatus === 'checking' ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'تست و ذخیره'}
                    </button>
                    <button onClick={() => setShowSql(true)} className="w-full py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl border border-rose-100 border-dashed">
                        🔨 مشاهده کدهای SQL اصلاحی (حل مشکل ثبت)
                    </button>
                    <button onClick={onClose} className="w-full py-2 text-slate-400 text-xs">بستن</button>
                </div>
            </div>
        ) : (
            <div className="space-y-4 animate-fade-in">
                <p className="text-xs text-slate-500 leading-relaxed font-bold">
                    کد زیر را کپی کرده و در بخش <span className="text-indigo-600">SQL Editor</span> در پنل Supabase خود اجرا کنید:
                </p>
                <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-[10px] font-mono overflow-y-auto max-h-60 dir-ltr text-left border border-slate-700">
                    {sqlCode}
                </pre>
                <button onClick={copySql} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs">کپی کد SQL</button>
                <button onClick={() => setShowSql(false)} className="w-full py-2 text-slate-400 text-xs">بازگشت</button>
            </div>
        )}

        {connMsg && <div className={`mt-4 p-4 rounded-2xl text-xs font-bold text-center border animate-fade-in ${connStatus === 'success' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'}`}>{connMsg}</div>}
      </div>
    </div>
  );
};

export default DatabaseSetupModal;
