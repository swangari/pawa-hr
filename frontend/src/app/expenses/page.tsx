"use client";

import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AddExpenseModal } from "./create-expense/addNewExpense";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import {
  fetchEmployees,
  fetchBudgets,
  fetchExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  addBudget,
  updateBudget,
} from "../api/api";
import { Expense } from "../types/expenses";
import { Budget } from "../types/budget";
import { Employee } from "../types/people";

export default function ExpenditurePage() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("2026-Y");
  const [filterOpen, setFilterOpen] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const currentYearMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const isFutureMonth = useMemo(() => {
    if (selectedMonth === "All") return false;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthNum = today.getMonth() + 1; // 1-indexed

    if (selectedMonth.includes("-Y")) {
      const year = parseInt(selectedMonth.split("-Y")[0]);
      return year > currentYear;
    }

    if (selectedMonth.includes("-Q")) {
      const parts = selectedMonth.split("-Q");
      const year = parseInt(parts[0]);
      const q = parseInt(parts[1]);
      const firstMonthOfQ = (q - 1) * 3 + 1;

      if (year > currentYear) return true;
      if (year < currentYear) return false;
      return firstMonthOfQ > currentMonthNum;
    }

    // YYYY-MM
    return selectedMonth > currentYearMonth;
  }, [selectedMonth, currentYearMonth]);

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
          category: e.expense_type.toLowerCase(),
        }));

        setAllExpenses(mappedExpenses);

        const currentYear = new Date().getFullYear().toString();
        const budgetForYear = (budgetData as any).find(
          (b: any) => b.month === currentYear,
        );
        setCurrentBudget(budgetForYear || null);

        // All expenses
        setExpenses(mappedExpenses);
      } catch (error) {
        console.error("Error fetching expenditure data:", error);
      }
    };
    loadData();
  }, []);

  // Calculate period bounds (consistent with other pages)
  const getPeriodBounds = (period: string) => {
    if (period === "All" || !period)
      return { start: new Date("1970-01-01"), end: new Date("2099-12-31") };

    const year = parseInt(period.split("-")[0]);
    if (period.includes("-Q")) {
      const q = parseInt(period.split("-Q")[1]);
      const startMonth = (q - 1) * 3;
      const endMonth = q * 3 - 1;
      return {
        start: new Date(year, startMonth, 1),
        end: new Date(year, endMonth + 1, 0, 23, 59, 59),
      };
    } else if (period.includes("-Y")) {
      return {
        start: new Date(year, 0, 1),
        end: new Date(year, 11, 31, 23, 59, 59),
      };
    } else {
      const month = parseInt(period.split("-")[1]) - 1;
      return {
        start: new Date(year, month, 1),
        end: new Date(year, month + 1, 0, 23, 59, 59),
      };
    }
  };

  const periodBounds = useMemo(
    () => getPeriodBounds(selectedMonth),
    [selectedMonth],
  );

  useEffect(() => {
    if (selectedMonth === "All") {
      setExpenses(allExpenses);
    } else {
      const filtered = allExpenses.filter((e) => {
        const expenseDate = new Date(e.date);
        return (
          expenseDate >= periodBounds.start && expenseDate <= periodBounds.end
        );
      });
      setExpenses(filtered);
    }

    // Always find annual budget for the year of the selection
    const selectedYear =
      selectedMonth === "All"
        ? new Date().getFullYear().toString()
        : selectedMonth.split("-")[0];

    const budgetForYear = budgets.find((b: any) => b.month === selectedYear);
    setCurrentBudget(budgetForYear || null);
  }, [selectedMonth, allExpenses, periodBounds, budgets, currentYearMonth]);

  // Calculate number of months in the period to scale payroll
  const numMonths =
    (periodBounds.end.getFullYear() - periodBounds.start.getFullYear()) * 12 +
    (periodBounds.end.getMonth() - periodBounds.start.getMonth()) +
    1;

  const totalPayroll =
    employees
      .filter((emp) => {
        const hireD = new Date(emp.hire_date || emp.created_at || "");
        if (hireD > periodBounds.end) return false;
        if (!emp.is_active && emp.termination_date) {
          const termD = new Date(emp.termination_date);
          if (termD <= periodBounds.start) return false;
        }
        return true;
      })
      .reduce((sum, emp) => {
        // For simplicity, we count full month salary if they were active at any point in the period
        // In a real system, we'd prorate.
        return sum + (emp.salary || 0) + (emp.airtime_allowance || 0);
      }, 0) * numMonths;

  const totalBudget = currentBudget ? currentBudget.amount : 0;

  const categoryTotals = expenses.reduce((acc: any, curr) => {
    const cat = curr.category;
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});

  // Derived category data for the pie chart
  const dynamicCategoryData = Object.entries(categoryTotals)
    .filter(
      ([name]) =>
        name.toLowerCase() !== "salary" && name.toLowerCase() !== "salaries",
    )
    .map(([name, value], index) => {
      const colors = [
        "#8884d8",
        "#82ca9d",
        "#ffc658",
        "#ff8042",
        "#0088fe",
        "#00c49f",
        "#ffbb28",
      ];
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
        value: value as number,
        color: colors[index % colors.length],
      };
    });

  // Add Salaries to category data

  const spendByCategoryData = [
    { name: "Salaries", value: totalPayroll, color: "#62C3DD" },
    ...dynamicCategoryData,
  ].filter((item) => item.value > 0 || item.name === "Salaries");

  const uniqueCategories = Array.from(
    new Set(allExpenses.map((e) => e.category.toLowerCase())),
  );

  const totalActual = spendByCategoryData.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const budgetPercentage =
    totalBudget > 0 ? Math.min((totalActual / totalBudget) * 100, 100) : 0;

  const handleEditBudget = () => {
    setBudgetInput(totalBudget.toString());
    setIsEditingBudget(true);
  };

  const handleSaveBudget = async () => {
    const newAmount = Number(budgetInput);
    if (newAmount > 0) {
      try {
        const selectedYear =
          selectedMonth === "All"
            ? new Date().getFullYear().toString()
            : selectedMonth.split("-")[0];

        if (currentBudget && currentBudget.month === selectedYear) {
          const updated = await updateBudget(currentBudget, {
            amount: newAmount,
          });
          setCurrentBudget(updated as any);
          setBudgets(
            budgets.map((b) => (b.id === updated.id ? (updated as any) : b)),
          );
        } else {
          const created = await addBudget({
            month: selectedYear,
            amount: newAmount,
          } as any);
          setCurrentBudget(created as any);
          setBudgets([...budgets, created as any]);
        }
        setIsEditingBudget(false);
      } catch (error) {
        console.error("Failed to save budget:", error);
        alert("Could not update budget.");
      }
    }
  };

  const handleCancelBudget = () => {
    setIsEditingBudget(false);
    setBudgetInput("");
  };

  const handleAddExpense = async (newExpenseData: any) => {
    // If no budget for selected month, we could create one or error
    // In this app, we expect a budget to exist.
    let targetBudget = currentBudget;

    // If we're editing an expense from a different month, or adding to a different month
    // We should ensure we have the correct budget_id.
    // For now, assume the user picked the right month in the UI.

    if (!targetBudget) {
      // Try to find budget for the expense date year
      const expYear = newExpenseData.date.split("-")[0];
      targetBudget = budgets.find((b) => b.month === expYear) || null;

      if (!targetBudget) {
        alert(`Please set an annual budget for ${expYear} first.`);
        return;
      }
    }

    try {
      if (newExpenseData.id) {
        // Update
        const updated = await updateExpense(newExpenseData as any, {
          ...newExpenseData,
          expense_type: newExpenseData.category.toLowerCase(),
        });
        const mappedUpdated = {
          ...updated,
          category: (updated as any).expense_type.toLowerCase(),
        };
        setExpenses(
          expenses.map((e) => (e.id === updated.id ? mappedUpdated : e)),
        );
        setAllExpenses(
          allExpenses.map((e) => (e.id === updated.id ? mappedUpdated : e)),
        );
      } else {
        // Create
        const payload = {
          ...newExpenseData,
          budget_id: targetBudget?.id,
          expense_type: newExpenseData.category.toLowerCase(),
          date: newExpenseData.date,
        };
        const created = await addExpense(payload);
        const mappedCreated = {
          ...created,
          category: (created as any).expense_type.toLowerCase(),
        };
        setExpenses([mappedCreated as any, ...expenses]);
        setAllExpenses([mappedCreated as any, ...allExpenses]);
      }
      setIsModalOpen(false);
      setEditingExpense(null);
    } catch (error) {
      console.error("Failed to save expense:", error);
      alert("Failed to save expense. Ensure the data is valid.");
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = (expense: Expense) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteExpense = async () => {
    if (!expenseToDelete) return;

    try {
      await deleteExpense(expenseToDelete);
      setExpenses(expenses.filter((e) => e.id !== expenseToDelete.id));
      setAllExpenses(allExpenses.filter((e) => e.id !== expenseToDelete.id));
      setExpenseToDelete(null);
    } catch (error) {
      console.error("Failed to delete expense:", error);
      alert("Failed to delete expense.");
    }
  };

  const exportToPDF = () => {
    const originalTitle = document.title;
    const fileName = `PawaHR - Expenses - ${new Date().toISOString().split("T")[0]}`;
    document.title = fileName;
    window.print();
    document.title = originalTitle;
  };

  return (
    <div
      id="expenses-content"
      className="p-8 max-w-7xl mx-auto bg-gray-50/50 print-container"
    >
      <style jsx global>{`
        @media print {
          /* Hide everything by default */
          body * {
            visibility: hidden;
          }
          /* Show only the invoice container and its children */
          .print-container,
          .print-container * {
            visibility: visible;
          }
          /* Position the invoice at the very top-left of the PDF page */
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm; /* Force A4 width */
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          /* Hide specific UI elements like the Download button inside the main */
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenditure</h1>
          <p className="text-gray-500 mt-1">
            Track and manage your organization&apos;s spending
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Custom Month Filter Dropdown */}
          <div className="relative inline-block no-print">
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className="px-3 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-start items-center gap-2 hover:bg-slate-50 transition-colors h-[38px]"
            >
              <span className="opacity-60 flex justify-start items-center gap-1">
                <svg
                  className="w-4 h-4 text-slate-400"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 4h12M4 8h8M6 12h4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-slate-700 text-xs font-normal font-sans">
                  Month
                </span>
              </span>
              <span className="text-slate-700 text-xs font-normal font-sans capitalize">
                {selectedMonth === "All"
                  ? "All Time"
                  : selectedMonth.includes("-Q")
                    ? `Q${selectedMonth.split("-Q")[1]} ${selectedMonth.split("-")[0]}`
                    : selectedMonth.includes("-Y")
                      ? `Year ${selectedMonth.split("-Y")[0]}`
                      : new Date(selectedMonth + "-01").toLocaleString(
                          "default",
                          {
                            month: "long",
                            year: "numeric",
                          },
                        )}
              </span>
              <svg
                className="w-4 h-4 text-slate-400"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6.4L8 10l4-3.6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {filterOpen && (
              <div className="absolute left-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-100 z-50 py-1 max-h-[300px] overflow-y-auto">
                {[
                  { val: "2026-Y", label: "Year 2026" },
                  { val: "2026-Q1", label: "Q1 2026 (Jan-Mar)" },
                  { val: "2026-Q2", label: "Q2 2026 (Apr-Jun)" },
                  { val: "2026-Q3", label: "Q3 2026 (Jul-Sep)" },
                  { val: "2026-Q4", label: "Q4 2026 (Oct-Dec)" },
                  ...[
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                  ].map((m) => ({
                    val: `2026-${m}`,
                    label: new Date(`2026-${m}-01`).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    }),
                  })),
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      setSelectedMonth(opt.val);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition-colors ${
                      selectedMonth === opt.val
                        ? "text-pawa-blue font-semibold"
                        : "text-slate-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={exportToPDF}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all font-medium text-sm text-gray-600 shadow-sm no-print"
          >
            <span className="material-icons-outlined text-[20px]">
              download
            </span>
            Export Report
          </button>
          <button
            onClick={() => {
              setEditingExpense(null);
              setIsModalOpen(true);
            }}
            disabled={isFutureMonth}
            className={`px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-all font-medium no-print ${
              isFutureMonth
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : "bg-[#62C3DD] text-white hover:bg-[#52B3CD] shadow-pawa-blue/20"
            }`}
          >
            <span className="material-icons-outlined text-[20px]">add</span>
            New Expense
          </button>
        </div>
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
              {!isEditingBudget && !isFutureMonth && (
                <button
                  onClick={handleEditBudget}
                  className="p-2 text-gray-400 hover:text-pawa-blue hover:bg-pawa-blue/5 rounded-full transition-all no-print"
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
                className="relative flex items-center justify-center overflow-hidden"
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

            {isFutureMonth && expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="p-4 bg-blue-50 rounded-full text-pawa-blue">
                  <span className="material-icons-outlined text-[40px]">
                    upcoming
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-900 font-semibold text-sm">
                    Future Period
                  </p>
                  <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">
                    Spending has not yet started for this month.
                  </p>
                </div>
              </div>
            ) : expenses.length === 0 ? (
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
            ) : (
              <div className="space-y-5 flex-1 overflow-y-auto">
                {expenses.map((expense) => {
                  const isFutureDate =
                    new Date(expense.date).toISOString().slice(0, 7) >
                    currentYearMonth;
                  return (
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
                          {new Date(expense.date).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-sm font-bold text-gray-900">
                          KES {expense.amount.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                          <button
                            onClick={() => handleEditExpense(expense)}
                            className="p-1 text-gray-400 hover:text-pawa-blue hover:bg-pawa-blue/5 rounded transition-all"
                            title="Edit"
                          >
                            <span className="material-icons-outlined text-[16px]">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense)}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                            title="Delete"
                          >
                            <span className="material-icons-outlined text-[16px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleAddExpense}
        existingCategories={uniqueCategories}
        initialData={editingExpense}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
        onConfirm={confirmDeleteExpense}
        title="Delete Expense"
        message={`Are you sure you want to delete the "${expenseToDelete?.description}" expense? This will remove it from your budget logs.`}
      />
    </div>
  );
}
