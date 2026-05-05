import React from 'react';
import type { Employee } from '../types';

interface Props {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeRow: React.FC<Props> = ({ employee, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-12 items-center gap-4 px-6 py-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
      {/* Avatar + Name */}
      <div className="col-span-3 flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <span className="text-purple-700 font-bold text-sm">
            {employee.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate">{employee.name}</p>
          <p className="text-xs text-gray-400 truncate">{employee.email}</p>
        </div>
      </div>

      {/* Position */}
      <div className="col-span-2 min-w-0">
        <span className="inline-block px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium truncate max-w-full">
          {employee.position || '—'}
        </span>
      </div>

      {/* Salary */}
      <div className="col-span-2 text-sm font-semibold text-green-600">
        ${parseFloat(employee.salary).toLocaleString()}
      </div>

      {/* DOB */}
      <div className="col-span-2 text-sm text-gray-500">
        {new Date(employee.dob).toLocaleDateString()}
      </div>

      {/* Hobby */}
      <div className="col-span-2 text-sm text-gray-400 truncate">
        {employee.hobby || '—'}
      </div>

      {/* Actions */}
      <div className="col-span-1 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(employee)}
          title="Edit"
          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(employee)}
          title="Delete"
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};
