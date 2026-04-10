import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Bell, Search, User } from 'lucide-react';

const Navbar = ({ title }) => {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="h-16 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
            <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>

            <div className="flex items-center space-x-6">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-slate-900 border border-slate-800 text-white rounded-full pl-10 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-64 transition-all"
                    />
                </div>

                <button className="text-slate-400 hover:text-white transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
                </button>

                <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-white leading-none">{user?.full_name || 'User'}</p>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">Free Plan</p>
                    </div>
                    <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-slate-800">
                        {user?.full_name?.[0] || <User size={20} />}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
