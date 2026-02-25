import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);
const GuruIcon = () => (
    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center flex-shrink-0 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    </div>
);
const UserIcon = () => (
    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);

const TypingIndicator = () => (
    <div className="flex items-center space-x-1 space-x-reverse py-2 px-4">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
    </div>
);

interface GiftGuruModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
}

const GiftGuruModal: React.FC<GiftGuruModalProps> = ({ isOpen, onClose, history, isTyping, onSendMessage }) => {
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isTyping]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isTyping) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-t-lg shadow-xl w-full max-w-2xl mx-auto flex-1 flex flex-col my-4" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <GuruIcon />
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">دستیار هوشمند هدیه</h2>
                            <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${isTyping ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
                                <span className="text-xs text-slate-500 dark:text-slate-400">{isTyping ? 'در حال نوشتن...' : 'آنلاین'}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                        <CloseIcon />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    {history.map(msg => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <GuruIcon />}
                            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-violet-500 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.role === 'user' && <UserIcon />}
                        </div>
                    ))}
                    {isTyping && (
                         <div className="flex items-start gap-3 justify-start">
                            <GuruIcon />
                            <div className="max-w-md p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
                                <TypingIndicator />
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </main>

                <footer className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSend} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="پیام خود را تایپ کنید..."
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-full shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={isTyping || !input.trim()}
                            className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-violet-500 text-white rounded-full font-semibold hover:bg-violet-600 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-500 disabled:cursor-not-allowed"
                            aria-label="ارسال پیام"
                        >
                            <SendIcon />
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default GiftGuruModal;