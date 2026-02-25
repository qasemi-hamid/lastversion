
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { processFileForUpload } from '../services/imageService';
import { addGiveaway } from '../services/api';

interface AddGiveawayModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSuccess: () => void;
}

const PhotoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const AddGiveawayModal: React.FC<AddGiveawayModalProps> = ({ isOpen, onClose, currentUser, onSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsProcessingImage(true);
            try {
                const compressed = await processFileForUpload(e.target.files[0]);
                setImageUrl(compressed);
            } finally {
                setIsProcessingImage(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setIsSubmitting(true);
        try {
            await addGiveaway(currentUser.id, currentUser.name, {
                name,
                description,
                imageUrl,
                category: 'community'
            });
            onSuccess();
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center p-4 backdrop-blur-md" dir="rtl">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 text-center">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">اهدا به دیوار مهربانی</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="flex flex-col items-center">
                        <div 
                            onClick={() => !isProcessingImage && fileInputRef.current?.click()}
                            className="w-32 h-32 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden group relative"
                        >
                            {isProcessingImage ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            ) : imageUrl ? (
                                <img src={imageUrl} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-slate-400 group-hover:text-indigo-600 flex flex-col items-center">
                                    <PhotoIcon />
                                    <span className="text-[10px] font-black mt-1">تصویر کالا</span>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase mr-1">نام کالا</label>
                            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm" placeholder="مثلاً: دوچرخه قدیمی" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase mr-1">توضیحات (وضعیت کالا)</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm resize-none" placeholder="سالم است، فقط نیاز به تعمیر جزیی دارد..." />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-xs">انصراف</button>
                        <button type="submit" disabled={isSubmitting || !name} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all">
                            {isSubmitting ? '...' : 'تایید و انتشار رایگان'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGiveawayModal;
