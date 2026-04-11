import { supabase } from './supabaseClient';

export const budgetsApi = {
    getBudgets: async () => {
        const { data, error } = await supabase
            .from('finance_budgets')
            .select('*')
            .order('category');
        if (error) throw error;
        return data;
    },

    createBudget: async (budgetData) => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('finance_budgets')
            .insert([{ ...budgetData, user_id: user.id }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    updateBudget: async (id, budgetData) => {
        const { data, error } = await supabase
            .from('finance_budgets')
            .update(budgetData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    deleteBudget: async (id) => {
        const { error } = await supabase
            .from('finance_budgets')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    getSavingsGoals: async () => {
        const { data, error } = await supabase
            .from('finance_savings_goals')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    createSavingsGoal: async (goalData) => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('finance_savings_goals')
            .insert([{ ...goalData, user_id: user.id }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    updateSavingsGoal: async (id, goalData) => {
        const { data, error } = await supabase
            .from('finance_savings_goals')
            .update(goalData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    deleteSavingsGoal: async (id) => {
        const { error } = await supabase
            .from('finance_savings_goals')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};
