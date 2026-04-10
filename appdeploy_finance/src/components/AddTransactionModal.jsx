import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Loader2, Calendar, Tag, CreditCard, FileText, BadgeDollarSign } from 'lucide-react';
import { transactionApi } from '../api/transactions';
import { cn } from '../utils/cn';

const AddTransactionModal = ({ isOpen, onClose, onRefresh, categories, accounts }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category_id: '',
        account_id: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await transactionApi.createTransaction({
                ...formData,
                amount: parseFloat(formData.amount)
            });
            onRefresh();
            onClose();
            setFormData({
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                type: 'expense',
                category_id: '',
                account_id: ''
            });
        } catch (err) {
            alert('Failed to add transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl shadow-cyan-500/10 overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500"></div>

                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">New Transaction</h2>
                                        <p className="text-slate-500 text-sm mt-1">Record your income or expenses</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-3 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Type Selector */}
                                    <div className="flex p-1.5 bg-slate-800/50 rounded-2xl border border-slate-800">
                                        {['expense', 'income'].map((t) => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type: t })}
                                                className={cn(
                                                    "flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all",
                                                    formData.type === t
                                                        ? "bg-slate-700 text-white shadow-lg"
                                                        : "text-slate-400 hover:text-slate-200"
                                                )}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Amount */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Amount ($)</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                                <BadgeDollarSign size={18} />
                                            </div>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                placeholder="0.00"
                                                className="block w-full pl-11 pr-4 py-3.5 bg-slate-800/30 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono text-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Date */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Date</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                                    <Calendar size={18} />
                                                </div>
                                                <input
                                                    type="date"
                                                    required
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-800/30 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Category */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                                    <Tag size={18} />
                                                </div>
                                                <select
                                                    required
                                                    value={formData.category_id}
                                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-800/30 border border-slate-800 rounded-2xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Account</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                                <CreditCard size={18} />
                                            </div>
                                            <select
                                                required
                                                value={formData.account_id}
                                                onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                                                className="block w-full pl-11 pr-4 py-3.5 bg-slate-800/30 border border-slate-800 rounded-2xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                                            >
                                                <option value="">Select Account</option>
                                                {accounts.map(a => (
                                                    <option key={a.id} value={a.id}>{a.name}</option>
                                                ))}
                                                {accounts.length === 0 && (
                                                    <option value="temp-default">Default Wallet (Auto-create)</option>
                                                )}
                                            </select>
                                        </div>
                                        {accounts.length === 0 && (
                                            <p className="text-[10px] text-cyan-500/70 font-semibold px-1">Tip: You'll need to create an account first</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
                                        <div className="relative group">
                                            <div className="absolute top-3.5 left-4 pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                                <FileText size={18} />
                                            </div>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="What was this for?"
                                                rows="2"
                                                className="block w-full pl-11 pr-4 py-3.5 bg-slate-800/30 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-[2] flex items-center justify-center py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-2xl transition-all shadow-xl shadow-cyan-900/20 active:scale-[0.98] disabled:opacity-70"
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={22} /> : "Save Transaction"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddTransactionModal;
