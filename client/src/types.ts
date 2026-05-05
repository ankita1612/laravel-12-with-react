// User types
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface AuthError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Employee types
export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string | null;
  salary: string;
  dob: string;
  hobby: string | null;
  description: string | null;
}

export interface EmployeeMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  dob: string;
  salary: string;
  position: string;
  hobby: string;
  description: string;
}

export type SortDir = 'asc' | 'desc';
