import api from "@/app/lib/api";
import { Expense } from "../types/expenses";
import { Budget } from "../types/budget";
import { Employee, Department } from "../types/people";


export async function fetchExpenses() {
  const response = await api.get<{ data: Expense[] }>("/expenses/");
  return response.data.data || [];
}

export async function fetchSingleExpense(id: string) {
  const response = await api.get<{ data: Expense }>(`/expenses/${id}`);
  return response.data.data;
}

export async function fetchBudgets() {
  const response = await api.get<{ data: Budget[] }>("/budgets/");
  return response.data.data || [];
}

export async function fetchSingleBudget(id: string) {
  const response = await api.get<{ data: Budget }>(`/budgets/${id}`);
  return response.data.data;
}

export async function fetchEmployees() {
  const response = await api.get<{ data: Employee[] }>("/employees/");
  return response.data.data || [];
}

export async function fetchSingleEmployee(id: string) {
  const response = await api.get<{ data: Employee }>(`/employees/${id}`);
  return response.data.data;
}

export async function fetchDepartments() {
  const response = await api.get<{ data: Department[] }>("/departments/");
  return response.data.data || [];
}

export async function fetchSingleDepartment(id: string) {
  const response = await api.get<{ data: Department }>(`/departments/${id}`);
  return response.data.data;
}

export async function addExpense(expense: Expense) {
  const response = await api.post("/expenses/", expense);
  return response.data;
}

export async function addBudget(budget: Budget) {
  const response = await api.post("/budgets/", budget);
  return response.data;
}

export async function addEmployee(employee: Employee) {
  const response = await api.post("/employees/", employee);
  return response.data;
}

export async function addDepartment(department: Department) {
  const response = await api.post("/departments/", department);
  return response.data;
}


export async function updateExpense(expense: Expense, data: Partial<Expense>) {
  const response = await api.put(`/expenses/${expense.id}`, data);
  return response.data;
}

export async function updateBudget(budget: Budget, data: Partial<Budget>) {
  const response = await api.put(`/budgets/${budget.id}`, data);
  return response.data;
}

export async function updateEmployee(employee: Employee, data: Partial<Employee>) {
  const response = await api.put(`/employees/${employee.id}`, data);
  return response.data;
}

export async function updateDepartment(department: Department, data: Partial<Department>) {
  const response = await api.put(`/departments/${department.id}`, data);
  return response.data;
}

export async function deleteExpense(expense: Expense) {
  const response = await api.delete(`/expenses/${expense.id}`);
  return response.data;
}

export async function deleteBudget(budget: Budget) {
  const response = await api.delete(`/budgets/${budget.id}`);
  return response.data;
}

export async function deleteEmployee(employee: Employee) {
  const response = await api.delete(`/employees/${employee.id}`);
  return response.data;
}

export async function deleteDepartment(department: Department) {
  const response = await api.delete(`/departments/${department.id}`);
  return response.data;
}

