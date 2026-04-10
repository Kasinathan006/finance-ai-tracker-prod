import { supabase } from './supabaseClient';

export const transactionsApi = {
    getAccounts: async () => {
        const { data, error } = await supabase
            .from('finance_accounts')
            .select('*')
            .order('name');
        if (error) throw error;
        return data;
    },

    createAccount: async (accountData) => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('finance_accounts')
            .insert([{ ...accountData, user_id: user.id }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    getTransactions: async () => {
        const { data, error } = await supabase
            .from('finance_transactions')
            .select(`
                *,
                account:account_id (
                    name
                )
            `)
            .order('date', { ascending: false });
        if (error) throw error;
        return data;
    },

    createTransaction: async (transactionData) => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('finance_transactions')
            .insert([{ ...transactionData, user_id: user.id }])
            .select()
            .single();
        if (error) throw error;

        // Update account balance
        if (transactionData.amount) {
            const { data: account } = await supabase
                .from('finance_accounts')
                .select('balance')
                .eq('id', transactionData.account_id)
                .single();

            await supabase
                .from('finance_accounts')
                .update({ balance: Number(account.balance) + Number(transactionData.amount) })
                .eq('id', transactionData.account_id);
        }

        return data;
    }
};
