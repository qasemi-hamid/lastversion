
import React, { useState } from 'react';

interface AddMicroItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: { name: string; price: number; icon: string; color: string; isUrgent: boolean }) => void;
}

const icons = ['🍦', '✏️', '🍕', '⚽', '📒', '🥪', '🍫', '🧃', '🎀', '🚗', '🥚', '🧦', '💊', '🍼', '🍎', '🧥'];
const colors = [
    'bg-pink-100 text-pink-600', 
    'bg-blue-100 text-blue-600', 
    'bg-orange-100 text-orange-600', 
    'bg-green-100 text-green-600',
    'bg-yellow-100 text-yellow-600',
    'bg-red-100 text-red-600',
    'bg-purple-100 text-purple-600',
    'bg-cyan-100 text-cyan-600'
];

const AddMicroItemModal: React.FC<AddMicroItemModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [isUrgent, setIsUrgent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && price) {
        onAdd({
            name,
            price: Number(price),
            icon: selectedIcon,
            color: selectedColor,
            isUrgent
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[80] flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">افزودن آیتم سهم لبخند</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">نام آیتم</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl" required placeholder="مثلاً: شیرخشک" />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">قیمت (تومان)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl" required />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">آیکون</label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {icons.map(icon => (
                        <button type="button" key={icon} onClick={() => setSelectedIcon(icon)} className={`text-xl p-2 rounded-lg ${selectedIcon === icon ? 'bg-slate-200 dark:bg-slate-700' : ''}`}>{icon}</button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">رنگ زمینه</label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {colors.map(color => (
                        <button type="button" key={color} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full border-2 ${color} ${selectedColor === color ? 'border-slate-500' : 'border-transparent'}`}></button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50">
                <input type="checkbox" id="urgent" checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                <label htmlFor="urgent" className="text-sm font-bold text-red-600 dark:text-red-400">این آیتم فوری و ضروری است</label>
            </div>

            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold">انصراف</button>
                <button type="submit" className="flex-[2] py-3 bg-violet-600 text-white rounded-xl font-bold">ثبت آیتم</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddMicroItemModal;
