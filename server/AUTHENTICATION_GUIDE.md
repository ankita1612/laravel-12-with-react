# Authentication API Documentation

## Overview

This project uses **Laravel Sanctum** for API token-based authentication. All employee API endpoints are protected and require authentication.

## Features Implemented

### 1. **User Authentication (Sanctum)**

- Token-based API authentication
- Personal access tokens for API clients
- Secure token management

### 2. **Authentication Endpoints**

#### Register a New User

**POST** `/api/auth/register`

Request Body:

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "password_confirmation": "SecurePass123"
}
```

Validations:

- Name: Required, letters and spaces only, max 255 characters
- Email: Required, unique, valid email format
- Password: Min 8 characters, must contain uppercase, lowercase, and digits

Response (201 Created):

```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com"
        },
        "token": "1|abcdefghijklmnopqrstuvwxyz..."
    }
}
```

---

#### User Login

**POST** `/api/auth/login`

Request Body:

```json
{
    "email": "john@example.com",
    "password": "SecurePass123"
}
```

Response (200 OK):

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com"
        },
        "token": "1|abcdefghijklmnopqrstuvwxyz..."
    }
}
```

---

#### Get User Profile

**GET** `/api/auth/profile`

Headers:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

Response (200 OK):

```json
{
    "success": true,
    "message": "User profile retrieved successfully",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "created_at": "2026-05-05T10:30:00.000000Z",
        "updated_at": "2026-05-05T10:30:00.000000Z"
    }
}
```

---

#### User Logout

**POST** `/api/auth/logout`

Headers:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

Response (200 OK):

```json
{
    "success": true,
    "message": "Logout successful"
}
```

---

### 3. **Employee API (Protected)**

All employee endpoints require authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

#### List All Employees

**GET** `/api/employees`

Response (200 OK):

```json
{
    "success": true,
    "message": "Employees retrieved successfully",
    "data": [
        {
            "id": 1,
            "name": "Employee Name",
            "email": "employee@example.com",
            "dob": "1990-01-15",
            "salary": "50000.00",
            "hobby": "Reading",
            "description": "Senior Developer",
            "position": "Developer",
            "created_at": "2026-05-05T10:30:00.000000Z",
            "updated_at": "2026-05-05T10:30:00.000000Z",
            "deleted_at": null
        }
    ]
}
```

#### Create Employee

**POST** `/api/employees`

Request Body:

```json
{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "dob": "1995-03-20",
    "salary": "75000.00",
    "hobby": "Painting",
    "description": "Senior Manager",
    "position": "Manager"
}
```

Validations:

- Name: Required, letters and spaces only, max 255 characters
- Email: Required, unique, valid email format
- Date of Birth: Required, must be in the past
- Salary: Required, numeric, min 0, max 999,999,999
- Hobby: Optional, max 255 characters
- Description: Optional, max 1000 characters
- Position: Optional, max 255 characters

Response (201 Created):

```json
{
    "success": true,
    "message": "Employee created successfully",
    "data": {
        "id": 1,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "dob": "1995-03-20",
        "salary": "75000.00",
        "hobby": "Painting",
        "description": "Senior Manager",
        "position": "Manager",
        "created_at": "2026-05-05T10:30:00.000000Z",
        "updated_at": "2026-05-05T10:30:00.000000Z"
    }
}
```

#### Get Employee by ID

**GET** `/api/employees/{id}`

Response (200 OK):

```json
{
    "success": true,
    "message": "Employee retrieved successfully",
    "data": {
        "id": 1,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "dob": "1995-03-20",
        "salary": "75000.00",
        "hobby": "Painting",
        "description": "Senior Manager",
        "position": "Manager",
        "created_at": "2026-05-05T10:30:00.000000Z",
        "updated_at": "2026-05-05T10:30:00.000000Z"
    }
}
```

#### Update Employee

**PUT** or **PATCH** `/api/employees/{id}`

Request Body (all fields optional):

```json
{
    "name": "Jane Doe",
    "salary": "85000.00",
    "position": "Senior Manager"
}
```

Response (200 OK):

```json
{
    "success": true,
    "message": "Employee updated successfully",
    "data": {
        "id": 1,
        "name": "Jane Doe",
        "email": "jane@example.com",
        "dob": "1995-03-20",
        "salary": "85000.00",
        "hobby": "Painting",
        "description": "Senior Manager",
        "position": "Senior Manager",
        "created_at": "2026-05-05T10:30:00.000000Z",
        "updated_at": "2026-05-05T10:30:00.000000Z"
    }
}
```

#### Delete Employee

**DELETE** `/api/employees/{id}`

Response (200 OK):

```json
{
    "success": true,
    "message": "Employee deleted successfully",
    "data": {
        "id": 1,
        "name": "Jane Doe",
        "email": "jane@example.com",
        "dob": "1995-03-20",
        "salary": "85000.00",
        "hobby": "Painting",
        "description": "Senior Manager",
        "position": "Senior Manager",
        "deleted_at": "2026-05-05T10:35:00.000000Z"
    }
}
```

---

## Error Responses

### 401 Unauthorized (No/Invalid Token)

```json
{
    "message": "Unauthenticated."
}
```

### 422 Unprocessable Entity (Validation Failed)

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password field is required."]
    }
}
```

### 500 Internal Server Error

```json
{
    "success": false,
    "message": "Error retrieving employees"
}
```

---

## Security Features

1. **Password Hashing**: Passwords are securely hashed using bcrypt
2. **Token-Based Auth**: Uses Sanctum for stateless API authentication
3. **Middleware Protection**: All employee endpoints require `auth:sanctum` middleware
4. **Input Validation**: Strict validation on all inputs with custom error messages
5. **Error Logging**: All errors are logged for debugging in production
6. **Soft Deletes**: Employees can be soft-deleted (data retained in database)

---

## Testing with cURL

### Register

```bash
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "password_confirmation": "Password123"
  }'
```

### Login

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Get Employees (replace TOKEN with actual token)

```bash
curl -X GET http://127.0.0.1:8000/api/employees \
  -H "Authorization: Bearer TOKEN"
```

### Logout (replace TOKEN with actual token)

```bash
curl -X POST http://127.0.0.1:8000/api/auth/logout \
  -H "Authorization: Bearer TOKEN"
```

---

## Production Checklist

- [ ] Set `APP_ENV=production` in `.env`
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Configure proper database with backups
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set secure Sanctum token expiration in `config/sanctum.php`
- [ ] Configure CORS if needed in `config/cors.php`
- [ ] Set up proper logging and monitoring
- [ ] Configure rate limiting for authentication endpoints
- [ ] Regular security audits
- [ ] Keep Laravel and dependencies updated

---

## File Structure

```
app/
  Http/
    Controllers/
      AuthController.php          # Authentication logic
      EmployeeController.php      # Employee API (protected)
  Models/
    User.php                       # User model with Sanctum trait
    Employee.php                   # Employee model

routes/
  api.php                          # API routes with authentication

database/
  migrations/
    2026_05_05_083609_create_personal_access_tokens_table.php
```

---

## Configuration

### Sanctum Configuration

- Stored in: `config/sanctum.php` (auto-published)
- Token expiration: Configure `SANCTUM_EXPIRATION` in `.env`

### Database

- Personal access tokens stored in: `personal_access_tokens` table
- Users stored in: `users` table

---

## Support

For issues or questions about the authentication system, refer to:

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Laravel Authentication Guide](https://laravel.com/docs/authentication)
