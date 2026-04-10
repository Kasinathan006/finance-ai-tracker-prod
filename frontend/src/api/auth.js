import { supabase } from './supabaseClient';

export const authApi = {
    login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    register: async ({ email, password, full_name }) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: full_name
                }
            }
        });
        if (error) throw error;
        return data;
    },

    getMe: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }
};
