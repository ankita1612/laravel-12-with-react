import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { Resolver } from 'react-hook-form';
import * as yup from 'yup';
import type { Employee, EmployeeFormData } from '../types';

const schema = yup.object({
  name:        yup.string().required('Name is required').matches(/^[a-zA-Z\s]*$/, 'Letters and spaces only').max(255),
  email:       yup.string().email('Invalid email').required('Email is required').max(255),
  dob:         yup.string().required('Date of birth is required'),
  salary:      yup.string().required('Salary is required'),
  position:    yup.string().max(255).default(''),
  hobby:       yup.string().max(255).default(''),
  description: yup.string().max(1000).default(''),
});

interface Props {
  isOpen: boolean;
  employee: Employee | null;   // null = Add mode
  onClose: () => void;
  onSave: (data: EmployeeFormData, id?: number) => Promise<void>;
  isSaving: boolean;
}

export const EmployeeModal: React.FC<Props> = ({ isOpen, employee, onClose, onSave, isSaving }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmployeeFormData>({
    resolver: yupResolver(schema) as Resolver<EmployeeFormData>,
  });

  // Populate form when editing
  useEffect(() => {
    if (employee) {
      reset({
        name:        employee.name,
        email:       employee.email,
        dob:         employee.dob?.slice(0, 10) ?? '',
        salary:      employee.salary,
        position:    employee.position ?? '',
        hobby:       employee.hobby ?? '',
        description: employee.description ?? '',
      });
    } else {
      reset({ name: '', email: '', dob: '', salary: '', position: '', hobby: '', description: '' });
    }
  }, [employee, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = (data: EmployeeFormData) => onSave(data, employee?.id);

  const field = (
    label: string,
    name: keyof EmployeeFormData,
    type = 'text',
    required = false,
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...register(name)}
        type={type}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
          errors[name] ? 'border-red-400' : 'border-gray-300'
        }`}
      />
      {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]?.message}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {employee ? 'Edit Employee' : 'Add Employee'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {field('Full Name',  'name',     'text',   true)}
            {field('Email',      'email',    'email',  true)}
            {field('Date of Birth', 'dob',  'date',   true)}
            {field('Salary ($)', 'salary',  'number', true)}
            {field('Position',   'position')}
            {field('Hobby',      'hobby')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none ${
                errors.description ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : employee ? 'Update' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
