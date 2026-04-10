import apiClient from './axios';

export const budgetApi = {
    getBudgets: async () => {
        const response = await apiClient.get('/api/budgets');
        return response.data;
    },

    createBudget: async (data) => {
        const response = await apiClient.post('/api/budgets', data);
        return response.data;
    },

    deleteBudget: async (id) => {
        const response = await apiClient.delete(`/api/budgets/${id}`);
        return response.data;
    },

    getSavingsGoals: async () => {
        const response = await apiClient.get('/api/savings');
        return response.data;
    },

    createSavingsGoal: async (data) => {
        const response = await apiClient.post('/api/savings', data);
        return response.data;
    },

    updateSavingsGoal: async (id, data) => {
        const response = await apiClient.put(`/api/savings/${id}`, data);
        return response.data;
    },
};
