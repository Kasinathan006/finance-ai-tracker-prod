import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { transactionsApi } from '../api/transactions';
import { analyticsApi } from '../api/analytics';
import {
    TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon,
    Calendar, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyticsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [monthlyTrend, setMonthlyTrend] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [aiInsight, setAiInsight] = useState("Analyzing your financial patterns...");

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const data = await transactionsApi.getTransactions();
            setTransactions(data);
            processChartData(data);

            const insightData = await analyticsApi.getAIInsights();
            setAiInsight(insightData.insight);
        } catch (err) {
            console.error('Failed to fetch analytics data', err);
        } finally {
            setLoading(false);
        }
    };

    const processChartData = (data) => {
        // Monthly Trend
        const months = {};
        data.forEach(t => {
            const dateObj = new Date(t.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            if (!months[month]) months[month] = { month, income: 0, expense: 0 };
            if (t.type === 'income') months[month].income += Number(t.amount);
            else months[month].expense += Number(t.amount);
        });
        setMonthlyTrend(Object.values(months));

        // Category Distribution (Expenses only)
        const cats = {};
        data.filter(t => t.type === 'expense').forEach(t => {
            const cat = t.category || 'Others';
            cats[cat] = (cats[cat] || 0) + Number(t.amount);
        });
        const catArray = Object.entries(cats).map(([name, value]) => ({ name, value }));
        setCategoryData(catArray);
    };

    const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

    const StatCard = ({ title, value, sub, icon: Icon, color }) => (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-[2rem] p-6">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-500`}>
                    <Icon size={24} />
                </div>
                <div className="flex items-center text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={14} className="mr-0.5" /> 12%
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-black text-white mt-1">${value.toLocaleString()}</h3>
            <p className="text-slate-600 text-xs mt-2">{sub}</p>
        </div>
    );

    return (
        <MainLayout title="Financial Analytics">
            <div className="space-y-8 pb-10">
                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Income"
                        value={transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0)}
                        sub="Total earnings this period"
                        icon={TrendingUp}
                        color="cyan"
                    />
                    <StatCard
                        title="Total Expenses"
                        value={transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0)}
                        sub="Total spending this period"
                        icon={TrendingDown}
                        color="rose"
                    />
                    <StatCard
                        title="Net Savings"
                        value={transactions.reduce((acc, t) => acc + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0)}
                        sub="Keep up the good work!"
                        icon={DollarSign}
                        color="emerald"
                    />
                    <StatCard
                        title="Avg. Daily Spend"
                        value={transactions.filter(t => t.type === 'expense').length > 0 ? transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0) / 30 : 0}
                        sub="Based on last 30 days"
                        icon={Activity}
                        color="blue"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Monthly Trend Chart */}
                    <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-[2.5rem] p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white">Cash Flow Trend</h3>
                                <p className="text-slate-500 text-sm">Monthly income vs expenses</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                                    <span className="text-xs text-slate-400">Income</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                                    <span className="text-xs text-slate-400">Expense</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyTrend}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem' }}
                                        itemStyle={{ fontSize: '12px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="income"
                                        stroke="#06b6d4"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorIncome)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="expense"
                                        stroke="#f43f5e"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorExpense)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Distribution Chart */}
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-[2.5rem] p-8">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white">Expense Share</h3>
                            <p className="text-slate-500 text-sm">Where your money goes</p>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 space-y-3">
                            {categoryData.slice(0, 5).map((item, index) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-sm text-slate-400 font-medium">{item.name}</span>
                                    </div>
                                    <span className="text-sm text-white font-bold">${item.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Insights Section */}
                <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Activity size={80} />
                    </div>
                    <div className="relative max-w-2xl">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">
                                AI Advisor
                            </div>
                            <span className="text-white/60 text-xs font-medium">Real-time Analysis</span>
                        </div>
                        <h3 className="text-2xl font-black mb-4 leading-tight">Financial Insights & Recommendations</h3>
                        <p className="text-lg text-cyan-50 font-semibold leading-relaxed">
                            "{aiInsight}"
                        </p>
                        <div className="mt-8 flex gap-4">
                            <button className="bg-white text-blue-600 px-6 py-2.5 rounded-2xl text-sm font-black hover:bg-cyan-50 transition-all">
                                View Strategy
                            </button>
                            <button className="bg-white/10 backdrop-blur-md text-white px-6 py-2.5 rounded-2xl text-sm font-black hover:bg-white/20 transition-all border border-white/20">
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>

                {/* Spending by Day Info */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-[2.5rem] p-8">
                    <div className="mb-0 text-center">
                        <h3 className="text-xl font-bold text-white italic">"Precision in every transaction."</h3>
                        <p className="text-slate-500 text-sm mt-2 font-medium">Data updated every 5 minutes • Export options available in Pro</p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AnalyticsPage;
