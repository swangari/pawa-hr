"use client";

import React from "react";
import Sidebar from "@/app/components/sidebar";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-pawa-bg text-slate-900 font-display">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-pawa-border flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-pawa-blue text-sm transition-all outline-none"
                placeholder="Search employees or reports..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-pawa-navy hover:bg-slate-200 transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                swap_horiz
              </span>
              <span>Role: Admin</span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-pawa-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-pawa-navy leading-tight">
                  Sarah Jenkins
                </p>
                <p className="text-xs text-slate-500">HR Manager</p>
              </div>
              <div
                className="size-10 rounded-full bg-slate-200 border-2 border-pawa-blue overflow-hidden bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7DWOeachvH8_B52Eo-DB0IM6igFwzHWccWAe3t72HqFlkGk9jKIOvKzKvtX1Jkx0EYOFzZmtI4ltzKuUCfPn_vtSfR_6Hod_lr6_lIfkH-HoVJp_MxNy97WwINElJibWL6WOjo43Op1CQsfJikqc0jAAxCI_oQ7_E-oRuaaqr2uVP4N5fDma5DB7l3VvYDVmw4mK_ZxZKKlERb3OwWxy_t1Q58cDkBAFxpElNX52OKWaTf2GwqHSMSDY2-isdjl2wmDx5SWM3Q7nU')",
                }}
              ></div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card-gray p-6 rounded-xl border border-pawa-border shadow-sm hover:shadow-md transition-shadow">
              <p className="text-slate-500 text-sm font-medium mb-1">
                Total Monthly Spend
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-pawa-navy">$45,200</h3>
                <span className="text-xs font-bold text-emerald-500">+12%</span>
              </div>
              <div className="mt-4 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-pawa-blue h-full rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
            <div className="bg-card-gray p-6 rounded-xl border border-pawa-border shadow-sm hover:shadow-md transition-shadow">
              <p className="text-slate-500 text-sm font-medium mb-1">
                Employee Count
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-pawa-navy">124</h3>
                <span className="text-xs font-bold text-rose-500">-2%</span>
              </div>
              <div className="mt-4 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-pawa-navy h-full rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
            <div className="bg-card-gray p-6 rounded-xl border border-pawa-border shadow-sm hover:shadow-md transition-shadow">
              <p className="text-slate-500 text-sm font-medium mb-1">
                Avg. Tenure
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-pawa-navy">2.4 Years</h3>
                <span className="text-xs font-bold text-emerald-500">+5%</span>
              </div>
              <div className="mt-4 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-pawa-blue h-full rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>
            <div className="bg-card-gray p-6 rounded-xl border border-pawa-border shadow-sm hover:shadow-md transition-shadow">
              <p className="text-slate-500 text-sm font-medium mb-1">
                Avg. Performance
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-pawa-navy">88%</h3>
                <span className="text-xs font-bold text-emerald-500">+1%</span>
              </div>
              <div className="mt-4 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: "88%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Main Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Recent Expenses Table */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-pawa-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-pawa-border flex justify-between items-center">
                <h2 className="text-lg font-bold text-pawa-navy">
                  Recent Expenses
                </h2>
                <button className="text-pawa-blue text-sm font-semibold hover:underline">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pawa-border">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                        Oct 12
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-pawa-navy whitespace-nowrap">
                        Alex Rivera
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                          Travel
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-semibold whitespace-nowrap">
                        $450.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-xs font-bold rounded-full">
                          Approved
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                        Oct 11
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-pawa-navy whitespace-nowrap">
                        Sarah Chen
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                          Software
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-semibold whitespace-nowrap">
                        $120.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-amber-100 text-amber-600 text-xs font-bold rounded-full">
                          Pending
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                        Oct 10
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-pawa-navy whitespace-nowrap">
                        James Wilson
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                          Equipment
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-semibold whitespace-nowrap">
                        $1,200.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-xs font-bold rounded-full">
                          Approved
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                        Oct 09
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-pawa-navy whitespace-nowrap">
                        Maria Garcia
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                          Training
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-semibold whitespace-nowrap">
                        $300.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded-full">
                          Rejected
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Retention Overview */}
            <div className="bg-white rounded-xl border border-pawa-border shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-pawa-border">
                <h2 className="text-lg font-bold text-pawa-navy">
                  Retention Overview
                </h2>
              </div>
              <div className="p-6 flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-lg bg-pawa-blue/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-pawa-navy">
                        trending_up
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-pawa-navy">
                        Engineering
                      </p>
                      <p className="text-xs text-slate-500">94% Retention</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-500">
                    Stable
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-amber-600">
                        person_search
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-pawa-navy">
                        Marketing
                      </p>
                      <p className="text-xs text-slate-500">82% Retention</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-amber-500">
                    At Risk
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-lg bg-rose-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-rose-600">
                        group_off
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-pawa-navy">Sales</p>
                      <p className="text-xs text-slate-500">76% Retention</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-rose-500">
                    Critical
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-emerald-600">
                        star
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-pawa-navy">
                        Customer Support
                      </p>
                      <p className="text-xs text-slate-500">98% Retention</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-500">
                    Excellent
                  </span>
                </div>
                <div className="pt-4 mt-auto">
                  <div className="p-4 bg-pawa-navy/5 rounded-xl border border-dashed border-pawa-navy/20">
                    <p className="text-xs text-slate-600 text-center italic">
                      "Average turnover rate is 1.2% lower than the industry
                      benchmark for Q3."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
