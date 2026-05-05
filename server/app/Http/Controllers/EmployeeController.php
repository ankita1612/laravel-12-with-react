<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EmployeeController extends Controller
{
    /**
     * Display a listing of all employees.
     */
    public function index()
    {
        try {
            $employees = Employee::all();
            return response()->json([
                'success' => true,
                'message' => 'Employees retrieved successfully',
                'data' => $employees,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            \Log::error('Error retrieving employees: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving employees',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created employee.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
                'email' => 'required|email|unique:employees,email',
                'dob' => 'required|date|before:today',
                'salary' => 'required|numeric|min:0|max:999999999',
                'hobby' => 'nullable|string|max:255',
                'description' => 'nullable|string|max:1000',
                'position' => 'nullable|string|max:255',
            ], [
                'name.regex' => 'The name field can only contain letters and spaces.',
                'dob.before' => 'The date of birth must be in the past.',
            ]);

            $employee = Employee::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Employee created successfully',
                'data' => $employee,
            ], Response::HTTP_CREATED);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            \Log::error('Error creating employee: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error creating employee',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified employee.
     */
    public function show(Employee $employee)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Employee retrieved successfully',
                'data' => $employee,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            \Log::error('Error retrieving employee: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving employee',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified employee.
     */
    public function update(Request $request, Employee $employee)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255|regex:/^[a-zA-Z\s]*$/',
                'email' => 'sometimes|required|email|unique:employees,email,' . $employee->id,
                'dob' => 'sometimes|required|date|before:today',
                'salary' => 'sometimes|required|numeric|min:0|max:999999999',
                'hobby' => 'nullable|string|max:255',
                'description' => 'nullable|string|max:1000',
                'position' => 'nullable|string|max:255',
            ], [
                'name.regex' => 'The name field can only contain letters and spaces.',
                'dob.before' => 'The date of birth must be in the past.',
            ]);

            $employee->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Employee updated successfully',
                'data' => $employee,
            ], Response::HTTP_OK);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            \Log::error('Error updating employee: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating employee',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified employee (soft delete).
     */
    public function destroy(Employee $employee)
    {
        try {
            $employee->delete();

            return response()->json([
                'success' => true,
                'message' => 'Employee deleted successfully',
                'data' => $employee,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            \Log::error('Error deleting employee: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting employee',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
