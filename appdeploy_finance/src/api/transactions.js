import apiClient from './axios';

export const transactionApi = {
    getTransactions: async (params) => {
        const response = await apiClient.get('/api/transactions', params);
        return response.data;
    },

    createTransaction: async (data) => {
        const response = await apiClient.post('/api/transactions', data);
        return response.data;
    },

    deleteTransaction: async (id) => {
        const response = await apiClient.delete(`/api/transactions/${id}`);
        return response.data;
    },

    getCategories: async () => {
        const response = await apiClient.get('/api/categories');
        return response.data;
    },

    getAccounts: async () => {
        const response = await apiClient.get('/api/accounts');
        return response.data;
    },

    createAccount: async (data) => {
        const response = await apiClient.post('/api/accounts', data);
        return response.data;
    },
};
