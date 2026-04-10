import apiClient from './axios';

export const budgetApi = {
    getBudgets: async () => {
        const response = await apiClient.get('/budgets/');
        return response.data;
    },

    createBudget: async (data) => {
        const response = await apiClient.post('/budgets/', data);
        return response.data;
    },

    deleteBudget: async (id) => {
        const response = await apiClient.delete(`/budgets/${id}`);
        return response.data;
    },

    getSavingsGoals: async () => {
        const response = await apiClient.get('/budgets/savings');
        return response.data;
    },

    createSavingsGoal: async (data) => {
        const response = await apiClient.post('/budgets/savings', data);
        return response.data;
    },

    updateSavingsGoal: async (id, data) => {
        const response = await apiClient.patch(`/budgets/savings/${id}`, data);
        return response.data;
    },
};
