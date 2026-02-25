
import React, { useState, useMemo, useEffect } from 'react';
import { User, Transaction, Wallet, SystemExpense, ExpenseCategory } from '../types';
import { getExpenses, addExpense, deleteExpense } from '../services/api';

interface AccountantDashboardProps {
  users: User[];
  transactions: Transaction[];
  wallets: Wallet[];
  onLogout: () => void;
}

// Icons
const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const ReceiptIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;

const AccountantDashboard: React.FC<AccountantDashboardProps> = ({ users, transactions, wallets, onLogout }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'reports'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [expenses, setExpenses] = useState<SystemExpense[]>([]);
    const [confirmingExpenseId, setConfirmingExpenseId] = useState<string | null>(null);
    
    const [expAmount, setExpAmount] = useState('');
    const [expCategory, setExpCategory] = useState<ExpenseCategory>('other');
    const [expDesc, setExpDesc] = useState('');
    const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        getExpenses().then(setExpenses).catch(err => console.error("Error loading expenses", err));
    }, []);

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (expAmount && expDesc) {
                const updated = await addExpense({
                    amount: Number(expAmount),
                    category: expCategory,
                    description: expDesc,
                    date: new Date(expDate).toISOString()
                }, 'current-accountant-id');
                setExpenses(updated);
                setExpAmount('');
                setExpDesc('');
                setExpCategory('other');
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : "خطا در ثبت هزینه");
        }
    };

    const handleDeleteExpense = async (id: string) => {
        try {
            const updated = await deleteExpense(id);
            setExpenses(updated);
            setConfirmingExpenseId(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : "خطا در حذف هزینه");
        }
    };

    const totalUserBalance = wallets.reduce((sum, w) => sum + w.balance, 0); 
    const { totalDeposits, totalWithdrawals, grossRevenue, bankFeesEstimate } = useMemo(() => {
        let deposits = 0; let withdrawals = 0; let revenue = 0; let bankFees = 0;
        transactions.forEach(t => {
            if (t.type === 'contribution') {
                deposits += t.amount;
                const recipient = users.find(u => u.id === t.userId);
                if (recipient?.role !== 'charity') revenue += t.amount * 0.025;
                bankFees += 2000;
            } else if (t.type === 'withdrawal' || t.type === 'payout') {
                withdrawals += Math.abs(t.amount);
                bankFees += 500;
            }
        });
        return { totalDeposits: deposits, totalWithdrawals: withdrawals, grossRevenue: revenue, bankFeesEstimate: bankFees };
    }, [transactions, users]);

    const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesSearch = (t.trackingCode || '').toLowerCase().includes(searchTerm.toLowerCase()) || (t.description || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || t.type === filterType;
            return matchesSearch && matchesType;
        });
    }, [transactions, searchTerm, filterType]);

    const formatMoney = (amount: number | undefined) => (amount || 0).toLocaleString('fa-IR');
    const categoryLabels: Record<ExpenseCategory, string> = {
        'server_infrastructure': 'زیرساخت و سرور', 'sms_panel': 'پنل پیامک', 'salary': 'حقوق و دستمزد', 'rent': 'اجاره دفتر', 'marketing': 'تبلیغات و مارکتینگ', 'tax': 'مالیات و عوارض', 'bank_fees': 'کارمزد بانکی', 'other': 'متفرقه'
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col">
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <CalculatorIcon />
                    <h1 className="text-xl font-bold">حسابداری گیفتی‌نو</h1>
                </div>
                <button onClick={onLogout} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"><LogoutIcon /></button>
            </header>

            <main className="container mx-auto px-6 py-8 flex-grow">
                <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1 w-fit mb-6">
                    <button onClick={() => setActiveTab('overview')} className={`px-6 py-2 rounded-md ${activeTab === 'overview' ? 'bg-white shadow text-emerald-600 font-bold' : ''}`}>تراکنش‌ها</button>
                    <button onClick={() => setActiveTab('expenses')} className={`px-6 py-2 rounded-md ${activeTab === 'expenses' ? 'bg-white shadow text-emerald-600 font-bold' : ''}`}>هزینه‌ها</button>
                </div>

                {activeTab === 'overview' && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border p-4 shadow-sm">
                        <table className="w-full text-right text-sm">
                            <thead><tr className="border-b"><th className="p-3">تاریخ</th><th className="p-3">رهگیری</th><th className="p-3">نوع</th><th className="p-3 text-left">مبلغ</th></tr></thead>
                            <tbody>
                                {filteredTransactions.map(tx => (
                                    <tr key={tx.id} className="border-b hover:bg-slate-50"><td className="p-3">{new Date(tx.date).toLocaleDateString('fa-IR')}</td><td className="p-3 font-mono">{tx.trackingCode}</td><td className="p-3">{tx.type}</td><td className={`p-3 text-left font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatMoney(tx.amount)}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'expenses' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border h-fit shadow-lg">
                            <h3 className="font-bold mb-4">ثبت هزینه جدید</h3>
                            <form onSubmit={handleAddExpense} className="space-y-4">
                                <input type="text" className="w-full p-2 border rounded-lg" placeholder="شرح" value={expDesc} onChange={e => setExpDesc(e.target.value)} required />
                                <input type="number" className="w-full p-2 border rounded-lg" placeholder="مبلغ" value={expAmount} onChange={e => setExpAmount(e.target.value)} required />
                                <button type="submit" className="w-full py-2 bg-emerald-600 text-white rounded-lg font-bold">ثبت</button>
                            </form>
                        </div>
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border shadow-lg overflow-hidden">
                            <table className="w-full text-right text-sm">
                                <thead className="bg-slate-50 border-b"><tr><th className="p-3">شرح</th><th className="p-3">مبلغ</th><th className="p-3">عملیات</th></tr></thead>
                                <tbody>
                                    {expenses.map(exp => (
                                        <tr key={exp.id} className="border-b">
                                            <td className="p-3">{exp.description}</td>
                                            <td className="p-3 text-red-500 font-bold">{formatMoney(exp.amount)}</td>
                                            <td className="p-3">
                                                {confirmingExpenseId === exp.id ? (
                                                    <div className="flex gap-1">
                                                        <button onClick={() => setConfirmingExpenseId(null)} className="text-xs px-2 py-1 bg-slate-100 rounded">لغو</button>
                                                        <button onClick={() => handleDeleteExpense(exp.id)} className="text-xs px-2 py-1 bg-red-600 text-white rounded">حذف</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setConfirmingExpenseId(exp.id)} className="text-red-400 p-1"><TrashIcon /></button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AccountantDashboard;
