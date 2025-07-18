# Bloggr Frontend Implementation Task List

> **Context:** For UI/UX reference, see the images in the `frontend/images` folder (referred to as `@images`), e.g., `@images/landing-page.png`, `@images/blog-page.png`, `@images/edit-blog.png`.

This is a living document for tracking frontend development tasks. Update as work progresses.

---

## Foundation & Layout

### FE-001: Project Setup & Tech Stack
- **User Story:** N/A (Technical setup)
- **Detailed Description:** Initialize React project with Tailwind CSS, React Router, React Query, and other core dependencies. Set up folder structure and basic configuration.
- **Files/Components:** `src/`, `tailwind.config.js`, `App.tsx`, `index.tsx`
- **Dependencies:** None
- **Complexity:** Low
- **Estimated Time:** 2h
- **Acceptance Criteria:**
  - Project builds and runs.
  - Tailwind and React Query are working.
  - Folder structure matches spec.
- **Status:** ✅ COMPLETED
  - Project scaffolded with Vite, React, TypeScript. Custom CSS used instead of Tailwind. React Router set up. Folder structure established.

### FE-002: Global Layout & Navbar
- **User Story:** [As a reader: I want to browse the homepage and navigate easily](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Implement global layout with responsive Navbar, including navigation links and user auth state.
- **Files/Components:** `components/Navbar.tsx`, `components/Layout.tsx`, `App.tsx`
- **Dependencies:** FE-001
- **Complexity:** Medium
- **Estimated Time:** 4h
- **Acceptance Criteria:**
  - Navbar displays correct links based on auth state.
  - Layout is responsive and accessible.
- **Status:** ✅ COMPLETED
  - Layout and navigation implemented in `Layout.tsx` and `App.tsx`. Navbar links present. Responsive container and card styles added.

---

## Authentication & User Management

### FE-003: Registration Page & UserForm
- **User Story:** [As a writer: I want to create an account](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Build registration page with form validation, error handling, and API integration.
- **Files/Components:** `pages/Register.tsx`, `components/UserForm.tsx`
- **Dependencies:** FE-001, `POST /users` API
- **Complexity:** Medium
- **Estimated Time:** 4h
- **Acceptance Criteria:**
  - User can register with valid data.
  - Shows inline errors and disables submit on invalid.
  - Redirects or shows success on completion.

### FE-004: Login Page
- **User Story:** [As a returning user: I want to sign in](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Build login page with form validation, error handling, and JWT storage.
- **Files/Components:** `pages/SignIn.tsx`, `components/UserForm.tsx`
- **Dependencies:** FE-001, `POST /auth/login` API
- **Complexity:** Medium
- **Estimated Time:** 4h
- **Acceptance Criteria:**
  - User can log in with valid credentials.
  - JWT is stored securely (httpOnly cookie or localStorage).
  - Shows error on failure.
- **Status:** ✅ COMPLETED
  - Refactored Login page to use reusable UserForm component.
  - Integrated with AuthContext for login and error handling.
  - Shows inline errors, disables submit on invalid, and redirects on success.
  - JWT is stored in localStorage via AuthContext/api.

#### Commit message:

feat(frontend): implement login page with validation and AuthContext integration

- Refactor Login page to use UserForm
- Integrate login with AuthContext and backend API
- Show inline errors, loading, and success states
- Store JWT in localStorage

### FE-005: Auth Context & Protected Routes
- **User Story:** N/A (Technical requirement)
- **Detailed Description:** Implement Context API for auth state, and protect routes that require authentication.
- **Files/Components:** `context/AuthContext.tsx`, `components/ProtectedRoute.tsx`, `App.tsx`
- **Dependencies:** FE-004
- **Complexity:** Medium
- **Estimated Time:** 3h
- **Acceptance Criteria:**
  - Auth state is available throughout app.
  - Protected routes redirect unauthenticated users.
- **Status:** ✅ COMPLETED
  - AuthContext provides user state and auth actions throughout the app.
  - Added ProtectedRoute component to guard authenticated routes.
  - Updated App.tsx to protect /profile route.

#### Commit message:

feat(frontend): add ProtectedRoute and enforce auth on protected pages

- Add ProtectedRoute component
- Protect /profile route in App.tsx
- Ensure unauthenticated users are redirected to login

### FE-006: User Profile Page
- **User Story:** [As a reader: I want to view user profiles](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Display user profile info and their posts. Integrate with API.
- **Files/Components:** `pages/UserProfile.tsx`, `components/Avatar.tsx`, `components/PostList.tsx`
- **Dependencies:** FE-002, `GET /users/{id}`, `GET /posts?author_id={id}`
- **Complexity:** Medium
- **Estimated Time:** 4h
- **Acceptance Criteria:**
  - User info and posts are displayed.
  - Handles loading and error states.
- **Status:** ✅ COMPLETED
  - Implemented Profile page to show current user's info and posts.
  - Created Avatar and PostList components.
  - Integrated with backend API for posts by author.
  - Handles loading and error states.

#### Commit message:

feat(frontend): implement user profile page with posts list and avatar

- Add Avatar and PostList components
- Show current user's info and posts on Profile page
- Integrate with backend API
- Handle loading and error states

### FE-007: Profile Edit Page
- **User Story:** [As a returning user: I want to update my profile](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Allow users to edit their profile (name, avatar, bio).
- **Files/Components:** `pages/ProfileEdit.tsx`, `components/UserForm.tsx`
- **Dependencies:** FE-006, `PUT /users/{id}`
- **Complexity:** Medium
- **Estimated Time:** 3h
- **Acceptance Criteria:**
  - User can update profile fields.
  - Shows success/error feedback.
- **Status:** ✅ COMPLETED
  - Implemented ProfileEdit page for editing name, avatar URL, and bio.
  - Integrated with backend API for updating user profile.
  - Shows success and error feedback, disables submit on invalid.
  - Route protected by ProtectedRoute.

#### Commit message:

feat(frontend): add profile edit page with update functionality

- Implement ProfileEdit page for editing user info
- Integrate with backend API for update
- Show success/error feedback and loading state
- Protect route with ProtectedRoute

---

## Blog Posts

### FE-008: Landing Page (Featured/Recent Posts)
- **User Story:** [As a reader: I want to browse the homepage](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Display featured and recent posts with hero and card layouts.
- **Files/Components:** `pages/Landing.tsx`, `components/PostList.tsx`, `components/Card.tsx`
- **Dependencies:** FE-002, `GET /posts`
- **Complexity:** Medium
- **Estimated Time:** 4h
- **Acceptance Criteria:**
  - Posts are fetched and displayed in correct layout.
  - Responsive and accessible.
- **Status:** ✅ COMPLETED
  - Implemented Landing page with featured and recent posts layout.
  - Created Card component for featured post.
  - Used PostList for recent posts.
  - Integrated with backend API and handled loading/error states.

#### Commit message:

feat(frontend): implement landing page with featured and recent posts

- Add Landing page with hero/featured post and recent posts list
- Create Card component for featured post
- Use PostList for recent posts
- Integrate with backend API and handle loading/error states

### FE-009: Blog Post View Page
- **User Story:** [As a reader: I want to read full blog posts](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Show full post, author info, comments, and related posts.
- **Files/Components:** `pages/PostView.tsx`, `components/Avatar.tsx`, `components/CommentList.tsx`, `components/RelatedPosts.tsx`
- **Dependencies:** FE-008, `GET /posts/{id}`, `GET /users/{id}`, `GET /posts/{id}/comments`, `GET /posts/{id}/related`
- **Complexity:** Medium
- **Estimated Time:** 5h
- **Acceptance Criteria:**
  - Post, author, comments, and related posts are displayed.
  - Handles loading and error states.
- **Status:** ✅ COMPLETED
  - Implemented PostView page to show full post, author, comments, and related posts.
  - Created CommentList and RelatedPosts components.
  - Integrated with backend API and handled loading/error states.
  - Added route for /posts/:id.

#### Commit message:

feat(frontend): implement blog post view page with comments and related posts

- Add PostView page for full post display
- Create CommentList and RelatedPosts components
- Integrate with backend API for post, comments, and related posts
- Handle loading and error states
- Add route for /posts/:id

### FE-010: Create/Edit Post Page & PostForm
- **User Story:** [As a writer: I want to create and edit blog posts](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Form for creating and editing posts, with validation and autosave draft.
- **Files/Components:** `pages/CreatePost.tsx`, `pages/EditPost.tsx`, `components/PostForm.tsx`
- **Dependencies:** FE-005, `POST /posts`, `PUT /posts/{id}`, `GET /posts/{id}`
- **Complexity:** High
- **Estimated Time:** 6h
- **Acceptance Criteria:**
  - User can create/edit posts with validation.
  - Autosave draft works.
  - Shows success/error feedback.
- **Status:** ✅ COMPLETED
  - Implemented CreatePost and EditPost pages with PostForm component.
  - Integrated with backend API for creating and editing posts.
  - Shows success/error feedback and disables submit on invalid.
  - Routes protected by ProtectedRoute.

#### Commit message:

feat(frontend): add create/edit post pages and reusable PostForm

- Implement CreatePost and EditPost pages
- Add PostForm component with validation
- Integrate with backend API for create/edit
- Show success/error feedback and loading state
- Protect routes with ProtectedRoute

### FE-011: My Posts/Drafts Page
- **User Story:** [As a returning user: I want to access my posts and drafts](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** List and manage user's own posts and drafts.
- **Files/Components:** `pages/MyPosts.tsx`, `components/PostList.tsx`, `components/Button.tsx`
- **Dependencies:** FE-005, `GET /posts?author_id=me`, `DELETE /posts/{id}`
- **Complexity:** Medium
- **Estimated Time:** 4h
- **Acceptance Criteria:**
  - User sees their posts/drafts.
  - Can delete posts with confirmation.

---

## Comments & Related Posts

### FE-012: Comment Form & List
- **User Story:** [As a reader: I want to comment on and read comments](docs/PROJECT.md#user-stories--flows)
- **Detailed Description:** Add and display comments for posts, with validation and optimistic UI.
- **Files/Components:** `components/CommentForm.tsx`, `components/CommentList.tsx`, `pages/PostView.tsx`
- **Dependencies:** FE-009, `POST /posts/{id}/comments`, `GET /posts/{id}/comments`
- **Complexity:** Medium
- **Estimated Time:** 4h
- **Acceptance Criteria:**
  - Users can add comments (if logged in).
  - Comments display and update optimistically.

### FE-013: Related Posts Management
- **User Story:** [As a writer: I want to relate posts](docs/PROJECT.md#future-considerations-optional)
- **Detailed Description:** Display and manage related posts for a blog post (add/remove, author only).
- **Files/Components:** `components/RelatedPosts.tsx`, `pages/PostView.tsx`
- **Dependencies:** FE-009, `GET /posts/{id}/related`, `POST /posts/{id}/related`, `