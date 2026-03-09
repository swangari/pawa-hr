import { Expense } from "./expenses";

export interface Budget {
    id: string;
    amount: number;
    date: Date;
    description?: string;
    expense: Expense[];

}