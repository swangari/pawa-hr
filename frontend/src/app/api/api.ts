import api from "@/app/lib/api";
import { Expense } from "../types/expenses";
import { Budget } from "../types/budget";
import { Employee, Department } from "../types/people";
export type { Employee, Department };
import { Analytics } from "../types/analytics";

export async function fetchExpenses() {
  const response = await api.get<Expense[]>("/expenses/");
  return response.data || [];
}

export async function fetchSingleExpense(id: string) {
  const response = await api.get<Expense>(`/expenses/${id}`);
  return response.data;
}

export async function fetchBudgets() {
  const response = await api.get<Budget[]>("/budget/");
  return response.data || [];
}

export async function fetchSingleBudget(id: string) {
  const response = await api.get<Budget>(`/budget/${id}`);
  return response.data;
}

export async function fetchEmployees() {
  const response = await api.get<Employee[]>("/employee/");
  return response.data || [];
}

export async function fetchSingleEmployee(id: string) {
  const response = await api.get<Employee>(`/employee/${id}`);
  return response.data;
}

export async function fetchDepartments() {
  const response = await api.get<Department[]>("/department/");
  return response.data || [];
}

export async function fetchSingleDepartment(id: string) {
  const response = await api.get<Department>(`/department/${id}`);
  return response.data;
}

export async function addExpense(expense: Expense) {
  const response = await api.post<Expense>("/expenses/", expense);
  return response.data;
}

export async function addBudget(budget: Budget) {
  const response = await api.post<Budget>("/budget/", budget);
  return response.data;
}

export async function addEmployee(employee: Employee) {
  const response = await api.post<Employee>("/employee/", employee);
  return response.data;
}

export async function addDepartment(department: Department) {
  const response = await api.post<Department>("/department/", department);
  return response.data;
}

export async function updateExpense(expense: Expense, data: Partial<Expense>) {
  const response = await api.put<Expense>(`/expenses/${expense.id}`, data);
  return response.data;
}

export async function updateBudget(budget: Budget, data: Partial<Budget>) {
  const response = await api.put<Budget>(`/budget/${budget.id}`, data);
  return response.data;
}

export async function updateEmployee(employee: Employee, data: Partial<Employee>) {
  const response = await api.put<Employee>(`/employee/${employee.id}`, data);
  return response.data;
}

export async function updateDepartment(department: Department, data: Partial<Department>) {
  const response = await api.put<Department>(`/department/${department.id}`, data);
  return response.data;
}

export async function deleteExpense(expense: Expense) {
  const response = await api.delete(`/expenses/${expense.id}`);
  return response.data;
}

export async function deleteBudget(budget: Budget) {
  const response = await api.delete(`/budget/${budget.id}`);
  return response.data;
}

export async function deleteEmployee(employee: Employee) {
  const response = await api.delete(`/employee/${employee.id}`);
  return response.data;
}

export async function deleteDepartment(department: Department) {
  const response = await api.delete(`/department/${department.id}`);
  return response.data;
}

export async function fetchAnalytics(period?: string) {
  const url = period ? `/analytics/dashboard?period=${period}` : "/analytics/dashboard";
  const response = await api.get<Analytics>(url);
  return response.data;
}
