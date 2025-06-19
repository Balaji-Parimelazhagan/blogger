# User Profile Feature — AI-Assisted TDD Task List

## 1. Project Setup
- [ ] Confirm test framework (Jest) and test directory (e.g., `backend/tests/`)
- [ ] Ensure test database/config is available and isolated from production

## 2. Test-Driven Development: Write Failing Tests
- [ ] Create a test file for user profile (e.g., `backend/tests/userProfile.test.js`)
- [ ] Write tests for:
  - [ ] Viewing a user profile (`GET /api/users/:id`)
    - [ ] Success: returns correct user data
    - [ ] User not found
    - [ ] Unauthorized access (if applicable)
  - [ ] Updating a user profile (`PUT /api/users/:id`)
    - [ ] Success: updates name, bio, etc.
    - [ ] Invalid data (e.g., empty name)
    - [ ] Unauthorized update (wrong user)
    - [ ] User not found
  - [ ] Changing avatar (`PATCH /api/users/:id/avatar`)
    - [ ] Success: updates avatar_url
    - [ ] Invalid file/type/URL
    - [ ] Unauthorized
    - [ ] User not found
- [ ] Add edge case tests (e.g., SQL injection, XSS in bio)
- [ ] Run tests and confirm all fail (red)

## 3. Implement Minimal Code to Pass Tests
- [ ] Create/update user controller methods for:
  - [ ] `getUserProfile`
  - [ ] `updateUserProfile`
  - [ ] `changeUserAvatar`
- [ ] Add/modify routes in Express (e.g., `routes/user.js`)
- [ ] Implement service/model logic as needed
- [ ] Run tests and make them pass (green)

## 4. Refactor with AI Assistance
- [ ] Refactor controller/service/model code for readability and maintainability
- [ ] Add JSDoc/TSDoc comments for public functions
- [ ] Ensure code style matches Prettier/ESLint rules

## 5. Add Integration & End-to-End Tests
- [ ] Write integration tests for user profile endpoints (API-level)
- [ ] Test with real HTTP requests (e.g., using supertest)
- [ ] Add tests for authentication/authorization flows

## 6. Measure Coverage and Quality
- [ ] Run `jest --coverage` (or equivalent) to measure test coverage
- [ ] Ensure 90%+ coverage for user profile code
- [ ] Review for maintainability, readability, and security (sanitize inputs, etc.)

## 7. Success Criteria
- [ ] All tests pass (unit + integration)
- [ ] 90%+ test coverage
- [ ] Code is maintainable, readable, and secure

---

**Optional:**
- [ ] Add OpenAPI/Swagger docs for the new endpoints
- [ ] Add frontend integration (if applicable) 