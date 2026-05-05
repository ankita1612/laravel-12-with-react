import React, { useEffect, useState } from "react";
import { useToast } from "../contexts/ToastContext";
import apiClient from "../services/api";

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  salary: string;
  dob: string;
}

export const EmployeesPage: React.FC = () => {
  const { addToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/employees");
        if (response.data.success) {
          setEmployees(response.data.data || []);
        }
      } catch (error: any) {
        addToast("Failed to load employees", "error");
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [addToast]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Employees</h2>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-500">Loading employees...</p>
          </div>
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No employees found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition p-6"
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-700 font-bold text-sm">
                    {employee.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                  <p className="text-xs text-gray-400">{employee.position || "No position"}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="font-medium truncate ml-2">{employee.email}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Salary</span>
                  <span className="font-medium text-green-600">
                    ${parseFloat(employee.salary).toLocaleString()}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">DOB</span>
                  <span className="font-medium">
                    {new Date(employee.dob).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
