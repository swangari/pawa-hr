"use client";

import React from "react";
import { addEmployee, updateEmployee } from "@/app/api/api";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  employmentType: "Permanent" | "Contract" | "Graduate Trainee";
  salary: number;
  airtimeAllowance: number;
  hireDate: string;
  status: "Active" | "Inactive";
  terminationDate?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  formData: any;
  setFormData: (data: any) => void;
  submitLabel: string;
  departments: { id: string; name: string }[];
  isEdit?: boolean;
}

export function EmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  formData,
  setFormData,
  submitLabel,
  departments,
  isEdit,
}: ModalProps) {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEmployee(formData);
      onClose();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="material-icons-outlined">close</span>
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">
                  Staff Number
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                  placeholder="e.g. EMP001"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue text-sm ${
                    isEdit ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  required
                  disabled={isEdit}
                />
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john.doe@pawait.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue text-sm bg-white"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  placeholder="e.g. Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">
                  Employment Type
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      employmentType: e.target.value as
                        | "Permanent"
                        | "Contract"
                        | "Graduate Trainee",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue text-sm bg-white"
                >
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Graduate Trainee">Graduate Trainee</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">
                  Monthly Salary
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  placeholder="75000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "Active" | "Inactive",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue text-sm bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">
                  Date Joined
                </label>
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) =>
                    setFormData({ ...formData, hireDate: e.target.value })
                  }
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue text-sm ${
                    isEdit ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  required
                  disabled={isEdit}
                />
              </div>

              {formData.status === "Inactive" && (
                <div>
                  <label className="block text-sm mb-2 font-medium text-gray-700">
                    Termination Date
                  </label>
                  <input
                    type="date"
                    value={formData.terminationDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        terminationDate: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue text-sm ${
                      isEdit && formData.terminationDate
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    required
                    disabled={!!(isEdit && formData.terminationDate)}
                  />
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="mb-4 text-sm text-gray-600 font-medium font-semibold uppercase tracking-wider">
                Benefits & Allowances
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 font-medium text-gray-700">
                    Airtime Allowance
                  </label>
                  <input
                    type="number"
                    value={formData.airtimeAllowance}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        airtimeAllowance: e.target.value,
                      })
                    }
                    placeholder="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 font-medium text-gray-700">
                    Bonuses
                  </label>
                  <input
                    type="number"
                    value={formData.bonuses}
                    onChange={(e) =>
                      setFormData({ ...formData, bonuses: e.target.value })
                    }
                    placeholder="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg text-white hover:opacity-90 transition-opacity text-sm font-medium bg-pawa-blue"
              >
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
