import { supabase } from './supabaseClient';

export const analyticsApi = {
    getAIInsights: async () => {
        const { data: transactions } = await supabase
            .from('finance_transactions')
            .select('*')
            .limit(100);

        const { data: budgets } = await supabase
            .from('finance_budgets')
            .select('*');

        // Simple mock AI logic
        const totalSpent = transactions.reduce((sum, t) => sum + (t.amount < 0 ? Math.abs(t.amount) : 0), 0);
        const overBudget = budgets.some(b => b.spent > b.limit);

        let insight = "Your spending is currently stable. Keep tracking your daily expenses!";
        if (overBudget) {
            insight = "Warning: You have exceeded some of your budget limits. Consider reducing non-essential spending this week.";
        } else if (totalSpent > 1000) {
            insight = "You've spent over $1,000 this month. Trend analysis suggests looking at your 'Food & Dining' category for potential savings.";
        }

        return { insight };
    }
};
