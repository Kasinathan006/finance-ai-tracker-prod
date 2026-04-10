import { api } from '@appdeploy/client';

const apiClient = {
    get: async (url, config) => {
        const { data } = await api.get(url);
        return { data };
    },
    post: async (url, body, config) => {
        const { data } = await api.post(url, body);
        return { data };
    },
    put: async (url, body, config) => {
        const { data } = await api.put(url, body);
        return { data };
    },
    delete: async (url, config) => {
        const { data } = await api.delete(url);
        return { data };
    }
};

export default apiClient;
