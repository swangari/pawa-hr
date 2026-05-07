"use client";

import React, { useEffect, useState } from "react";
import { fetchAnalytics, fetchDepartments } from "@/app/api/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  LineChart,
  Line,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("2026-Y"); // Default to Year view
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const [analyticsData, deptData] = await Promise.all([
          fetchAnalytics(selectedMonth),
          fetchDepartments(),
        ]);
        setData(analyticsData);
        setDepartments(deptData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [selectedMonth]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pawa-blue"></div>
      </div>
    );
  }

  const exportToPDF = () => {
    const originalTitle = document.title;
    const fileName = `PawaHR - Dashboard - ${new Date().toISOString().split("T")[0]}`;
    document.title = fileName;
    window.print();
    document.title = originalTitle;
  };

  // Transform data for charts
  // Departments from GET /department include an 'employees' array.
  // We count only active employees (is_active === true) for each department.
  const headcountData =
    departments.length > 0
      ? departments.map((dept, index) => ({
          name: dept.name,
          value: (dept.employees || []).filter((e: any) => e.is_active).length,
          color: ["#62C3DD", "#8B5CF6", "#F59E0B", "#10B981"][index % 4],
        }))
      : // .filter((d) => d.value > 0) // hide empty departments
        [];

  // Use the backend's monthly_headcount_trend for a true time-series view —
  // shows total active employees per month rather than per-dept snapshots.
  const headcountTrendData = data?.monthly_headcount_trend || [];

  const monthlyExpensesVsBudgetData = data?.monthly_expenses_vs_budget || [];
  const expenseCategoriesOverTimeData =
    data?.expense_categories_over_time || [];

  return (
    <div
      id="dashboard-content"
      className="p-8 space-y-8 max-w-7xl mx-auto bg-gray-50/50 print-container"
    >
      <style jsx global>{`
        @media print {
          /* ... your existing visibility logic ... */

          body * {
            visibility: hidden;
          }
          .print-container,
          .print-container * {
            visibility: visible;
          }

          .print-container {
            position: absolute;
            left: 0;
            top: 0; /* Changed from 200px to 0 to avoid huge empty space at top */
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Target the grid container to force a single line */
          .grid {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 10px !important; /* Tighten gap for paper */
            width: 100% !important;
          }

          /* Ensure cards take up equal height and look clean */
          .grid > div {
            break-inside: avoid;
            border: 1px solid #e5e7eb !important; /* Ensure border shows up */
            padding: 15px !important;
            box-shadow: none !important;
          }

          /* Force background colors/icons to show in print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print {
            display: none !important;
          }
        }
        @media print {
          /* ... previous visibility and .print-container styles ... */

          /* Force the Main Analysis and Bottom Sections into 2 columns */
          .grid-cols-1.lg\:grid-cols-2 {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 15px !important; /* Reduced gap for print */
            width: 100% !important;
          }

          /* Ensure chart containers don't get cut off */
          .bg-white {
            break-inside: avoid; /* Prevents splitting a chart across two pages */
            border: 1px solid #e5e7eb !important;
            padding: 1rem !important;
            margin-bottom: 0 !important;
          }

          /* Fix Recharts sizing issues during print */
          .recharts-responsive-container {
            width: 100% !important;
            height: 220px !important; /* Slightly reduced height to fit 2x2 nicely */
            min-width: 0 !important;
            display: block !important;
            visibility: visible !important;
          }
          /* Disable animations that cause 'incomplete' charts */
          .recharts-sector,
          .recharts-pie-sector {
            transition: none !important;
            animation: none !important;
            stroke-dasharray: 0 !important; /* Fixes some SVG line issues */
          }

          /* Force the Pie Chart layout to stay side-by-side */
          .flex-col.md\:flex-row {
            flex-direction: row !important;
            justify-content: space-around !important;
            align-items: center !important;
          }

          /* Adjust text sizes for better legibility on A4 */
          h2 {
            font-size: 14pt !important;
            margin-bottom: 10px !important;
          }

          .text-sm {
            font-size: 9pt !important;
          }
          .text-xs {
            font-size: 8pt !important;
          }

          /* Force background colors and chart fills to show */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        @media print {
          /* ... your existing styles ... */

          /* 1. Shrink the Pie Chart area to make room for the legend */
          .print-container .recharts-wrapper {
            margin: 0 auto !important;
          }

          /* 2. Target the Headcount Distribution flex wrapper */
          /* This ensures the Pie and the List stay side-by-side without touching */
          .print-container .flex.flex-col.md\:flex-row {
            display: flex !important;
            flex-direction: row !important;
            gap: 10px !important; /* Small gap to prevent overlap */
            justify-content: space-between !important;
            align-items: center !important;
          }

          /* 3. Specifically scale down the Pie container div */
          .print-container div[style*="width: 220px"] {
            width: 160px !important; /* Reduced from 220px */
            height: 160px !important;
            flex-shrink: 0 !important;
          }

          /* 4. Fix the legend/list spacing */
          .print-container .space-y-3 {
            margin-left: 10px !important;
            max-width: 140px !important; /* Prevent long names from pushing into chart */
            flex-grow: 1 !important;
          }

          /* 5. Ensure the text inside doesn't wrap awkwardly */
          .print-container .text-xs {
            white-space: nowrap !important;
            font-size: 7pt !important;
          }
        }
      `}</style>
      {/* Page Title & Filter */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Real-time overview of your workforce metrics
            </p>
          </div>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all font-medium text-sm text-gray-600 shadow-sm no-print"
          >
            <span className="material-icons-outlined text-[20px]">
              download
            </span>
            Export Report
          </button>
        </div>

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
              {selectedMonth.includes("-Q")
                ? `Q${selectedMonth.split("-Q")[1]} ${selectedMonth.split("-")[0]}`
                : selectedMonth.includes("-Y")
                  ? `Year ${selectedMonth.split("-Y")[0]}`
                  : new Date(selectedMonth + "-01").toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
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
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pawa-border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Total headcount
            </p>
            <span className="material-icons-outlined text-pawa-blue bg-pawa-blue/10 p-2 rounded-lg">
              group
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {data?.total_employees || 0}
          </div>
          <p className="text-xs text-gray-400 mt-2">Active Employees</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pawa-border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {selectedMonth.includes("-Y")
                ? "Budget Used (YTD)"
                : "Budget Used"}
            </p>
            <span className="material-icons-outlined text-purple-500 bg-purple-50 p-2 rounded-lg">
              account_balance_wallet
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {data?.budget_used_percentage || 0}%
          </div>
          <p className="text-xs text-gray-400 mt-2 text-wrap">
            {selectedMonth.includes("-Q")
              ? `Q${selectedMonth.split("-Q")[1]} usage`
              : selectedMonth.includes("-Y")
                ? "Full year usage"
                : `${new Date(selectedMonth + "-01").toLocaleString("default", { month: "long" })} usage`}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pawa-border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Retention rate
            </p>
            <span className="material-icons-outlined text-emerald-500 bg-emerald-50 p-2 rounded-lg">
              trending_up
            </span>
          </div>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-bold text-gray-900">
              {data?.global_retention_rate !== undefined
                ? `${data.global_retention_rate}%`
                : "0%"}
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{
                width: `${data?.global_retention_rate || 0}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pawa-border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Average tenure
            </p>
            <span className="material-icons-outlined text-amber-500 bg-amber-50 p-2 rounded-lg">
              work_outline
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {data?.average_tenure || 0}
          </div>
          <p className="text-xs text-gray-400 mt-2">Years</p>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Retention Trends */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pawa-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Retention Trends
            </h2>
            <p className="text-sm text-gray-400">Total employees per month</p>
          </div>
          <div
            className="w-full mt-4 relative overflow-hidden"
            style={{ height: 260 }}
          >
            <ResponsiveContainer width="100%" height={260} minWidth={0}>
              <AreaChart data={headcountTrendData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#62C3DD" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#62C3DD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: any) => [value, "Employees"]}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#62C3DD"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Headcount by Department */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pawa-border">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Headcount Distribution
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            <div
              className="relative overflow-hidden"
              style={{ width: 220, height: 220 }}
            >
              <ResponsiveContainer width="100%" height={220} minWidth={0}>
                <PieChart>
                  <Pie
                    data={headcountData}
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="90%"
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {headcountData.map((entry: any, index: number) => (
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
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm text-gray-400">Total</span>
                <span className="text-2xl font-bold text-gray-800">
                  {data?.total_employees || 0}
                </span>
              </div>
            </div>
            <div className="space-y-3 flex-1 max-w-[200px]">
              {headcountData.map((item: any) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs font-medium text-gray-600">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Expenses vs Budget */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pawa-border">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Monthly Expenses vs Budget
          </h2>
          <div
            className="w-full mt-4 relative overflow-hidden"
            style={{ height: 260 }}
          >
            <ResponsiveContainer width="100%" height={260} minWidth={0}>
              <BarChart data={monthlyExpensesVsBudgetData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend verticalAlign="top" align="right" height={36} />
                <Bar
                  name="Budget"
                  dataKey="budget"
                  fill="#E2E8F0"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
                <Bar
                  name="Expenses"
                  dataKey="expenses"
                  fill="#62C3DD"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Categories over Time */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pawa-border">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Expense Categories over Time
          </h2>
          <div
            className="w-full mt-4 relative overflow-hidden"
            style={{ height: 260 }}
          >
            <ResponsiveContainer width="100%" height={260} minWidth={0}>
              <LineChart data={expenseCategoriesOverTimeData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend verticalAlign="top" align="right" height={36} />
                {/* Dynamically render lines for each category except 'month' */}
                {expenseCategoriesOverTimeData.length > 0 &&
                  Object.keys(expenseCategoriesOverTimeData[0])
                    .filter((key) => key !== "month")
                    .map((category, index) => (
                      <Line
                        key={category}
                        type="monotone"
                        dataKey={category}
                        stroke={
                          [
                            "#62C3DD",
                            "#8B5CF6",
                            "#F59E0B",
                            "#10B981",
                            "#EF4444",
                            "#3B82F6",
                          ][index % 6]
                        }
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Analytics Section */}
      {/* <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-8">
          Specialized Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">
              Offer Acceptance
            </p>
            <div className="text-4xl font-bold text-gray-900">87%</div>
            <div className="mt-2 flex items-center gap-1 text-emerald-600 text-xs font-bold">
              <span className="material-icons-outlined text-[14px]">
                arrow_upward
              </span>
              +5% vs last Q
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">
              Internal Promotions
            </p>
            <div className="text-4xl font-bold text-gray-900">23</div>
            <p className="mt-2 text-xs text-gray-400">Total YTD</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">
              Engagement Rate
            </p>
            <div className="text-4xl font-bold text-gray-900">94%</div>
            <p className="mt-2 text-xs text-gray-400">Stable benchmark</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">
              Employee Referrals
            </p>
            <div className="text-4xl font-bold text-gray-900">18%</div>
            <p className="mt-2 text-xs text-gray-400">of new hires</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">
              Training Completion
            </p>
            <div className="text-4xl font-bold text-gray-900">92%</div>
            <p className="mt-2 text-xs text-gray-400">Across divisions</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">
              Diversity Ratio
            </p>
            <div className="text-4xl font-bold text-gray-900">48%</div>
            <p className="mt-2 text-xs text-gray-400">Women in leadership</p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
