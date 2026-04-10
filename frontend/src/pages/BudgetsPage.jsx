import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import {
    Plus,
    Target,
    TrendingUp,
    MoreHorizontal,
    Trash2,
    Edit2,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from 'lucide-react';
import { budgetApi } from '../api/budgets';
import { transactionApi } from '../api/transactions';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const BudgetsPage = () => {
    const [budgets, setBudgets] = useState([]);
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [budgetsData, goalsData, catsData] = await Promise.all([
                budgetApi.getBudgets(),
                budgetApi.getSavingsGoals(),
                transactionApi.getCategories()
            ]);
            setBudgets(budgetsData);
            setSavingsGoals(goalsData);
            setCategories(catsData);
        } catch (err) {
            console.error('Failed to fetch budgets', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBudget = async (id) => {
        if (window.confirm('Delete this budget?')) {
            try {
                await budgetApi.deleteBudget(id);
                setBudgets(budgets.filter(b => b.id !== id));
            } catch (err) {
                alert('Failed to delete budget');
            }
        }
    };

    const BudgetCard = ({ budget }) => {
        const percent = Math.min((budget.spent / budget.amount) * 100, 100);
        const isOver = budget.spent > budget.amount;

        return (
            <motion.div
                layout
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all group"
            >
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                            style={{ backgroundColor: budget.category?.color || '#3b82f6', boxShadow: `0 8px 16px -4px ${budget.category?.color}40` }}
                        >
                            {/* In a real app, I'd map budget.category.icon to Lucide icons */}
                            <Target size={24} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">{budget.category?.name}</h3>
                            <p className="text-slate-500 text-sm flex items-center">
                                <Clock size={14} className="mr-1" /> {budget.period}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Spent</p>
                            <p className="text-2xl font-black text-white">
                                ${budget.spent.toLocaleString()}
                                <span className="text-slate-500 text-base font-medium ml-1">/ ${budget.amount.toLocaleString()}</span>
                            </p>
                        </div>
                        <div className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold",
                            isOver ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                        )}>
                            {isOver ? "Over Budget" : `${Math.round(100 - percent)}% left`}
                        </div>
                    </div>

                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            className={cn(
                                "h-full rounded-full shadow-sm",
                                isOver ? "bg-red-500" : "bg-cyan-500"
                            )}
                        />
                    </div>
                </div>
            </motion.div>
        );
    };

    const SavingsCard = ({ goal }) => {
        const percent = Math.min((goal.current_amount / goal.target_amount) * 100, 100);

        return (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold">{goal.name}</h3>
                    <TrendingUp size={18} className="text-emerald-400" />
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Progress</span>
                        <span className="text-white font-bold">{Math.round(percent)}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-end pt-2">
                        <p className="text-xl font-black text-white">${goal.current_amount.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">Target: ${goal.target_amount.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout title="Budgets & Goals">
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-white mb-2">Monthly Budgets</h2>
                        <p className="text-slate-500">Track your spending against your limits</p>
                    </div>
                    <button
                        onClick={() => setIsBudgetModalOpen(true)}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl transition-all font-bold shadow-lg shadow-cyan-500/20"
                    >
                        <Plus size={20} />
                        <span>Set New Budget</span>
                    </button>
                </div>

                {/* Budgets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 h-48 animate-pulse" />
                            ))
                        ) : budgets.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-800">
                                <Target size={48} className="mx-auto text-slate-700 mb-4" />
                                <p className="text-slate-500 font-medium italic">No budgets set for this month</p>
                                <button
                                    onClick={() => setIsBudgetModalOpen(true)}
                                    className="mt-4 text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
                                >
                                    + Create your first budget
                                </button>
                            </div>
                        ) : (
                            budgets.map(budget => (
                                <BudgetCard key={budget.id} budget={budget} />
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Savings Goals Section */}
                <div className="pt-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2">Savings Goals</h2>
                            <p className="text-slate-500">Plan for your future milestones</p>
                        </div>
                        <button
                            onClick={() => setIsGoalModalOpen(true)}
                            className="p-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-2xl transition-all"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 h-40 animate-pulse" />
                            ))
                        ) : savingsGoals.map(goal => (
                            <SavingsCard key={goal.id} goal={goal} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Simplistic Add Budget Modal (Placeholders for real modals) */}
            <AddBudgetModal
                isOpen={isBudgetModalOpen}
                onClose={() => setIsBudgetModalOpen(false)}
                categories={categories}
                onRefresh={fetchData}
            />
        </MainLayout>
    );
};

// Internal minimal component for setting budget
const AddBudgetModal = ({ isOpen, onClose, categories, onRefresh }) => {
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await budgetApi.createBudget({
                amount: parseFloat(amount),
                category_id: categoryId,
                period: 'monthly'
            });
            onRefresh();
            onClose();
        } catch (err) {
            alert('Failed to set budget');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
                <h2 className="text-2xl font-black text-white mb-6">Set Category Budget</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-slate-400 text-sm font-bold ml-1">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium appearance-none"
                        >
                            <option value="">Select category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-slate-400 text-sm font-bold ml-1">Monthly Limit ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium placeholder:text-slate-700"
                        />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl font-bold transition-all shadow-lg shadow-cyan-500/20"
                        >
                            Save Budget
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default BudgetsPage;
