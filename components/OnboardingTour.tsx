
import React, { useState } from 'react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

const Step1Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-violet-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const Step2Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-fuchsia-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
    </svg>
);

const Step3Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-teal-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
);

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose, onStart }) => {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      title: '۱. لیست بساز',
      description: 'اولین قدم اینه که یک لیست جدید بسازی. می‌تونی از الگوهای آماده استفاده کنی یا یه لیست خالی درست کنی.',
      icon: <Step1Icon />,
      color: 'bg-violet-500'
    },
    {
      id: 2,
      title: '۲. آیتم اضافه کن',
      description: 'لینک هر چیزی رو که دوست داری از فروشگاه‌های آنلاین کپی کن و توی لیستت بذار. ما اطلاعاتش رو برات میاریم!',
      icon: <Step2Icon />,
      color: 'bg-fuchsia-500'
    },
    {
      id: 3,
      title: '۳. لینک رو بفرست',
      description: 'لینک لیستت رو برای دوستانت بفرست. اونا می‌تونن هدایا رو رزرو کنن یا توی خریدش مشارکت کنن.',
      icon: <Step3Icon />,
      color: 'bg-teal-500'
    }
  ];

  const currentStep = steps[step - 1];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onStart();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-bounce-in">
        
        {/* Image/Icon Area */}
        <div className="bg-slate-50 dark:bg-slate-900/50 h-48 flex flex-col items-center justify-center border-b border-slate-100 dark:border-slate-700">
            {currentStep.icon}
            {/* Progress Dots */}
            <div className="flex gap-2 mt-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? `w-6 ${currentStep.color}` : 'w-2 bg-slate-300 dark:bg-slate-600'}`}></div>
                ))}
            </div>
        </div>

        {/* Text Content */}
        <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">{currentStep.title}</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm h-20">
                {currentStep.description}
            </p>
        </div>

        {/* Footer / Actions */}
        <div className="p-6 pt-0 flex gap-3">
            <button 
                onClick={onClose}
                className="flex-1 py-3 px-4 text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
                رد کردن
            </button>
            <button 
                onClick={handleNext}
                className={`flex-[2] py-3 px-4 text-white font-bold rounded-xl shadow-lg shadow-slate-300/50 dark:shadow-none transition-all transform active:scale-95 ${currentStep.color}`}
            >
                {step === 3 ? 'بزن بریم! 🚀' : 'بعدی'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
