#!/bin/bash
# API Testing Script for Authentication Flow

BASE_URL="http://127.0.0.1:8000/api"

echo "=== Testing Authentication API ==="
echo ""

# Test 1: Registration
echo "1. Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "password_confirmation": "Password123"
  }')

echo "Response: $REGISTER_RESPONSE"
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo ""

# Test 2: Login
echo "2. Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }')

echo "Response: $LOGIN_RESPONSE"
LOGIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $LOGIN_TOKEN"
echo ""

# Test 3: Get Profile (requires auth)
echo "3. Testing Get Profile (authenticated)..."
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $LOGIN_TOKEN")

echo "Response: $PROFILE_RESPONSE"
echo ""

# Test 4: Access Employee API (requires auth)
echo "4. Testing Access to Employee API (authenticated)..."
EMPLOYEE_RESPONSE=$(curl -s -X GET "$BASE_URL/employees" \
  -H "Authorization: Bearer $LOGIN_TOKEN")

echo "Response: $EMPLOYEE_RESPONSE"
echo ""

# Test 5: Try to access Employee API without token
echo "5. Testing Access to Employee API (without token - should fail)..."
EMPLOYEE_FAIL=$(curl -s -X GET "$BASE_URL/employees")

echo "Response: $EMPLOYEE_FAIL"
echo ""

# Test 6: Logout
echo "6. Testing Logout..."
LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $LOGIN_TOKEN")

echo "Response: $LOGOUT_RESPONSE"
echo ""

echo "=== Tests Completed ==="
