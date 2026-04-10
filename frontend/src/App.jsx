import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/DashboardPage';
import Transactions from './pages/TransactionsPage';
import Budgets from './pages/BudgetsPage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import useAuthStore from './store/authStore';
import { supabase } from './api/supabaseClient';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } />
        <Route path="/budgets" element={
          <ProtectedRoute>
            <Budgets />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
