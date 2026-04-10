import { db, auth, router, json, error } from "@appdeploy/sdk";

// Types derived from existing FastAPI models
interface Account {
    userId: string;
    name: string;
    type: string;
    balance: number;
}

interface Transaction {
    userId: string;
    accountId: string;
    category: string;
    amount: number;
    date: string;
    description?: string;
}

interface Budget {
    userId: string;
    category: string;
    limit: number;
    spent: number;
}

export const handler = router({
    "GET /api/_healthcheck": [async () => json({ message: "Success" })],

    // Accounts
    "GET /api/accounts": [
        auth.requireAuth(),
        async (ctx) => {
            const userId = ctx.user!.userId;
            const { items } = await db.list<Account>("accounts", { filter: { userId } });
            return json(items);
        }
    ],
    "POST /api/accounts": [
        auth.requireAuth(),
        async (ctx) => {
            const userId = ctx.user!.userId;
            const body = ctx.body as Omit<Account, "userId">;
            const [id] = await db.add("accounts", [{ ...body, userId }]);
            if (!id) return error("Failed to create account");
            return json({ id, ...body, userId });
        }
    ],

    // Transactions
    "GET /api/transactions": [
        auth.requireAuth(),
        async (ctx) => {
            const userId = ctx.user!.userId;
            const { items } = await db.list<Transaction>("transactions", { filter: { userId } });
            return json(items);
        }
    ],
    "POST /api/transactions": [
        auth.requireAuth(),
        async (ctx) => {
            const userId = ctx.user!.userId;
            const body = ctx.body as Omit<Transaction, "userId">;
            const [id] = await db.add("transactions", [{ ...body, userId }]);
            if (!id) return error("Failed to create transaction");

            // Note: In a real app we might update account balance here
            return json({ id, ...body, userId });
        }
    ],

    // Budgets
    "GET /api/budgets": [
        auth.requireAuth(),
        async (ctx) => {
            const userId = ctx.user!.userId;
            const { items } = await db.list<Budget>("budgets", { filter: { userId } });
            return json(items);
        }
    ],
    "POST /api/budgets": [
        auth.requireAuth(),
        async (ctx) => {
            const userId = ctx.user!.userId;
            const body = ctx.body as Omit<Budget, "userId">;
            const [id] = await db.add("budgets", [{ ...body, userId }]);
            if (!id) return error("Failed to create budget");
            return json({ id, ...body, userId });
        }
    ],

    // Analytics (AI Insights)
    "GET /api/analytics/insights": [
        auth.requireAuth(),
        async (ctx) => {
            const userId = ctx.user!.userId;

            const [transactionsRes, budgetsRes] = await Promise.all([
                db.list<Transaction>("transactions", { filter: { userId } }),
                db.list<Budget>("budgets", { filter: { userId } })
            ]);

            const transactions = transactionsRes.items;
            const budgets = budgetsRes.items;

            // Simplified logic from original analytics.py
            const totalSpending = transactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);

            const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);

            let healthScore = 75; // Default
            if (totalBudget > 0) {
                const ratio = totalSpending / totalBudget;
                if (ratio > 1) healthScore = Math.max(0, 75 - (ratio - 1) * 50);
                else healthScore = Math.min(100, 75 + (1 - ratio) * 25);
            }

            const insights = [];
            if (healthScore > 80) insights.push("Great job! You're well within your budget.");
            else if (healthScore < 50) insights.push("Alert: You have exceeded your planned spending. Consider reviewing your budgets.");
            else insights.push("You're on track, but keep an eye on your discretionary spending.");

            // Budget utilization
            const performance = budgets.map(b => ({
                category: b.category,
                limit: b.limit,
                spent: b.spent,
                utilization: b.limit > 0 ? (b.spent / b.limit) * 100 : 0
            }));

            return json({
                health_score: Math.round(healthScore),
                insights,
                budget_performance: performance
            });
        }
    ]
});
