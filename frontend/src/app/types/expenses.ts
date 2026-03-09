export interface Expense {
    id: string;
    amount: number;
    date: Date;
    category: "transportation" | "accommodation" | "salary" | "aritime" | "recruitment" | "employee" | "training" | "system";
    description: string;
    budget_id: string;

}