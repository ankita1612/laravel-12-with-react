import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';
import apiClient, { initCsrf } from '../services/api';
import { EmployeeRow } from '../components/EmployeeRow';
import { EmployeeModal } from '../components/EmployeeModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import type { Employee, EmployeeFormData, EmployeeMeta, SortDir } from '../types';

// Column definitions for the sortable header
const COLUMNS: { key: string; label: string; sortable: boolean; span: string }[] = [
  { key: 'name',     label: 'Name / Email', sortable: true,  span: 'col-span-3' },
  { key: 'position', label: 'Position',     sortable: true,  span: 'col-span-2' },
  { key: 'salary',   label: 'Salary',       sortable: true,  span: 'col-span-2' },
  { key: 'dob',      label: 'Date of Birth',sortable: true,  span: 'col-span-2' },
  { key: 'hobby',    label: 'Hobby',        sortable: false, span: 'col-span-2' },
  { key: 'actions',  label: '',             sortable: false, span: 'col-span-1' },
];

export const EmployeesPage: React.FC = () => {
  const { addToast } = useToast();

  // Data state
  const [employees, setEmployees]   = useState<Employee[]>([]);
  const [meta, setMeta]             = useState<EmployeeMeta>({ total: 0, per_page: 10, current_page: 1, last_page: 1 });
  const [isLoading, setIsLoading]   = useState(true);

  // Query state
  const [search, setSearch]         = useState('');
  const [sortBy, setSortBy]         = useState('id');
  const [sortDir, setSortDir]       = useState<SortDir>('asc');
  const [page, setPage]             = useState(1);
  const [perPage]                   = useState(10);

  // Modal state
  const [modalOpen, setModalOpen]           = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isSaving, setIsSaving]             = useState(false);
  const [isDeleting, setIsDeleting]         = useState(false);

  // Debounce search
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchEmployees = useCallback(async (
    q: string, sb: string, sd: SortDir, pg: number,
  ) => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/employees', {
        params: { search: q, sort_by: sb, sort_dir: sd, page: pg, per_page: perPage },
      });
      if (res.data.success) {
        setEmployees(res.data.data);
        setMeta(res.data.meta);
      }
    } catch {
      addToast('Failed to load employees', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast, perPage]);

  useEffect(() => {
    fetchEmployees(search, sortBy, sortDir, page);
  }, [fetchEmployees, search, sortBy, sortDir, page]);

  // ─── Search (debounced) ───────────────────────────────────────────────────
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  };

  // ─── Sort ─────────────────────────────────────────────────────────────────
  const handleSort = (col: string) => {
    if (col === sortBy) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
    setPage(1);
  };

  // ─── Add / Edit ───────────────────────────────────────────────────────────
  const handleSave = async (data: EmployeeFormData, id?: number) => {
    setIsSaving(true);
    try {
      await initCsrf();
      if (id) {
        await apiClient.put(`/employees/${id}`, data);
        addToast('Employee updated successfully', 'success');
      } else {
        await apiClient.post('/employees', data);
        addToast('Employee added successfully', 'success');
      }
      setModalOpen(false);
      setEditingEmployee(null);
      fetchEmployees(search, sortBy, sortDir, page);
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Failed to save employee';
      addToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;
    setIsDeleting(true);
    try {
      await initCsrf();
      await apiClient.delete(`/employees/${deletingEmployee.id}`);
      addToast('Employee deleted successfully', 'success');
      setDeletingEmployee(null);
      // Go back a page if last item on page was deleted
      const newPage = employees.length === 1 && page > 1 ? page - 1 : page;
      fetchEmployees(search, sortBy, sortDir, newPage);
      setPage(newPage);
    } catch {
      addToast('Failed to delete employee', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Sort icon ────────────────────────────────────────────────────────────
  const SortIcon = ({ col }: { col: string }) => {
    if (col !== sortBy) return <span className="ml-1 text-gray-300">↕</span>;
    return <span className="ml-1 text-purple-600">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  // ─── Pagination ───────────────────────────────────────────────────────────
  const pages = Array.from({ length: meta.last_page }, (_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-400 mt-0.5">{meta.total} total records</p>
        </div>
        <button
          onClick={() => { setEditingEmployee(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email or position…"
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Header row */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {COLUMNS.map((col) => (
            <div key={col.key} className={col.span}>
              {col.sortable ? (
                <button
                  onClick={() => handleSort(col.key)}
                  className="flex items-center hover:text-purple-600 transition"
                >
                  {col.label}
                  <SortIcon col={col.key} />
                </button>
              ) : (
                col.label
              )}
            </div>
          ))}
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
              <p className="mt-3 text-sm text-gray-400">Loading…</p>
            </div>
          </div>
        ) : employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <svg className="w-10 h-10 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
            <p className="text-sm">No employees found</p>
          </div>
        ) : (
          employees.map((emp) => (
            <EmployeeRow
              key={emp.id}
              employee={emp}
              onEdit={(e) => { setEditingEmployee(e); setModalOpen(true); }}
              onDelete={(e) => setDeletingEmployee(e)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Page {meta.current_page} of {meta.last_page}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ‹ Prev
            </button>
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-sm rounded-lg transition ${
                  p === page
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={page === meta.last_page}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next ›
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <EmployeeModal
        isOpen={modalOpen}
        employee={editingEmployee}
        onClose={() => { setModalOpen(false); setEditingEmployee(null); }}
        onSave={handleSave}
        isSaving={isSaving}
      />
      <DeleteConfirmModal
        employee={deletingEmployee}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingEmployee(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};
