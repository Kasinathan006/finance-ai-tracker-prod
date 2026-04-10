import apiClient from './axios';

export const analyticsApi = {
    getInsights: async () => {
        const response = await apiClient.get('/analytics/insights');
        return response.data;
    },
};
