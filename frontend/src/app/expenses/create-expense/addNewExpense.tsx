"use client";

import { useState } from "react";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: {
    date: string;
    category: string;
    amount: number;
    description: string;
  }) => void;
}

export function AddExpenseModal({
  isOpen,
  onClose,
  onSubmit,
}: AddExpenseModalProps) {
  const [formData, setFormData] = useState({
    date: "",
    category: "Salaries",
    amount: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
    setFormData({
      date: "",
      category: "Salaries",
      amount: "",
      description: "",
    });
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">
              Log New Expense
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <span className="material-icons-outlined text-[24px]">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue/20 focus:border-pawa-blue transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue/20 focus:border-pawa-blue transition-all appearance-none cursor-pointer"
              >
                <option value="Salaries">Salaries</option>
                <option value="Recruitment">Recruitment</option>
                <option value="Training">Training</option>
                <option value="Welfare">Welfare</option>
                <option value="Engagement">Engagement</option>
                <option value="Systems">Systems</option>
                <option value="Legal">Legal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue/20 focus:border-pawa-blue transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="What was this expense for?"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue/20 focus:border-pawa-blue transition-all resize-none"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#62C3DD] text-white font-medium rounded-lg hover:bg-[#52B3CD] shadow-sm shadow-pawa-blue/20 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-icons-outlined text-[18px]">add</span>
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
