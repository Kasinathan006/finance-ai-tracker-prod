import apiClient from './axios';

export const transactionApi = {
    getTransactions: async (params) => {
        const response = await apiClient.get('/transactions/', { params });
        return response.data;
    },

    createTransaction: async (data) => {
        const response = await apiClient.post('/transactions/', data);
        return response.data;
    },

    deleteTransaction: async (id) => {
        const response = await apiClient.delete(`/transactions/${id}`);
        return response.data;
    },

    getCategories: async () => {
        const response = await apiClient.get('/transactions/categories');
        return response.data;
    },

    getAccounts: async () => {
        const response = await apiClient.get('/transactions/accounts');
        return response.data;
    },

    createAccount: async (data) => {
        const response = await apiClient.post('/transactions/accounts', data);
        return response.data;
    },
};
