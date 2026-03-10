"use client";

import { useState } from "react";
import { Employee, EmployeeModal } from "./new-employee/addNewEmployee";

const employeesData: Employee[] = [
  {
    id: "EMP001",
    name: "Sarah Johnson",
    email: "sarah.johnson@pawait.com",
    department: "Engineering",
    employmentType: "Permanent",
    salary: 95000,
    airtimeAllowance: 50,
    hireDate: "2022-01-15",
    status: "Active",
  },
  {
    id: "EMP002",
    name: "Michael Chen",
    email: "michael.chen@pawait.com",
    department: "Sales",
    employmentType: "Permanent",
    salary: 78000,
    airtimeAllowance: 50,
    hireDate: "2021-08-22",
    status: "Active",
  },
  {
    id: "EMP003",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@pawait.com",
    department: "Marketing",
    employmentType: "Contract",
    salary: 65000,
    airtimeAllowance: 50,
    hireDate: "2023-03-10",
    status: "Inactive",
    terminationDate: "2025-12-15",
  },
  {
    id: "EMP004",
    name: "David Kim",
    email: "david.kim@pawait.com",
    department: "Engineering",
    employmentType: "Permanent",
    salary: 105000,
    airtimeAllowance: 50,
    hireDate: "2020-11-05",
    status: "Active",
  },
  {
    id: "EMP005",
    name: "Amanda Foster",
    email: "amanda.foster@pawait.com",
    department: "HR",
    employmentType: "Permanent",
    salary: 72000,
    airtimeAllowance: 50,
    hireDate: "2022-06-18",
    status: "Active",
  },
  {
    id: "EMP006",
    name: "James Wilson",
    email: "james.wilson@pawait.com",
    department: "Finance",
    employmentType: "Permanent",
    salary: 88000,
    airtimeAllowance: 50,
    hireDate: "2021-04-12",
    status: "Active",
  },
  {
    id: "EMP007",
    name: "Lisa Thompson",
    email: "lisa.thompson@pawait.com",
    department: "Marketing",
    employmentType: "Intern",
    salary: 35000,
    airtimeAllowance: 25,
    hireDate: "2025-09-01",
    status: "Active",
  },
  {
    id: "EMP008",
    name: "Robert Martinez",
    email: "robert.martinez@pawait.com",
    department: "Sales",
    employmentType: "Contract",
    salary: 70000,
    airtimeAllowance: 50,
    hireDate: "2023-07-20",
    status: "Inactive",
    terminationDate: "2026-01-30",
  },
  {
    id: "EMP009",
    name: "Jennifer Lee",
    email: "jennifer.lee@pawait.com",
    department: "Engineering",
    employmentType: "Permanent",
    salary: 98000,
    airtimeAllowance: 50,
    hireDate: "2022-02-28",
    status: "Active",
  },
  {
    id: "EMP010",
    name: "Christopher Davis",
    email: "christopher.davis@pawait.com",
    department: "HR",
    employmentType: "Permanent",
    salary: 68000,
    airtimeAllowance: 50,
    hireDate: "2023-01-09",
    status: "Active",
  },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(employeesData);
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
    employmentType: "Permanent" as "Permanent" | "Contract" | "Intern",
    salary: "",
    airtimeAllowance: "",
    statutoryDeductions: "",
    bonuses: "",
    hireDate: "",
    status: "Active" as "Active" | "Inactive",
    terminationDate: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate new employee ID
    const maxId = Math.max(
      ...employees.map((emp) => parseInt(emp.id.replace("EMP", ""))),
    );
    const newId = `EMP${String(maxId + 1).padStart(3, "0")}`;

    const newEmployee: Employee = {
      id: newId,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      employmentType: formData.employmentType,
      salary: Number(formData.salary),
      airtimeAllowance: Number(formData.airtimeAllowance),
      hireDate: formData.hireDate,
      status: formData.status,
      ...(formData.status === "Inactive" && formData.terminationDate
        ? { terminationDate: formData.terminationDate }
        : {}),
    };

    setEmployees([...employees, newEmployee]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEmployee) return;

    const updatedEmployee: Employee = {
      id: editingEmployee.id,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      employmentType: formData.employmentType,
      salary: Number(formData.salary),
      airtimeAllowance: Number(formData.airtimeAllowance),
      hireDate: formData.hireDate,
      status: formData.status,
      ...(formData.status === "Inactive" && formData.terminationDate
        ? { terminationDate: formData.terminationDate }
        : {}),
    };

    setEmployees(
      employees.map((emp) =>
        emp.id === editingEmployee.id ? updatedEmployee : emp,
      ),
    );
    resetForm();
    setIsEditModalOpen(false);
    setEditingEmployee(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      department: "Engineering",
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
            ${(totalPayroll / 1000000).toFixed(2)}M
          </div>
          <div className="text-sm text-gray-400 mt-1">Annual commitment</div>
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
                    ${employee.salary.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setSelectedEmployee(null)}
          ></div>

          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEmployee(null)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Employee ID
                    </div>
                    <div className="text-lg font-medium text-pawa-navy">
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

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Name
                    </div>
                    <div className="text-lg font-medium text-pawa-navy">
                      {selectedEmployee.name}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Email
                    </div>
                    <div className="text-lg font-medium text-pawa-navy">
                      {selectedEmployee.email}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Department
                    </div>
                    <div className="text-lg font-medium text-pawa-navy">
                      {selectedEmployee.department}
                    </div>
                  </div>

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
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Date Joined
                    </div>
                    <div className="text-lg font-medium text-pawa-navy">
                      {new Date(selectedEmployee.hireDate).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </div>
                  </div>

                  {selectedEmployee.status === "Inactive" &&
                    selectedEmployee.terminationDate && (
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Termination Date
                        </div>
                        <div className="text-lg font-medium text-pawa-navy">
                          {new Date(
                            selectedEmployee.terminationDate,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    )}

                  {selectedEmployee.status === "Active" && (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Tenure
                      </div>
                      <div className="text-lg font-medium text-pawa-navy">
                        {calculateTenure(selectedEmployee).toFixed(1)} years
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Compensation Details
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Salary</span>
                      <span className="text-lg font-medium text-pawa-navy">
                        ${selectedEmployee.salary.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Airtime Allowance</span>
                      <span className="text-lg font-medium text-pawa-navy">
                        ${selectedEmployee.airtimeAllowance}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="font-semibold text-pawa-navy">
                          Total Annual Compensation
                        </span>
                        <span className="text-xl font-bold text-pawa-blue">
                          $
                          {(
                            selectedEmployee.salary +
                            selectedEmployee.airtimeAllowance
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

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
                        hireDate: selectedEmployee.hireDate,
                        status: selectedEmployee.status,
                        terminationDate: selectedEmployee.terminationDate || "",
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
      />

      <EmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        title="Edit Employee"
        formData={formData}
        setFormData={setFormData}
        submitLabel="Update Employee"
      />
    </div>
  );
}
