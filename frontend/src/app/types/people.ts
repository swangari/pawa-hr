import { User } from "next-auth";

export interface Department {
    id: string;
    name: string;
    description?: string;
    employees?: User[];
}

export interface Employee {
    id: string;
    name: string;
    email: string;
    department: Department;
    role: string;
    is_active: boolean;
    contract_type: string;
    start_date: string;
    salary?: number;
    airtime_allowance?: number;
    
}
