import { auth } from '@appdeploy/client';

export const authApi = {
    login: async () => {
        const result = await auth.signIn();
        return result;
    },

    register: async () => {
        // AppDeploy handles registration through the same signIn flow
        const result = await auth.signIn();
        return result;
    },

    getMe: async () => {
        return await auth.getUser();
    },

    logout: async () => {
        await auth.signOut();
    }
};
