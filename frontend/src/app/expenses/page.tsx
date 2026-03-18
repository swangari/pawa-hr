"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AddExpenseModal } from "./create-expense/addNewExpense";
import { fetchEmployees, fetchBudgets, fetchExpenses, addExpense, addBudget, updateBudget } from "../api/api";
import { Expense } from "../types/expenses";
import { Budget } from "../types/budget";
import { Employee } from "../types/people";


export default function ExpenditurePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM

  useEffect(() => {
    const loadData = async () => {
      try {
        const [empData, budgetData, expenseData] = await Promise.all([
          fetchEmployees(),
          fetchBudgets(),
          fetchExpenses(),
        ]);

        setEmployees(empData as any);
        setBudgets(budgetData as any);
        const mappedExpenses = (expenseData as any).map((e: any) => ({
          ...e,
          category: e.expense_type.toLowerCase()
        }));
        
        const budgetForMonth = (budgetData as any).find((b: any) => b.month === currentMonthStr);
        setCurrentBudget(budgetForMonth || null);
        
        // Filter expenses for current month's budget
        const filteredExpenses = budgetForMonth 
          ? mappedExpenses.filter((e: any) => e.budget_id === budgetForMonth.id)
          : [];
        setExpenses(filteredExpenses);
      } catch (error) {
        console.error("Error fetching expenditure data:", error);
      }
    };
    loadData();
  }, []);

  const totalPayroll = employees
    .filter((emp) => emp.is_active)
    .reduce((sum, emp) => sum + (emp.salary || 0) + (emp.airtime_allowance || 0), 0);

  const totalBudget = currentBudget?.amount || 0;

  const categoryTotals = expenses.reduce((acc: any, curr) => {
    const cat = curr.category;
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});

  // Add Salaries to category data
  const spendByCategoryData = [
    { name: "Salaries", value: totalPayroll, color: "#62C3DD" },
    { name: "Recruitment", value: categoryTotals["recruitment"] || 0, color: "#8B5CF6" },
    { name: "Training", value: categoryTotals["training"] || 0, color: "#F59E0B" },
    { name: "Welfare", value: categoryTotals["welfare"] || 0, color: "#10B981" },
    { name: "Engagement", value: categoryTotals["engagement"] || 0, color: "#EF4444" },
    { name: "Systems", value: categoryTotals["system"] || 0, color: "#3B82F6" },
    { name: "Legal", value: categoryTotals["legal"] || 0, color: "#EC4899" },
  ].filter(item => item.value > 0 || item.name === "Salaries"); // Always show Salaries

  const totalActual = spendByCategoryData.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const budgetPercentage = totalBudget > 0 ? Math.min((totalActual / totalBudget) * 100, 100) : 0;

  const handleEditBudget = () => {
    setBudgetInput(totalBudget.toString());
    setIsEditingBudget(true);
  };

  const handleSaveBudget = async () => {
    const newAmount = Number(budgetInput);
    if (newAmount > 0) {
      try {
        if (currentBudget) {
          // If updateBudget prevents amount change if already set, this will fail or ignore
          const updated = await updateBudget(currentBudget, { amount: newAmount });
          setCurrentBudget(updated as any);
        } else {
          const created = await addBudget({ month: currentMonthStr, amount: newAmount } as any);
          setCurrentBudget(created as any);
        }
        setIsEditingBudget(false);
      } catch (error) {
        console.error("Failed to save budget:", error);
        alert("Could not update budget. It might be immutable.");
      }
    }
  };

  const handleCancelBudget = () => {
    setIsEditingBudget(false);
    setBudgetInput("");
  };

  const handleAddExpense = async (newExpenseData: any) => {
    if (!currentBudget) {
      alert("Please set a budget for this month first.");
      return;
    }

    try {
      const payload = {
        ...newExpenseData,
        budget_id: currentBudget.id,
        expense_type: newExpenseData.category.toLowerCase(),
        date: new Date(newExpenseData.date).toISOString(),
      };
      const created = await addExpense(payload);
      const mappedCreated = {
        ...created,
        category: (created as any).expense_type.toLowerCase()
      };
      setExpenses([mappedCreated as any, ...expenses]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add expense:", error);
      alert("Failed to add expense. Ensure the date is within the current budget month.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenditure</h1>
          <p className="text-gray-500 mt-1">
            Track and manage your organization&apos;s spending
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-[#62C3DD] text-white rounded-lg flex items-center gap-2 hover:bg-[#52B3CD] shadow-sm shadow-pawa-blue/20 transition-all font-medium"
        >
          <span className="material-icons-outlined text-[20px]">add</span>
          New Expense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Budget and Chart */}
        <div className="lg:col-span-2 space-y-8">
          {/* Budget Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Budget vs. Actual
              </h2>
              {!isEditingBudget && (
                <button
                  onClick={handleEditBudget}
                  className="p-2 text-gray-400 hover:text-pawa-blue hover:bg-pawa-blue/5 rounded-full transition-all"
                  title="Edit Budget"
                >
                  <span className="material-icons-outlined text-[20px]">
                    edit
                  </span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-sm text-gray-500 block">
                    Total Budget
                  </span>
                  {isEditingBudget ? (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          KES
                        </span>
                        <input
                          type="number"
                          value={budgetInput}
                          onChange={(e) => setBudgetInput(e.target.value)}
                          className="pl-14 pr-3 py-1.5 border border-pawa-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue/20 w-44 text-lg font-semibold"
                          autoFocus
                        />
                      </div>
                      <button
                        onClick={handleSaveBudget}
                        className="p-1.5 bg-[#62C3DD] text-white rounded-lg hover:bg-[#52B3CD] transition-all"
                        title="Save"
                      >
                        <span className="material-icons-outlined text-[18px]">
                          check
                        </span>
                      </button>
                      <button
                        onClick={handleCancelBudget}
                        className="p-1.5 border border-gray-200 text-gray-400 rounded-lg hover:bg-gray-50 hover:text-gray-600 transition-all"
                        title="Cancel"
                      >
                        <span className="material-icons-outlined text-[18px]">
                          close
                        </span>
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-2xl font-bold text-gray-900">
                      KES {totalBudget.toLocaleString()}
                    </h3>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <span className="text-sm text-gray-500 block">
                    Total Actual
                  </span>
                  <h3 className="text-2xl font-bold text-pawa-blue">
                    KES {totalActual.toLocaleString()}
                  </h3>
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-[#62C3DD] transition-all duration-500 ease-out"
                    style={{ width: `${budgetPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-pawa-blue">
                    {budgetPercentage.toFixed(1)}% of budget used
                  </span>
                  <span className="text-gray-400">
                    KES {(totalBudget - totalActual).toLocaleString()} remaining
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spend by Category Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Spend by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div
                className="relative flex items-center justify-center"
                style={{ height: 280 }}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={spendByCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius="65%"
                      outerRadius="90%"
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {spendByCategoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                      formatter={(value: any) => `${value.toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm text-gray-400">Total Spend</span>
                  <span className="text-xl font-bold text-gray-800">
                    KES {totalActual.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {spendByCategoryData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      KES {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Entries */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Entries
              </h2>
              <button className="text-sm font-medium text-pawa-blue hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-5 flex-1 overflow-y-auto">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-start group"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-gray-800 group-hover:text-pawa-blue transition-colors">
                      {expense.category}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {expense.description}
                    </div>
                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                      <span className="material-icons-outlined text-[12px]">
                        calendar_today
                      </span>
                      {new Date(expense.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    KES {expense.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {expenses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                <div className="p-3 bg-gray-50 rounded-full">
                  <span className="material-icons-outlined text-gray-300 text-[32px]">
                    receipt_long
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  No recent expenses found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  );
}
