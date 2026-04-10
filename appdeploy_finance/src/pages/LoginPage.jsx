import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, Wallet } from 'lucide-react';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await authApi.login();
            setAuth(result.user, result.accessToken);
            navigate('/dashboard');
        } catch (err) {
            console.error('Sign in failed:', err);
            if (err.message !== 'popup_closed') {
                setError('Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl relative text-center"
            >
                <div className="mb-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20 rotate-12">
                        <Wallet className="text-white -rotate-12" size={40} />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Finance AI</h2>
                    <p className="text-slate-400">Master your wealth with intelligent insights</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-2xl transition-all transform hover:scale-[1.02] shadow-xl shadow-cyan-900/20 active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={24} />
                    ) : (
                        <>
                            Get Started <ArrowRight className="ml-2" size={20} />
                        </>
                    )}
                </button>

                <p className="mt-8 text-xs text-slate-500 px-4">
                    Your session is securely managed by AppDeploy.
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
