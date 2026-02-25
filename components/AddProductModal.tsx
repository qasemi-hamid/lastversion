
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { processFileForUpload } from '../services/imageService';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: { name: string; price: number; description: string; imageUrl: string; category: string; stock: number }) => Promise<void>;
  initialProduct?: Product | null;
}

const PhotoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd, initialProduct }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('electronics');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialProduct) {
        setName(initialProduct.name);
        setPrice(initialProduct.price.toString());
        setStock(initialProduct.stock.toString());
        setDescription(initialProduct.description);
        setCategory(initialProduct.category || 'electronics');
        setImageUrl(initialProduct.imageUrl || '');
      } else {
        setName('');
        setPrice('');
        setStock('10');
        setDescription('');
        setCategory('electronics');
        setImageUrl('');
      }
      setErrorMsg(null);
    }
  }, [isOpen, initialProduct]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
        setIsProcessingImage(true);
        try {
            const compressed = await processFileForUpload(e.target.files[0]);
            setImageUrl(compressed);
        } catch (err) {
            setErrorMsg('خطا در پردازش تصویر.');
        } finally {
            setIsProcessingImage(false);
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name || !price) return;
    
    setIsSubmitting(true);
    try {
        await onAdd({
            name,
            price: Number(price),
            description,
            imageUrl,
            category,
            stock: Number(stock)
        });
        onClose();
    } catch (error: any) {
        setErrorMsg(error.message || 'خطا در ثبت عملیات.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 text-center">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {initialProduct ? 'ویرایش محصول' : 'افزودن محصول به ویترین'}
            </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="flex flex-col items-center mb-4">
                <div 
                    onClick={() => !isProcessingImage && fileInputRef.current?.click()}
                    className="w-32 h-32 rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden hover:border-indigo-500 transition-all group relative"
                >
                    {isProcessingImage ? (
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="text-[8px] font-black text-slate-500">بهینه‌سازی...</span>
                        </div>
                    ) : imageUrl ? (
                        <img src={imageUrl} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                        <div className="text-slate-400 group-hover:text-indigo-500 flex flex-col items-center">
                            <PhotoIcon />
                            <span className="text-[10px] font-bold mt-1">انتخاب تصویر</span>
                        </div>
                    )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <p className="text-[9px] text-slate-400 mt-2">تصاویر به صورت هوشمند فشرده می‌شوند.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-full">
                    <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase mr-1">نام محصول</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm" placeholder="مثلاً: هندزفری بلوتوثی" required />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase mr-1">قیمت (تومان)</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm" placeholder="۱۵۰۰۰۰۰" required />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase mr-1">موجودی (تعداد)</label>
                    <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm" placeholder="۱۰" required />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase mr-1">دسته بندی</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm outline-none">
                        <option value="electronics">دیجیتال</option>
                        <option value="fashion">مد و پوشاک</option>
                        <option value="home">خانه و آشپزخانه</option>
                        <option value="beauty">آرایشی و بهداشتی</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase mr-1">توضیحات کوتاه</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm resize-none" placeholder="ویژگی‌های محصول..."></textarea>
            </div>

            {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-100 dark:border-red-800 text-center animate-shake">
                    {errorMsg}
                </div>
            )}

            <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all">انصراف</button>
                <button type="submit" disabled={isSubmitting || isProcessingImage} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-indigo-500/20 flex justify-center items-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                    {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (initialProduct ? 'ذخیره تغییرات' : 'ثبت محصول در ویترین')}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
