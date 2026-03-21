export interface Analytics {
    total_employees: number;
    avg_tenure: number;
    total_expenses: number;
    total_budgets: number;
    retention_overview: {
        department: string;
    }
    expense_breakdown: {
        category: string;
        amount: number;
    }
    budget_utilization: {
        department: string;
        utilization: number;
    }
}