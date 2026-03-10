export interface Analytics {
    total_employees: number;
    avg_tenure: number;
    total_expenses: number;
    total_budgets: number;
    avg_performance_score: number;
    retention_overview: {
        department: string;
    }
    expense_breakdown: {
        category: string;
        amount: number;
    }
    performance_distribution: {
        score: number;
        count: number;
    }
    budget_utilization: {
        department: string;
        utilization: number;
    }
}