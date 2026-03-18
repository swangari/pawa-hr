export interface Expense {
    id: string;
    amount: number;
    date: string;
    category: "transportation" | "accommodation" | "salary" | "airtime" | "recruitment" | "employee" | "training" | "system" | "welfare" | "engagement" | "legal";
    description: string;
    budget_id: string;

}