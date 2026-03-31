import { Expense } from "./expenses";

export interface Budget {
    id: string;
    amount: number;
    month: string;
    date: Date;
    description?: string;
    expenses?: Expense[];
}