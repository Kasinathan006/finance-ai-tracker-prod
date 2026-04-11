import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Bell, Search, User, LogOut, Settings as SettingsIcon } from 'lucide-react';

const Navbar = ({ title }) => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="h-16 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
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

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-3 pl-4 border-l border-slate-800 hover:opacity-80 transition-opacity"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-white leading-none">{user?.full_name || 'User'}</p>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">Free Plan</p>
                        </div>
                        <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-slate-800">
                            {user?.full_name?.[0] || <User size={20} />}
                        </div>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-4 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                            <Link
                                to="/settings"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                            >
                                <SettingsIcon size={16} />
                                <span>Settings</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors w-full text-left font-medium"
                            >
                                <LogOut size={16} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
