import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user, loading: false }),
    setAuth: (user) => set({ user, loading: false }),
    setLoading: (loading) => set({ loading }),
    logout: () => set({ user: null }),
}));

export default useAuthStore;
