import React, { useState, useEffect, useRef } from 'react';
import { DirectMessage, User, GroupChat, GroupMessage } from '../types';

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
const UserIcon = (props: { big?: boolean }) => (
    <div className={`rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-300 ${props.big ? 'h-10 w-10' : 'h-8 w-8'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className={props.big ? 'h-6 w-6' : 'h-5 w-5'} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);
const GroupIcon = (props: { big?: boolean }) => (
    <div className={`rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-300 ${props.big ? 'h-10 w-10' : 'h-8 w-8'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className={props.big ? 'h-6 w-6' : 'h-5 w-5'} viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
    </div>
);


type UnifiedMessage = (DirectMessage | GroupMessage) & { senderId: string };
interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    chatTarget: User | GroupChat | null;
    messages: UnifiedMessage[];
    currentUser: User;
    allUsers: User[];
    onSendMessage: (text: string) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, chatTarget, messages, currentUser, allUsers, onSendMessage }) => {
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    if (!isOpen || !chatTarget) return null;

    const isGroupChat = 'members' in chatTarget;
    const chatName = chatTarget.name;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-t-lg shadow-xl w-full max-w-lg mx-auto flex-1 flex flex-col my-4" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        {isGroupChat ? <GroupIcon big /> : <UserIcon big />}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{chatName}</h2>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span className="text-xs text-slate-500 dark:text-slate-400">آنلاین</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                        <CloseIcon />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map(msg => {
                        const isFromCurrentUser = msg.senderId === currentUser.id;
                        const sender = isGroupChat && !isFromCurrentUser ? allUsers.find(u => u.id === msg.senderId) : null;
                        return (
                            <div key={msg.id} className={`flex items-start gap-3 ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                {!isFromCurrentUser && (isGroupChat ? <UserIcon /> : <UserIcon />)}
                                <div className={`max-w-md p-3 rounded-lg ${isFromCurrentUser ? 'bg-violet-500 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'}`}>
                                    {sender && <p className="text-xs font-semibold mb-1 text-violet-300">{sender.name}</p>}
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    <p className={`text-xs mt-1 opacity-70 text-right ${isFromCurrentUser ? 'text-violet-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
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
                            disabled={!input.trim()}
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

export default ChatModal;