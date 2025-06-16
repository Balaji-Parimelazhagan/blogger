# User Registration Test Report

## 1. UI Registration Attempt
- Navigated to http://localhost:5173
- Clicked **Sign In** and then **Join now**
- Filled registration form:
  - Name: `Test User`
  - Email: `testuser123@example.com`
  - Password: `TestPassword!123`
- Clicked **Register**
- **Result:** Registration failed (UI displayed: `Registration failed`)

## 2. API Test (Swagger Reference: http://localhost:3000/api-docs/#/)
- Endpoint: `POST /users`
- Request Body:
  ```json
  {
    "name": "Test User",
    "email": "testuser123@example.com",
    "password": "TestPassword!123"
  }
  ```
- **Result:** 409 Conflict
- **Response:** `{ "error": "Email already exists" }`

## 3. Database Verification
- Query: `SELECT * FROM users WHERE email = 'testuser123@example.com';`
- **Result:**
  - User exists in DB:
    - id: 8
    - name: Test User
    - email: testuser123@example.com
    - created_at: 2025-05-31T03:18:17.551Z

## 4. Conclusion
- The registration failed because the email `testuser123@example.com` is already registered in the system.
- The backend and database are working as expected for duplicate email prevention.
- To test a successful registration, use a new, unique email address. 