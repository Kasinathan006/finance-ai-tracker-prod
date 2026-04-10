import apiClient from './axios';

export const authApi = {
    login: async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        // In main.py: app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
        // And in auth.py: @router.post("/login", response_model=Token)
        // So the full URL is /api/auth/login
        const response = await apiClient.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    register: async (userData) => {
        // URL: /api/auth/register
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },

    getMe: async () => {
        // URL: /api/auth/me
        const response = await apiClient.get('/auth/me');
        return response.data;
    },
};
