import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import useAuthStore from '../store/authStore';
import {
    User, Mail, Shield, Bell, Moon, Sun,
    Globe, Smartphone, CreditCard, LogOut,
    Check, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
    const { user, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'billing', label: 'Billing', icon: CreditCard },
    ];

    const SettingItem = ({ icon: Icon, label, value, onClick }) => (
        <button
            onClick={onClick}
            className="flex items-center justify-between w-full p-4 hover:bg-slate-800/50 rounded-2xl transition-all group"
        >
            <div className="flex items-center space-x-4">
                <div className="p-2.5 bg-slate-900 rounded-xl text-slate-400 group-hover:text-cyan-400 transition-colors">
                    <Icon size={20} />
                </div>
                <div className="text-left">
                    <p className="text-sm font-semibold text-white">{label}</p>
                    {value && <p className="text-xs text-slate-500 mt-0.5">{value}</p>}
                </div>
            </div>
            <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
        </button>
    );

    return (
        <MainLayout title="Settings">
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                {/* Header Profile */}
                <div className="relative overflow-hidden bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] -mr-32 -mt-32"></div>
                    <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-cyan-500/20">
                            {user?.full_name?.[0] || 'U'}
                        </div>
                        <div className="text-center md:text-left pt-2">
                            <h2 className="text-2xl font-black text-white leading-tight">{user?.full_name || 'Finance User'}</h2>
                            <p className="text-slate-500 font-medium">{user?.email}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-bold border border-cyan-500/20">
                                    FREE PLAN
                                </span>
                                <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-xs font-bold border border-slate-700">
                                    VERIFIED
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-3 w-full px-5 py-4 rounded-2xl transition-all ${activeTab === tab.id
                                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                    }`}
                            >
                                <tab.icon size={20} />
                                <span className="font-bold text-sm tracking-wide">{tab.label}</span>
                            </button>
                        ))}
                        <div className="pt-4 mt-4 border-t border-slate-800">
                            <button
                                onClick={logout}
                                className="flex items-center space-x-3 w-full px-5 py-4 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all"
                            >
                                <LogOut size={20} />
                                <span className="font-bold text-sm tracking-wide">Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Active Content Area */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-[2.5rem] p-8">
                            <h3 className="text-xl font-black text-white mb-6 capitalize">{activeTab} Info</h3>

                            {activeTab === 'profile' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5 px-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                defaultValue={user?.full_name}
                                                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1.5 px-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={user?.email}
                                                disabled
                                                className="w-full bg-slate-900/50 border border-slate-800 text-slate-500 px-4 py-3 rounded-2xl cursor-not-allowed font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button className="bg-white text-black hover:bg-cyan-50 text-sm font-black px-8 py-3 rounded-2xl transition-all">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab !== 'profile' && (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4 opacity-50">
                                    <div className="p-6 bg-slate-800/50 rounded-full">
                                        <activeTab.icon size={40} className="text-slate-400" />
                                    </div>
                                    <p className="text-slate-400 font-medium text-center">
                                        This module is currently in Beta.<br />Available in v2.0 update.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Additional Widgets */}
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <CreditCard size={80} />
                            </div>
                            <div className="relative">
                                <h4 className="text-xl font-black mb-2 leading-tight">Switch to Pro Plan?</h4>
                                <p className="text-indigo-100 text-sm mb-6 max-w-[240px]">Unlock automated AI insights, export data to PDF/Excel, and link multiple banks.</p>
                                <button className="bg-white text-indigo-700 px-6 py-2.5 rounded-2xl text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-900/20">
                                    Upgrade Now — $12/mo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default SettingsPage;
