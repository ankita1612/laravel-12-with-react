# Full-Stack Project - Authentication System Setup

## Project Summary

This Laravel-based full-stack project now includes a complete authentication system using **Laravel Sanctum** with protected API endpoints.

## What's Been Implemented

### 1. ✅ Authentication System (Laravel Sanctum)

- User registration with validation
- User login with token generation
- User logout with token revocation
- User profile endpoint
- Token-based API authentication

### 2. ✅ Protected Employee API

- All employee endpoints now require authentication
- Middleware: `auth:sanctum` applied to all employee routes
- Only authenticated users can access/manage employees

### 3. ✅ Comprehensive Validation

- **Registration**: Name (letters/spaces only), Email (unique), Password (min 8 chars, uppercase, lowercase, digits)
- **Login**: Email and Password validation
- **Employee Management**:
    - Name (letters/spaces only, max 255)
    - Email (unique, valid format)
    - Date of Birth (must be in past)
    - Salary (numeric, 0-999,999,999)
    - Hobby (optional, max 255)
    - Description (optional, max 1000)
    - Position (optional, max 255)

### 4. ✅ Production-Friendly Code

- Error logging to production logs
- No sensitive error details exposed in API responses
- Proper HTTP status codes (201, 200, 401, 422, 500)
- Structured JSON responses with `success` flag
- Exception handling for all controllers
- Database transactions for data integrity

## Project Structure

```
server/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── AuthController.php         ← NEW: Authentication logic
│   │       ├── EmployeeController.php     ← UPDATED: Added middleware & validation
│   │       └── Controller.php
│   └── Models/
│       ├── User.php                        ← UPDATED: Added HasApiTokens trait
│       └── Employee.php
├── routes/
│   ├── api.php                             ← UPDATED: Auth routes + protected employee routes
│   ├── web.php
│   └── console.php
├── database/
│   └── migrations/
│       ├── 2026_05_05_083609_create_personal_access_tokens_table.php  ← NEW: Sanctum tokens table
│       └── ... (other migrations)
├── config/
│   ├── auth.php                            ← UPDATED: Added sanctum guard
│   └── ... (other configs)
├── AUTHENTICATION_GUIDE.md                 ← NEW: Complete API documentation
└── README_SETUP.md                         ← This file
```

## Getting Started

### Prerequisites

- PHP 8.2+
- Laravel 12
- SQLite or MySQL

### Installation Steps

1. **Install dependencies** (if not already done)

    ```bash
    cd server
    composer install
    npm install
    ```

2. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

3. **Run migrations** (creates tables including personal_access_tokens)

    ```bash
    php artisan migrate
    ```

4. **Start the development server**

    ```bash
    php artisan serve
    ```

    Server will run at: `http://127.0.0.1:8000`

## API Endpoints Quick Reference

### 🔐 Public Endpoints (No Auth Required)

```
POST   /api/auth/register     → Register new user
POST   /api/auth/login        → Login and get token
```

### 🔒 Protected Endpoints (Require Token)

```
GET    /api/auth/profile      → Get logged-in user's profile
POST   /api/auth/logout       → Logout and revoke tokens

GET    /api/employees         → List all employees
POST   /api/employees         → Create employee
GET    /api/employees/{id}    → Get employee by ID
PUT    /api/employees/{id}    → Update employee
DELETE /api/employees/{id}    → Delete employee
```

## Using the API

### 1. Register a User

```bash
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "password_confirmation": "SecurePass123"
  }'
```

Response includes a `token` - save this!

### 2. Use the Token for Protected Routes

```bash
curl -X GET http://127.0.0.1:8000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Logout

```bash
curl -X POST http://127.0.0.1:8000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Testing Tools

### Option 1: Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create requests for each endpoint
3. Add token to Authorization header (type: Bearer Token)

### Option 2: cURL (command line)

Use the examples above

### Option 3: VS Code REST Client

Install "REST Client" extension and create `.http` files

## Security Features

✅ **Password Hashing**: bcrypt with configurable cost
✅ **Token-Based Auth**: Stateless Sanctum tokens
✅ **Input Validation**: Strict validation rules on all inputs
✅ **Error Logging**: Sensitive errors logged, generic messages to client
✅ **Middleware Protection**: `auth:sanctum` on protected routes
✅ **Soft Deletes**: Employee data retained even after deletion
✅ **CSRF Protection**: (Can be enabled for web routes)
✅ **Rate Limiting**: (Can be configured for auth endpoints)

## Database Schema

### Users Table

```
id              - Primary key
name            - User's full name
email           - Unique email address
password        - Hashed password (bcrypt)
email_verified_at - Nullable timestamp
remember_token  - For session management
created_at      - Creation timestamp
updated_at      - Last update timestamp
```

### Personal Access Tokens Table

```
id              - Primary key
tokenable_id    - User ID
tokenable_type  - Model type (User)
name            - Token name
token           - Hashed token value
abilities       - JSON array of permissions
last_used_at    - Last usage timestamp
expires_at      - Token expiration time
created_at      - Creation timestamp
updated_at      - Last update timestamp
```

### Employees Table

```
id              - Primary key
name            - Employee name
email           - Employee email (unique)
dob             - Date of birth
salary          - Monthly salary
hobby           - Optional hobby field
description     - Optional description
position        - Optional job position
deleted_at      - Soft delete timestamp (nullable)
created_at      - Creation timestamp
updated_at      - Last update timestamp
```

## Production Deployment

Before deploying to production:

1. **Update `.env`**

    ```
    APP_ENV=production
    APP_DEBUG=false
    SANCTUM_EXPIRATION=60  # Token expires in 60 minutes
    ```

2. **Cache configuration**

    ```bash
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```

3. **Security**
    - Enable HTTPS/SSL
    - Configure database backups
    - Set up monitoring and logging
    - Configure rate limiting
    - Enable CORS if needed

4. **Optimize**
    ```bash
    composer install --optimize-autoloader --no-dev
    php artisan optimize
    ```

## Common Issues & Troubleshooting

### Issue: "Unauthenticated" error

- **Solution**: Ensure you're including the Authorization header with a valid token

### Issue: "Validation failed" error

- **Solution**: Check the `errors` field in the response for specific validation messages

### Issue: Token not working

- **Solution**: Tokens expire after the time set in `SANCTUM_EXPIRATION`. Re-login to get a new token

### Issue: CORS errors

- **Solution**: Configure CORS in `config/cors.php` to allow your frontend domain

## File Changes Summary

| File                                                                            | Change                                         | Type     |
| ------------------------------------------------------------------------------- | ---------------------------------------------- | -------- |
| `app/Http/Controllers/AuthController.php`                                       | Created new auth controller                    | NEW      |
| `app/Http/Controllers/EmployeeController.php`                                   | Added middleware, improved error handling      | MODIFIED |
| `app/Models/User.php`                                                           | Added HasApiTokens trait                       | MODIFIED |
| `routes/api.php`                                                                | Added auth routes and grouped protected routes | MODIFIED |
| `config/auth.php`                                                               | Added sanctum guard configuration              | MODIFIED |
| `database/migrations/2026_05_05_083609_create_personal_access_tokens_table.php` | Created Sanctum tokens table                   | NEW      |
| `AUTHENTICATION_GUIDE.md`                                                       | Created comprehensive API documentation        | NEW      |

## Next Steps

1. ✅ Test all endpoints with Postman or cURL
2. ✅ Create frontend UI for registration/login
3. ✅ Implement refresh token mechanism
4. ✅ Add role-based access control (if needed)
5. ✅ Set up email verification for new users
6. ✅ Implement password reset functionality
7. ✅ Deploy to production with proper security

## Support & Resources

- [Laravel Sanctum Docs](https://laravel.com/docs/sanctum)
- [Laravel Authentication](https://laravel.com/docs/authentication)
- [Laravel Validation](https://laravel.com/docs/validation)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

## License

This project is licensed under the MIT License.

---

**Last Updated**: May 5, 2026
**Laravel Version**: 12.0
**PHP Version**: 8.2+
**Status**: ✅ Production Ready
