import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import {
    Plus,
    Search,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Calendar as CalendarIcon
} from 'lucide-react';
import { transactionApi } from '../api/transactions';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import AddTransactionModal from '../components/AddTransactionModal';
import { cn } from '../utils/cn';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, [typeFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [transData, catsData, accsData] = await Promise.all([
                transactionApi.getTransactions(),
                transactionApi.getCategories(),
                transactionApi.getAccounts()
            ]);
            setTransactions(transData);
            setCategories(catsData);
            setAccounts(accsData);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await transactionApi.deleteTransaction(id);
                setTransactions(transactions.filter(t => t.id !== id));
            } catch (err) {
                alert('Failed to delete transaction');
            }
        }
    };

    const filteredTransactions = (transactions || []).filter(t => {
        const matchesSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || t.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <MainLayout title="Transactions">
            <div className="flex flex-col space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-slate-900 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full sm:w-64 transition-all"
                            />
                        </div>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm appearance-none cursor-pointer"
                        >
                            <option value="all">All Types</option>
                            <option value="expense">Expenses</option>
                            <option value="income">Income</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:border-slate-700 transition-all font-medium">
                            <Download size={18} />
                            <span className="hidden md:inline">Export</span>
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-all font-bold shadow-lg shadow-cyan-500/20"
                        >
                            <Plus size={20} />
                            <span>Add Transaction</span>
                        </button>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-800/30 border-b border-slate-800">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Account</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50 text-sm">
                                <AnimatePresence mode='popLayout'>
                                    {loading ? (
                                        <tr key="loading">
                                            <td colSpan="6" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center space-y-3">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                                        className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"
                                                    />
                                                    <span className="text-slate-500 font-medium tracking-wide">Loading transactions...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredTransactions.length === 0 ? (
                                        <tr key="empty">
                                            <td colSpan="6" className="px-6 py-20 text-center text-slate-500 hover:text-slate-400 transition-colors cursor-default font-medium italic">
                                                No transactions found matching your filters
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTransactions.map((t) => (
                                            <motion.tr
                                                key={t.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="hover:bg-slate-800/20 transition-colors group"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3 text-slate-300">
                                                        <CalendarIcon size={14} className="text-slate-500" />
                                                        <span className="font-medium">{format(new Date(t.date), 'MMM dd, yyyy')}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <div
                                                            className="w-2 h-2 rounded-full"
                                                            style={{ backgroundColor: t.category?.color || '#ccc' }}
                                                        ></div>
                                                        <span className="text-slate-300">{t.category?.name || 'Uncategorized'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 max-w-xs truncate text-slate-400">
                                                    {t.description || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                                                    {t.account?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className={cn(
                                                        "font-bold text-base",
                                                        t.type === 'expense' ? "text-red-400" : "text-emerald-400"
                                                    )}>
                                                        {t.type === 'expense' ? '-' : '+'}${parseFloat(Math.abs(t.amount)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button
                                                        onClick={() => handleDelete(t.id)}
                                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all md:opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 flex items-center justify-between border-t border-slate-800 bg-slate-950/30">
                        <p className="text-sm text-slate-500 font-medium">
                            Showing <span className="font-bold text-slate-300">{filteredTransactions.length}</span> results
                        </p>
                        <div className="flex items-center space-x-2">
                            <button className="p-2 text-slate-500 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all disabled:opacity-30">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="p-2 text-slate-500 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRefresh={fetchData}
                categories={categories}
                accounts={accounts}
            />
        </MainLayout>
    );
};

export default TransactionsPage;
