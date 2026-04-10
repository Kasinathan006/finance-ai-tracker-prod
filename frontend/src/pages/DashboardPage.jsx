import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    PieChart as PieChartIcon,
    Calendar,
    Clock
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { transactionApi } from '../api/transactions';
import { budgetApi } from '../api/budgets';
import { analyticsApi } from '../api/analytics';
import { format, subMonths } from 'date-fns';
import { motion } from 'framer-motion';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        savingsRate: 0
    });
    const [insightData, setInsightData] = useState({
        healthScore: 0,
        healthStatus: 'Unknown',
        insights: []
    });
    const [chartData, setChartData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [transactions, accounts, insights, budgetList] = await Promise.all([
                transactionApi.getTransactions({ limit: 100 }),
                transactionApi.getAccounts(),
                analyticsApi.getInsights(),
                budgetApi.getBudgets()
            ]);

            setInsightData({
                healthScore: insights.health_score || 0,
                healthStatus: insights.health_status || 'Unknown',
                insights: insights.insights || []
            });
            setBudgets(budgetList);

            // Calculate Stats
            const accountsList = Array.isArray(accounts) ? accounts : [];
            const transactionsList = Array.isArray(transactions) ? transactions : [];

            const totalBal = accountsList.reduce((acc, curr) => acc + (curr.balance || 0), 0);

            const now = new Date();
            const thisMonthTrans = transactionsList.filter(t => {
                const d = new Date(t.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });

            const income = thisMonthTrans.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
            const expenses = thisMonthTrans.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

            setStats({
                totalBalance: totalBal,
                monthlyIncome: income,
                monthlyExpenses: expenses,
                savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 100) : 0
            });

            // Recent Transactions
            setRecentTransactions(transactionsList.slice(0, 5));

            // Chart Data (simple last 6 months)
            const months = Array.from({ length: 6 }).map((_, i) => {
                const d = subMonths(now, 5 - i);
                return format(d, 'MMM');
            });

            setChartData(months.map(m => ({
                name: m,
                income: Math.random() * 5000 + 2000,
                expense: Math.random() * 3000 + 1000
            })));

        } catch (err) {
            console.error('Data fetch failed', err);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-${color}-500/10 transition-colors`}></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 bg-${color}-500/10 rounded-2xl text-${color}-400`}>
                    <Icon size={24} />
                </div>
            </div>
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest relative z-10">{title}</h3>
            <p className="text-3xl font-black text-white mt-1 relative z-10">
                ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
        </motion.div>
    );

    if (loading) {
        return (
            <MainLayout title="Dashboard">
                <div className="flex items-center justify-center h-64 text-white font-bold animate-pulse uppercase tracking-widest">
                    Synchronizing Data...
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Dashboard">
            <div className="space-y-8 pb-10">
                {/* AI Advisor & Savings Highlight */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                    <span>AI Financial Advisor</span>
                                </div>
                                <h2 className="text-3xl font-black leading-tight">
                                    Your financial health is <span className="text-emerald-400">{insightData.healthStatus}</span>
                                </h2>
                                <div className="space-y-3">
                                    {insightData.insights.map((insight, idx) => (
                                        <div key={idx} className="flex items-start space-x-3 text-indigo-100 bg-white/5 p-3 rounded-2xl border border-white/10">
                                            <div className={`mt-1 p-1 rounded-lg ${insight.type === 'warning' ? "bg-amber-400/20 text-amber-400" : "bg-cyan-400/20 text-cyan-400"
                                                }`}>
                                                {insight.type === 'warning' ? <ArrowDownRight size={14} /> : <TrendingUp size={14} />}
                                            </div>
                                            <p className="text-sm font-medium">{insight.message}</p>
                                        </div>
                                    ))}
                                    {insightData.insights.length === 0 && (
                                        <p className="text-sm text-indigo-200 opacity-60 italic">Analyzing your spending patterns for more insights...</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 min-w-[180px]">
                                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Health Score</p>
                                <div className="text-6xl font-black text-white">{insightData.healthScore}</div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${insightData.healthScore}%` }}
                                        className="h-full bg-emerald-400 shadow-lg shadow-emerald-500/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-between overflow-hidden relative shadow-2xl">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 blur-3xl"></div>
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Efficiency</p>
                            <h3 className="text-2xl font-black text-white leading-tight">Savings Velocity</h3>
                        </div>
                        <div className="flex items-end justify-between relative z-10">
                            <div>
                                <p className="text-4xl font-black text-cyan-400">{stats.savingsRate}%</p>
                                <p className="text-xs text-slate-500 font-medium mt-1">of income saved</p>
                            </div>
                            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
                                <PieChartIcon size={32} className="text-slate-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Cash" value={stats.totalBalance} icon={Wallet} color="cyan" />
                    <StatCard title="Monthly In" value={stats.monthlyIncome} icon={TrendingUp} color="emerald" />
                    <StatCard title="Monthly Out" value={stats.monthlyExpenses} icon={TrendingDown} color="red" />
                    <StatCard title="Savings Rate" value={stats.savingsRate} icon={PieChartIcon} color="purple" />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cash Flow Chart */}
                    <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-white">Cash Flow</h2>
                                <p className="text-slate-500 text-sm mt-1">Movement over time</p>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px' }} />
                                    <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                    <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col">
                        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
                        <div className="space-y-6 flex-1">
                            {recentTransactions.map((t) => (
                                <div key={t.id} className="flex items-center justify-between group">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-700 transition-all duration-300">
                                            {t.type === 'expense' ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white leading-tight">{t.category?.name || 'Uncategorized'}</p>
                                            <p className="text-xs text-slate-500 mt-1">{format(new Date(t.date), 'MMM dd')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-black ${t.type === 'expense' ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {t.type === 'expense' ? '-' : '+'}${parseFloat(t.amount).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {recentTransactions.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2 py-10">
                                    <Clock size={40} className="opacity-20" />
                                    <p className="text-sm font-medium">No recent activity</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Budgets Section */}
                <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-8">Budget Performance</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {budgets.map(budget => {
                            const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
                            const isNearLimit = percentage >= 80;
                            const isOver = budget.spent > budget.amount;

                            return (
                                <div key={budget.id} className="bg-slate-800/30 border border-slate-800 rounded-3xl p-6 hover:bg-slate-800/50 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-white font-bold">{budget.category?.name}</h4>
                                            <p className="text-xs text-slate-500">${budget.spent.toLocaleString()} / ${budget.amount.toLocaleString()}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${isOver ? 'bg-red-500/20 text-red-400' : isNearLimit ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                                            }`}>
                                            {isOver ? 'Over' : isNearLimit ? 'Alert' : 'Good'}
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            className={`h-full rounded-full ${isOver ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-emerald-500'
                                                }`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {budgets.length === 0 && (
                            <div className="col-span-3 py-10 flex flex-col items-center justify-center text-slate-600">
                                <Wallet size={32} className="mb-2 opacity-20" />
                                <p className="text-sm font-medium">No budgets configured</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
