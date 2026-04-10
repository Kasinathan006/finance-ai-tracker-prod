import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/auth';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (user, token) => set({
                user,
                token,
                isAuthenticated: true
            }),

            logout: async () => {
                await authApi.logout();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                });
            },

            updateUser: (user) => set({ user }),
        }),
        {
            name: 'finance-auth-storage',
        }
    )
);
