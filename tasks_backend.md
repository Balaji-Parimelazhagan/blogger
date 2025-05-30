# Bloggr Backend Implementation Task List

This is a living document for tracking backend development tasks. Update as work progresses.

---

## User Management

### BE-001: User Registration Endpoint
- **User Story:** [As a writer: I want to create an account](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Implement the `POST /users` endpoint to allow new users to register. Validate input, hash passwords, and store user data.
- **Dependencies:** User data model
- **Complexity:** 2
- **Technical Requirements:**
  - Endpoint: `POST /users`
  - Data Model: `users` (DATABASE_SCHEMA.md)
- **Acceptance Criteria:**
  - New users can register with name, email, and password.
  - Email must be unique; duplicate registration returns 409.
  - Password is securely hashed.
  - Returns user object (no password) on success.
- **Suggested Approach/Notes:** Use bcrypt for password hashing. Add input validation and rate limiting.
- **Status:** ✅ Completed. Implemented with Express, Sequelize, input validation, rate limiting, password hashing, and unit tests. No deviations.

### BE-002: User Profile Retrieval
- **User Story:** [As a reader: I want to view user profiles](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Implement `GET /users/{id}` to fetch public user profile data.
- **Dependencies:** BE-001
- **Complexity:** 1
- **Technical Requirements:**
  - Endpoint: `GET /users/{id}`
  - Data Model: `users`
- **Acceptance Criteria:**
  - Returns user profile (no sensitive data).
  - Returns 404 if user not found.
- **Suggested Approach/Notes:** Exclude password and sensitive fields from response.
- **Status:** ✅ Completed. Implemented GET /users/:id with proper error handling and tests. No deviations.

### BE-003: User Profile Update
- **User Story:** [As a returning user: I want to update my profile](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Implement `PUT /users/{id}` for users to update their own profile (name, avatar_url, bio).
- **Dependencies:** BE-001, authentication middleware
- **Complexity:** 2
- **Technical Requirements:**
  - Endpoint: `PUT /users/{id}`
  - Data Model: `users`
- **Acceptance Criteria:**
  - Only authenticated user can update their own profile.
  - Validates and updates allowed fields.
  - Returns updated user object.
- **Suggested Approach/Notes:** Use JWT for authentication. Validate input.
- **Status:** ✅ Completed. Implemented PUT /users/:id with JWT auth, input validation, error handling, and tests. No deviations.

---

## Authentication (Custom, not in API_SPEC)

### BE-004: User Login Endpoint
- **User Story:** [As a returning user: I want to sign in](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Implement `POST /auth/login` to authenticate users and return JWT.
- **Dependencies:** BE-001
- **Complexity:** 2
- **Technical Requirements:**
  - Endpoint: `POST /auth/login`
  - Data Model: `users`
- **Acceptance Criteria:**
  - Accepts email and password.
  - Returns JWT on successful authentication.
  - Returns 401 on failure.
- **Suggested Approach/Notes:** Use bcrypt for password check. JWT secret in env config.
- **Status:** ✅ Completed. Implemented POST /auth/login with JWT, bcrypt, input validation, error handling, and tests. No deviations.

### BE-005: Auth Middleware
- **User Story:** N/A (Technical requirement)
- **Detailed Description:** Implement middleware to protect endpoints requiring authentication/authorization.
- **Dependencies:** BE-004
- **Complexity:** 2
- **Technical Requirements:**
  - Middleware for JWT verification
  - Used in protected endpoints (see API_SPEC)
- **Acceptance Criteria:**
  - Rejects requests with invalid/missing JWT.
  - Attaches user info to request on success.
- **Suggested Approach/Notes:** Use express-jwt or custom middleware.

---

## Blog Posts

### BE-006: Create Blog Post
- **User Story:** [As a writer: I want to create a blog post](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Implement `POST /posts` for authenticated users to create blog posts (draft or published).
- **Dependencies:** BE-005, BlogPost data model
- **Complexity:** 2
- **Technical Requirements:**
  - Endpoint: `POST /posts`
  - Data Model: `blog_posts`
- **Acceptance Criteria:**
  - Authenticated users can create posts.
  - Validates required fields (title, content).
  - Returns created post object.
- **Suggested Approach/Notes:** Sanitize content to prevent XSS.
- **Status:** ✅ Completed. Implemented POST /posts with Sequelize model, migration, input validation, XSS sanitization, JWT auth, and Swagger docs. No deviations.

### BE-007: List Blog Posts
- **User Story:** [As a reader: I want to browse the homepage](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Implement `GET /posts` to list published posts, with filters for author, published status, pagination, and sorting.
- **Dependencies:** BE-006
- **Complexity:** 2
- **Technical Requirements:**
  - Endpoint: `GET /posts`
  - Data Model: `blog_posts`
- **Acceptance Criteria:**
  - Returns paginated list of posts.
  - Supports filters and sorting.
- **Suggested Approach/Notes:** Use Sequelize query options for filtering/sorting.
- **Status:** ✅ Completed. Implemented GET /posts with filtering, pagination, sorting, and Swagger docs. No deviations.

### BE-008: Get Blog Post by ID
- **User Story:** [As a reader: I want to read full blog posts](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Implement `GET /posts/{id}` to fetch a single post (published or own draft).
- **Dependencies:** BE-006, BE-005
- **Complexity:** 1
- **Technical Requirements:**
  - Endpoint: `GET /posts/{id}`
  - Data Model: `blog_posts`
- **Acceptance Criteria:**
  - Returns post if published or user is author.
  - Returns 404/403 as appropriate.
- **Suggested Approach/Notes:** Check published status and user ownership.
- **Status:** ✅ Completed. Implemented GET /posts/{id} with access control and Swagger docs. No deviations.

### BE-009: Update Blog Post
- **User Story:** [As a writer: I want to edit my blog post](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Implement `PUT /posts/{id}` for authors to update their posts.
- **Dependencies:** BE-008, BE-005
- **Complexity:** 2
- **Technical Requirements:**
  - Endpoint: `PUT /posts/{id}`
  - Data Model: `blog_posts`
- **Acceptance Criteria:**
  - Only author can update post.
  - Validates and updates allowed fields.
  - Returns updated post object.
- **Suggested Approach/Notes:** Validate input, check ownership.
- **Status:** ✅ Completed. Implemented PUT /posts/{id} with validation, sanitization, access control, and Swagger docs. No deviations.

### BE-010: Delete Blog Post
- **User Story:** [As a writer: I want to delete my blog post](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Implement `DELETE /posts/{id}` for authors to delete their posts.
- **Dependencies:** BE-008, BE-005
- **Complexity:** 1
- **Technical Requirements:**
  - Endpoint: `DELETE /posts/{id}`
  - Data Model: `blog_posts`
- **Acceptance Criteria:**
  - Only author can delete post.
  - Returns 204 on success.
- **Suggested Approach/Notes:** Check ownership before delete.
- **Status:** ✅ Completed. Implemented DELETE /posts/{id} with access control and Swagger docs. No deviations.

---

## Comments

### BE-011: Add Comment
- **User Story:** [As a reader: I want to comment on posts](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Implement `POST /posts/{post_id}/comments` for authenticated users to add comments.
- **Dependencies:** BE-005, BlogPost data model
- **Complexity:** 1
- **Technical Requirements:**
  - Endpoint: `POST /posts/{post_id}/comments`
  - Data Model: `comments`
- **Acceptance Criteria:**
  - Authenticated users can comment on posts.
  - Validates content.
  - Returns created comment object.
- **Suggested Approach/Notes:** Sanitize input, check post existence.
- **Status:** ✅ Completed. Implemented POST /posts/{post_id}/comments with model, migration, validation, sanitization, access control, and Swagger docs. No deviations.

### BE-012: List Comments for Post
- **User Story:** [As a reader: I want to read comments on posts](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Implement `GET /posts/{post_id}/comments` to list comments for a post, with pagination.
- **Dependencies:** BE-011
- **Complexity:** 1
- **Technical Requirements:**
  - Endpoint: `GET /posts/{post_id}/comments`
  - Data Model: `comments`
- **Acceptance Criteria:**
  - Returns paginated list of comments for post.
- **Suggested Approach/Notes:** Use Sequelize pagination.
- **Status:** ✅ Completed. Implemented GET /posts/{post_id}/comments with pagination and Swagger docs. No deviations.

---

## Related Posts

### BE-013: List Related Posts
- **User Story:** [As a reader: I want to see related posts](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Implement `GET /posts/{post_id}/related` to list related posts for a given post.
- **Dependencies:** BlogPost data model
- **Complexity:** 1
- **Technical Requirements:**
  - Endpoint: `GET /posts/{post_id}/related`
  - Data Model: `related_posts`
- **Acceptance Criteria:**
  - Returns list of related posts.
- **Suggested Approach/Notes:** Use join on related_posts table.
- **Status:** ✅ Completed. Implemented GET /posts/{post_id}/related with join and Swagger docs. No deviations.

### BE-014: Add Related Post
- **User Story:** [As a writer: I want to manually relate posts](docs/PROJECT.md#future-considerations-optional)
- **Detailed Description:** Implement `POST /posts/{post_id}/related` for authors to add a related post.
- **Dependencies:** BE-013, BE-005
- **Complexity:** 1
- **Technical Requirements:**
  - Endpoint: `POST /posts/{post_id}/related`
  - Data Model: `related_posts`
- **Acceptance Criteria:**
  - Only author can add related post.
  - Prevent self-relation.
  - Returns created relationship object.
- **Suggested Approach/Notes:** Validate post ownership and prevent self-link.

### BE-015: Remove Related Post
- **User Story:** [As a writer: I want to remove related posts](docs/PROJECT.md#future-considerations-optional)
- **Detailed Description:** Implement `DELETE /posts/{post_id}/related/{related_post_id}` for authors to remove a related post relationship.
- **Dependencies:** BE-014, BE-005
- **Complexity:** 1
- **Technical Requirements:**
  - Endpoint: `DELETE /posts/{post_id}/related/{related_post_id}`
  - Data Model: `related_posts`
- **Acceptance Criteria:**
  - Only author can remove related post.
  - Returns 204 on success.
- **Suggested Approach/Notes:** Check ownership before delete.

---

# End of Task List 