# Bloggr Test Case Task List

This is a living document for QA test cases, based on the current PRD, database schema, and API specification. Update as features evolve.

---

## Users

### TC-001: User Registration
- **Title:** Register a new user
- **User Story:** As a writer, I want to register so I can create and publish posts. ([PRD](docs/PROJECT.md#user-stories--flows))
- **Test Objective:** Validate user registration with valid and invalid data.
- **Preconditions:** None
- **Test Steps:**
  1. Send POST /users with valid name, email, and password.
  2. Attempt registration with missing/invalid fields.
  3. Attempt registration with duplicate email.
- **Expected Result:**
  - 201 Created for valid input.
  - 400 Bad Request for invalid input.
  - 409 Conflict for duplicate email.
- **Related Backend Task(s):** Endpoint: POST /users
- **Test Type:** API, Integration
- **Priority:** High
- **Complexity or Story Points:** 2
- **Suggested Tools/Frameworks:** Jest, Supertest, Postman

### TC-002: Get User Profile
- **Title:** Retrieve user profile by ID
- **User Story:** As a reader, I want to view author profiles. ([PRD](docs/PROJECT.md#user-stories--flows))
- **Test Objective:** Ensure user profile is retrievable and does not expose sensitive data.
- **Preconditions:** User exists in DB
- **Test Steps:**
  1. Send GET /users/{id} for a valid user.
  2. Send GET /users/{id} for a non-existent user.
- **Expected Result:**
  - 200 OK with user data (no password hash).
  - 404 Not Found for invalid ID.
- **Related Backend Task(s):** Endpoint: GET /users/{id}
- **Test Type:** API, Integration
- **Priority:** Medium
- **Complexity or Story Points:** 1
- **Suggested Tools/Frameworks:** Jest, Supertest, Postman

### TC-003: Update User Profile
- **Title:** Update own user profile
- **User Story:** As a returning user, I want to update my profile. ([PRD](docs/PROJECT.md#user-stories--flows))
- **Test Objective:** Validate profile update and authorization.
- **Preconditions:** User is authenticated (JWT)
- **Test Steps:**
  1. Send PUT /users/{id} as self with valid data.
  2. Attempt update as another user.
  3. Attempt update with invalid data.
- **Expected Result:**
  - 200 OK for valid self-update.
  - 401/403 for unauthorized access.
  - 400 for invalid data.
- **Related Backend Task(s):** Endpoint: PUT /users/{id}
- **Test Type:** API, Integration
- **Priority:** Medium
- **Complexity or Story Points:** 2
- **Suggested Tools/Frameworks:** Jest, Supertest, Postman

---

## Blog Posts

### TC-010: Create Blog Post
- **Title:** Create a new blog post (draft or published)
- **User Story:** As a writer, I want to create and save/publish posts. ([PRD](docs/PROJECT.md#user-stories--flows))
- **Test Objective:** Validate post creation, required fields, and authentication.
- **Preconditions:** User is authenticated (JWT)
- **Test Steps:**
  1. Send POST /posts with valid title/content.
  2. Attempt with missing/invalid fields.
  3. Attempt without authentication.
- **Expected Result:**
  - 201 Created for valid input.
  - 400 Bad Request for invalid input.
  - 401 Unauthorized if not logged in.
- **Related Backend Task(s):** Endpoint: POST /posts
- **Test Type:** API, Integration
- **Priority:** High
- **Complexity or Story Points:** 2
- **Suggested Tools/Frameworks:** Jest, Supertest, Postman

### TC-011: List Blog Posts
- **Title:** List published blog posts
- **User Story:** As a reader, I want to browse published posts. ([PRD](docs/PROJECT.md#user-stories--flows))
- **Test Objective:** Validate listing, filtering, pagination, and sorting.
- **Preconditions:** At least one published post exists
- **Test Steps:**
  1. Send GET /posts with/without filters (author_id, published, pagination).
  2. Check sorting by created_at.
- **Expected Result:**
  - 200 OK with array of posts.
  - 400 Bad Request for invalid params.
- **Related Backend Task(s):** Endpoint: GET /posts
- **Test Type:** API, Integration
- **Priority:** High
- **Complexity or Story Points:** 2
- **Suggested Tools/Frameworks:** Jest, Supertest, Postman

### TC-012: Get Blog Post by ID
- **Title:** Retrieve a single blog post by ID
- **User Story:** As a reader, I want to read a full blog post. ([PRD](docs/PROJECT.md#user-stories--flows))
- **Test Objective:** Validate retrieval, access control for drafts.
- **Preconditions:** Post exists in DB
- **Test Steps:**
  1. Send GET /posts/{id} for published post.
  2. Send GET /posts/{id} for draft as author.
  3. Send GET /posts/{id} for draft as non-author.
- **Expected Result:**
  - 200 OK for published or own draft.
  - 403/404 for unauthorized or non-existent post.
- **Related Backend Task(s):** Endpoint: GET /posts/{id}
- **Test Type:** API, Integration
- **Priority:** High
- **Complexity or Story Points:** 2
- **Suggested Tools/Frameworks:** Jest, Supertest, Postman

### TC-013: Update Blog Post
- **Title:** Update a blog post (author only)
- **User Story:** As a writer, I want to edit my posts. ([PRD](docs/PROJECT.md#user-stories--flows))
- **Test Objective:** Validate update, authorization, and field validation.
- **Preconditions:** User is authenticated and is the author
- **Test Steps:**
  1. Send PUT /posts/{id} as author with valid data.
  2. Attempt as non-author.
  3. Attempt with invalid data.
- **Expected Result:**
  - 200 OK for valid update by author.
  - 401/403 for unauthorized.
  - 400 for invalid data.
- **Related Backend Task(s):** Endpoint: PUT /posts/{id}
- **Test Type:** API, Integration
- **Priority:** Medium
- **Complexity or Story Points:** 2
- **Suggested Tools/Frameworks:** Jest, Supertest, Postman

### TC-014: Delete Blog Post
- **Title:** Delete a blog post (author only)
- **User Story:** As a writer, I want to delete my posts. ([PRD](docs/PROJECT.md#user-stories--flows))
- **Test Objective:** Validate deletion and authorization.
- **Preconditions:** User is authenticated and is the author
- **Test Steps:**
  1. Send DELETE /posts/{id} as author.
  2. Attempt as non-author.
- **Expected Result:**
  - 204 No Content for valid delete.
  - 401/403 for unauthorized.
- **Related Backend Task(s):** Endpoint: DELETE /posts/{id}
- **Test Type:** API, Integration
- **Priority:** Medium
- **Complexity or Story Points:** 2
- **Suggested Tools/Frameworks:** Jest, Supertest, Postman

---

## Comments

### TC-020: Add Comment
- **Title:** Add a comment to a blog post
- **User Story:** As a reader, I want to comment on posts. ([PRD](docs/PROJECT.md#user-stories--flows))
- **Test Objective:** Validate comment creation, required fields, and authentication.
- **Preconditions:** User is authenticated, post exists
- **Test Steps:**
  1. Send POST /posts/{post_id}/comments with valid content.
  2. Attempt with missing/invalid content.
  3. Attempt without authentication.
- **Expected Result:**
  - 201 Created for valid input.
  - 400 Bad Request for invalid input.
  - 401 Unauthorized if not logged in.
- **Related Backend Task(s):** Endpoint: POST /posts/{post_id}/comments
- **Test Type:** API, Integration
- **Priority:** Medium
- **Complexity or Story Points:** 2
- **Suggested Tools/Frameworks:** Jest, Supertest, Postman

### TC-021: List Comments for Post
- **Title:** List comments for a blog post
- **User Story:** As a reader, I want to see comments on posts. ([PRD](docs/PROJECT.md#user-stories--flows))
- **Test Objective:** Validate listing, pagination, and error handling.
- **Preconditions:** At least one comment exists for post
- **Test Steps:**
  1. Send GET /posts/{post_id}/comments with/without pagination.
  2. Attempt for non-existent post.
- **Expected Result:**
  - 200 OK with array of comments.
  - 404 Not Found for invalid post.
- **Related Backend Task(s):** Endpoint: GET /posts/{post_id}/comments
- **Test Type:** API, Integration
- **Priority:** Medium
- **Complexity or Story Points:** 1
- **Suggested Tools/Frameworks:** Jest, Supertest, Postman

---

## Related Posts

### TC-030: Related Posts Integrity
- **Title:** Related posts do not self-reference
- **User Story:** As a reader, I want to see relevant related posts. ([PRD](docs/PROJECT.md#core-features))
- **Test Objective:** Ensure related_posts table enforces no self-relation.
- **Preconditions:** At least one post exists
- **Test Steps:**
  1. Attempt to create related_posts entry where post_id == related_post_id.
- **Expected Result:**
  - DB constraint error (CHECK violation).
- **Related Backend Task(s):** DB: related_posts table
- **Test Type:** DB, Integration
- **Priority:** Low
- **Complexity or Story Points:** 1
- **Suggested Tools/Frameworks:** SQL, Sequelize

---

_Add more test cases as features evolve._ 