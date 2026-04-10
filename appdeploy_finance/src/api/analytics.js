import apiClient from './axios';

export const analyticsApi = {
    getInsights: async () => {
        const response = await apiClient.get('/api/analytics/insights');
        return response.data;
    },
};
