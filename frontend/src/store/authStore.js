import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
    logout: () => set({ user: null }),
}));

export default useAuthStore;
