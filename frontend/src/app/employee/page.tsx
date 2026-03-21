"use client";

import { useState, useEffect } from "react";
import { Employee, EmployeeModal } from "./new-employee/addNewEmployee";
import {
  fetchEmployees,
  addEmployee,
  updateEmployee,
  fetchDepartments,
  Department,
} from "../api/api";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "Engineering",
    role: "",
    employmentType: "Permanent" as "Permanent" | "Contract" | "Intern",
    salary: "",
    airtimeAllowance: "",
    statutoryDeductions: "",
    bonuses: "",
    hireDate: "",
    status: "Active" as "Active" | "Inactive",
    terminationDate: "",
  });

  // Consolidated Escape key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedEmployee(null);
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const mapEmployeeData = (emp: any) => ({
    id: emp.id,
    name: emp.name,
    email: emp.email,
    department: emp.department_name || "Engineering",
    role: emp.role || "",
    employmentType:
      emp.contract_type?.toLowerCase() === "permanent"
        ? "Permanent"
        : emp.contract_type?.toLowerCase() === "intern"
          ? "Intern"
          : "Contract",
    salary: emp.salary || 0,
    airtimeAllowance: emp.airtime_allowance || 0,
    hireDate: emp.hire_date || emp.created_at || new Date().toISOString(),
    status: emp.is_active ? "Active" : "Inactive",
    terminationDate: emp.termination_date || emp.updated_at,
  });

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (e) {
      return "";
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [empData, deptData] = await Promise.all([
          fetchEmployees(),
          fetchDepartments(),
        ]);

        const mappedData = empData.map(mapEmployeeData);
        setEmployees(mappedData as any);
        setDepartments(deptData as any);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadData();
  }, []);

  const updateEmployees = async () => {
    try {
      const data = await fetchEmployees();
      const mappedData = data.map(mapEmployeeData);
      setEmployees(mappedData as any);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Calculate metrics
  const totalHeadcount = employees.length;
  const activeEmployees = employees.filter(
    (emp) => emp.status === "Active",
  ).length;
  const permanentEmployees = employees.filter(
    (emp) => emp.employmentType === "Permanent" && emp.status === "Active",
  ).length;
  const contractEmployees = employees.filter(
    (emp) => emp.employmentType === "Contract" && emp.status === "Active",
  ).length;

  // Calculate average tenure in years
  const calculateTenure = (emp: Employee) => {
    const start = new Date(emp.hireDate);
    const end =
      emp.status === "Inactive" && emp.terminationDate
        ? new Date(emp.terminationDate)
        : new Date();
    const years =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return years;
  };

  const totalTenure = employees.reduce(
    (sum, emp) => sum + calculateTenure(emp),
    0,
  );
  const averageTenure =
    employees.length > 0 ? totalTenure / employees.length : 0;

  const retentionRate =
    totalHeadcount > 0 ? (activeEmployees / totalHeadcount) * 100 : 0;

  const totalPayroll = employees
    .filter((emp) => emp.status === "Active")
    .reduce((sum, emp) => sum + emp.salary + emp.airtimeAllowance, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dept = departments.find((d) => d.name === formData.department);
    const newEmployee = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      dept_id: dept?.id || "765f279e-1674-439d-81a7-0019754d9c39", 
      contract_type: formData.employmentType.toLowerCase(),
      salary: Number(formData.salary),
      airtime_allowance: Number(formData.airtimeAllowance),
      hire_date: formData.hireDate
        ? new Date(formData.hireDate).toISOString()
        : new Date().toISOString(),
      is_active: formData.status === "Active",
      ...(formData.status === "Inactive" && formData.terminationDate
        ? { termination_date: new Date(formData.terminationDate).toISOString() }
        : {}),
    };

    try {
      await addEmployee(newEmployee as any);
      await updateEmployees();
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add employee:", error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEmployee) return;

    const dept = departments.find((d) => d.name === formData.department);
    const updatedEmployeeData = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      dept_id: dept?.id || "765f279e-1674-439d-81a7-0019754d9c39",
      contract_type: formData.employmentType.toLowerCase(),
      salary: Number(formData.salary),
      airtime_allowance: Number(formData.airtimeAllowance),
      hire_date: formData.hireDate
        ? new Date(formData.hireDate).toISOString()
        : editingEmployee.hireDate,
      is_active: formData.status === "Active",
      ...(formData.status === "Inactive" &&
      formData.terminationDate &&
      !editingEmployee.terminationDate
        ? { termination_date: new Date(formData.terminationDate).toISOString() }
        : {}),
    };

    try {
      await updateEmployee(editingEmployee as any, updatedEmployeeData as any);
      await updateEmployees();
      resetForm();
      setIsEditModalOpen(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      department: "Engineering",
      role: "",
      employmentType: "Permanent",
      salary: "",
      airtimeAllowance: "",
      statutoryDeductions: "",
      bonuses: "",
      hireDate: "",
      status: "Active",
      terminationDate: "",
    });
  };

  const getEmploymentTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Permanent":
        return "bg-blue-100 text-blue-700";
      case "Contract":
        return "bg-orange-100 text-orange-700";
      case "Intern":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-pawa-navy">Employees</h1>
        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="px-6 py-2 rounded-lg text-white flex items-center gap-2 hover:opacity-90 transition-opacity bg-pawa-blue"
        >
          <span className="material-icons-outlined">person_add</span>
          Add New Employee
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <span className="material-icons-outlined text-sm">groups</span>
            <span className="text-sm font-medium uppercase tracking-wider">
              Active Employees
            </span>
          </div>
          <div className="text-4xl font-bold text-pawa-navy">
            {activeEmployees}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {totalHeadcount - activeEmployees} Inactive
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <span className="material-icons-outlined text-sm">how_to_reg</span>
            <span className="text-sm font-medium uppercase tracking-wider">
              Retention Rate
            </span>
          </div>
          <div className="text-4xl font-bold text-pawa-navy">
            {retentionRate.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {permanentEmployees} Permanent • {contractEmployees} Contract
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <span className="material-icons-outlined text-sm">history</span>
            <span className="text-sm font-medium uppercase tracking-wider">
              Average Tenure
            </span>
          </div>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-bold text-pawa-navy">
              {averageTenure.toFixed(1)}
            </div>
            <div className="text-gray-400 mb-1 font-medium">years</div>
          </div>
          <div className="text-sm text-gray-400 mt-1">All employees</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <span className="material-icons-outlined text-sm">trending_up</span>
            <span className="text-sm font-medium uppercase tracking-wider">
              Active Payroll
            </span>
          </div>
          <div className="text-4xl font-bold text-pawa-navy">
            KES {(totalPayroll / 1000000).toFixed(2)}M
          </div>
          <div className="text-sm text-gray-400 mt-1">Monthly commitment</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Employment Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  onClick={() => setSelectedEmployee(employee)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">
                    {employee.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-pawa-navy">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {employee.role}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getEmploymentTypeBadgeColor(employee.employmentType)}`}
                    >
                      {employee.employmentType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        employee.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    KES {(employee.salary || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEmployee && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-all"
            onClick={() => setSelectedEmployee(null)}
          ></div>
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-pawa-navy">
                  Employee Details
                </h2>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="material-icons-outlined">close</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Profile/ID Section */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Employee ID
                    </div>
                    <div className="text-sm font-medium text-pawa-navy">
                      {selectedEmployee.id}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Status
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedEmployee.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedEmployee.status}
                    </span>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Name
                    </div>
                    <div className="text-sm font-medium text-pawa-navy">
                      {selectedEmployee.name}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Email
                    </div>
                    <div className="text-sm font-medium text-pawa-navy">
                      {selectedEmployee.email}
                    </div>
                  </div>
                </div>

                {/* Work Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Role
                    </div>
                    <div className="text-sm font-medium text-pawa-navy">
                      {selectedEmployee.role}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Department
                    </div>
                    <div className="text-sm font-medium text-pawa-navy">
                      {selectedEmployee.department}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Employment Type
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEmploymentTypeBadgeColor(selectedEmployee.employmentType)}`}
                    >
                      {selectedEmployee.employmentType}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Date Joined
                    </div>
                    <div className="text-sm font-medium text-pawa-navy">
                      {new Date(selectedEmployee.hireDate).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </div>
                  </div>
                </div>

                {/* Conditional Tenure/Termination */}
                <div className="grid grid-cols-2 gap-6">
                  {selectedEmployee.status === "Inactive" &&
                  selectedEmployee.terminationDate ? (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Termination Date
                      </div>
                      <div className="text-sm font-medium text-pawa-navy">
                        {new Date(
                          selectedEmployee.terminationDate,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Tenure
                      </div>
                      <div className="text-sm font-medium text-pawa-navy">
                        {calculateTenure(selectedEmployee).toFixed(1)} years
                      </div>
                    </div>
                  )}
                </div>

                {/* Compensation Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Compensation Details
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Salary</span>
                      <span className="text-sm font-medium text-pawa-navy">
                        KES {(selectedEmployee.salary || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Airtime Allowance</span>
                      <span className="text-sm font-medium text-pawa-navy">
                        KES {selectedEmployee.airtimeAllowance}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="font-semibold text-pawa-navy">
                          Total Monthly Compensation
                        </span>
                        <span className="text-sm font-bold text-pawa-blue">
                          KES
                          {(
                            (selectedEmployee.salary || 0) +
                            (selectedEmployee.airtimeAllowance || 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedEmployee(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        name: selectedEmployee.name,
                        email: selectedEmployee.email,
                        department: selectedEmployee.department,
                        employmentType: selectedEmployee.employmentType,
                        salary: String(selectedEmployee.salary),
                        airtimeAllowance: String(
                          selectedEmployee.airtimeAllowance,
                        ),
                        statutoryDeductions: "",
                        bonuses: "",
                        hireDate: formatDateForInput(selectedEmployee.hireDate),
                        role: selectedEmployee.role,
                        status: selectedEmployee.status,
                        terminationDate: formatDateForInput(
                          selectedEmployee.terminationDate,
                        ),
                      });
                      setEditingEmployee(selectedEmployee);
                      setSelectedEmployee(null);
                      setIsEditModalOpen(true);
                    }}
                    className="flex-1 py-2 rounded-lg text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 bg-pawa-blue text-sm font-medium"
                  >
                    <span className="material-icons-outlined text-[18px]">
                      edit
                    </span>
                    Edit Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <EmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmit}
        title="Add New Employee"
        formData={formData}
        setFormData={setFormData}
        submitLabel="Add Employee"
        departments={departments}
        isEdit={false}
      />

      <EmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        title="Edit Employee"
        formData={formData}
        setFormData={setFormData}
        submitLabel="Update Employee"
        departments={departments}
        isEdit={true}
      />
    </div>
  );
}
