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
        let accountId = transactionData.account_id;

        // Auto-create account if 'temp-default' or missing
        if (!accountId || accountId === 'temp-default') {
            const { data: existingAccounts } = await supabase
                .from('finance_accounts')
                .select('id')
                .eq('user_id', user.id)
                .limit(1);

            if (existingAccounts && existingAccounts.length > 0) {
                accountId = existingAccounts[0].id;
            } else {
                const { data: newAccount, error: accError } = await supabase
                    .from('finance_accounts')
                    .insert([{
                        user_id: user.id,
                        name: 'Default Wallet',
                        type: 'cash',
                        balance: 0
                    }])
                    .select()
                    .single();
                if (accError) throw accError;
                accountId = newAccount.id;
            }
        }

        const { data, error } = await supabase
            .from('finance_transactions')
            .insert([{
                ...transactionData,
                account_id: accountId,
                user_id: user.id
            }])
            .select()
            .single();
        if (error) throw error;

        // Update account balance
        if (transactionData.amount) {
            const { data: account } = await supabase
                .from('finance_accounts')
                .select('balance')
                .eq('id', accountId)
                .single();

            if (account) {
                await supabase
                    .from('finance_accounts')
                    .update({ balance: Number(account.balance) + (transactionData.type === 'income' ? Number(transactionData.amount) : -Number(transactionData.amount)) })
                    .eq('id', accountId);
            }
        }

        return data;
    },

    getCategories: async () => {
        // Return a list of standard categories
        return [
            "Food & Dining",
            "Shopping",
            "Housing",
            "Transportation",
            "Entertainment",
            "Personal Care",
            "Health",
            "Education",
            "Gifts & Donations",
            "Investments",
            "Income",
            "Others"
        ];
    }
};
