"use client";

import { useState, useEffect } from "react";
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  Department,
} from "../api/api";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        await updateDepartment(editingDepartment, formData as any);
      } else {
        await addDepartment(formData as any);
      }
      setIsModalOpen(false);
      setEditingDepartment(null);
      setFormData({ name: "", description: "" });
      loadDepartments();
    } catch (error) {
      console.error("Error saving department:", error);
    }
  };

  const handleDelete = async (dept: Department) => {
    if (confirm(`Are you sure you want to delete the ${dept.name} department?`)) {
      try {
        await deleteDepartment(dept);
        loadDepartments();
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  };

  const openEditModal = (dept: Department) => {
    setEditingDepartment(dept);
    setFormData({
      name: dept.name,
      description: dept.description || "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-pawa-navy">Departments</h1>
          <p className="text-gray-500">Manage your organization's departments</p>
        </div>
        <button
          onClick={() => {
            setEditingDepartment(null);
            setFormData({ name: "", description: "" });
            setIsModalOpen(true);
          }}
          className="bg-pawa-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-pawa-blue/90 transition-colors"
        >
          <span className="material-icons-outlined">add</span>
          Add Department
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Employees
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {dept.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {dept.description || "No description provided"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {dept.employees?.length || 0}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 text-gray-400">
                    <button
                      onClick={() => openEditModal(dept)}
                      className="hover:text-pawa-blue p-1 rounded-md transition-colors"
                    >
                      <span className="material-icons-outlined !text-[20px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(dept)}
                      className="hover:text-red-500 p-1 rounded-md transition-colors"
                    >
                      <span className="material-icons-outlined !text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                {editingDepartment ? "Edit Department" : "Add Department"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-icons-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">
                  Department Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pawa-blue text-sm min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-pawa-blue rounded-lg hover:bg-pawa-blue/90 transition-colors"
                >
                  {editingDepartment ? "Save Changes" : "Add Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
