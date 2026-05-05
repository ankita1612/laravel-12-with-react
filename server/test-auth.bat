@echo off
REM API Testing Script for Authentication Flow

setlocal enabledelayedexpansion
set BASE_URL=http://127.0.0.1:8000/api

echo === Testing Authentication API ===
echo.

REM Test 1: Registration
echo 1. Testing User Registration...
curl -s -X POST "%BASE_URL%/auth/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"John Doe\", \"email\": \"john@example.com\", \"password\": \"Password123\", \"password_confirmation\": \"Password123\"}"
echo.
echo.

REM Test 2: Login
echo 2. Testing User Login...
curl -s -X POST "%BASE_URL%/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"john@example.com\", \"password\": \"Password123\"}"
echo.
echo.

REM Note: For complete testing with token, use Postman or similar tool
echo === Tests Completed ===
