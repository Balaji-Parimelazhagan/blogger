# FRONTEND_SPEC.md

## Bloggr Frontend Architecture Specification

---

### Overall Purpose
Build a modern, minimalistic, and highly usable blogging platform frontend that enables writers to create, edit, and publish posts, and readers to discover, read, and engage with content. The frontend should prioritize clean design, accessibility, and seamless user experience.

### Proposed Tech Stack
- **Framework:** React (with functional components & hooks)
- **Styling:** Tailwind CSS (utility-first, responsive design)
- **State Management:** React Context API + React Query (for server state)
- **Routing:** React Router v6+
- **API Integration:** React Query (data fetching, caching, mutations)
- **Forms & Validation:** React Hook Form + Zod/Yup
- **Icons & UI:** Heroicons or similar
- **Accessibility:** WCAG AA baseline, semantic HTML, focus management

---

## Screens / Pages
| Page                | Path                | Purpose                                                        |
|---------------------|---------------------|----------------------------------------------------------------|
| Landing             | `/`                 | Showcase featured/recent posts, navigation, hero section        |
| Blog Post View      | `/posts/:id`        | Read full blog post, author info, comments, related posts       |
| Create Post         | `/write`            | Draft and publish new blog post                                |
| Edit Post           | `/posts/:id/edit`   | Edit existing post (author only)                               |
| User Profile        | `/users/:id`        | View user profile, their posts                                 |
| My Posts/Drafts     | `/me/posts`         | List/manage own posts and drafts                               |
| Sign In             | `/signin`           | User authentication                                            |
| Register            | `/register`         | User registration                                              |
| Not Found           | `*`                 | 404 fallback                                                   |

---

## Key Reusable Components
| Component         | Props (type)                                  | Description / Behavior                                         |
|-------------------|-----------------------------------------------|---------------------------------------------------------------|
| Button            | `children`, `onClick`, `type`, `variant`      | Accessible, styled button, supports loading/disabled states    |
| Card              | `children`, `title`, `image`, `onClick`       | Used for post previews, user info, etc.                        |
| Modal             | `isOpen`, `onClose`, `title`, `children`      | Accessible modal/dialog, focus trap                            |
| UserForm          | `initialValues`, `onSubmit`, `mode`           | For registration/profile edit, handles validation              |
| PostForm          | `initialValues`, `onSubmit`, `mode`           | For create/edit post, handles validation, autosave draft       |
| CommentForm       | `onSubmit`, `loading`                         | For adding comments, validates input                           |
| CommentList       | `comments`, `onReply`                         | Renders list of comments, supports nesting (future)            |
| Avatar            | `src`, `alt`, `size`                          | User avatar, fallback to initials                              |
| Loader            | `size`, `variant`                             | Loading spinner or skeleton                                    |
| ErrorMessage      | `message`                                     | Displays error messages, accessible                            |
| PostList          | `posts`, `onSelect`                           | List of post cards, supports pagination                        |
| RelatedPosts      | `postId`, `relatedPosts`                      | Shows related posts, links to them                             |
| Navbar            | `user`, `onSignOut`                           | Top navigation, responsive, shows auth state                   |
| Sidebar           | `children`                                    | For layout, e.g., related posts, author info                   |
| Pagination        | `page`, `pageSize`, `total`, `onChange`       | For paginated lists                                            |

---

## State Management Strategy
- **Global State:**
  - Authenticated user (Context API, persisted in localStorage/cookie)
  - Theme (if applicable)
- **Server State:**
  - Posts, comments, user profiles, related posts (React Query)
  - Handles caching, background refetch, optimistic updates
- **Local State:**
  - Form inputs, modal open/close, UI toggles (component state)

---

## API Integration
| Screen/Component      | API Endpoints Used                                      |
|----------------------|--------------------------------------------------------|
| Landing              | `GET /posts` (featured/recent), `GET /users/{id}`      |
| Blog Post View       | `GET /posts/{id}`, `GET /posts/{id}/comments`, `GET /posts/{id}/related`, `POST /posts/{id}/comments` |
| Create/Edit Post     | `POST /posts`, `PUT /posts/{id}`, `GET /posts/{id}`    |
| User Profile         | `GET /users/{id}`, `GET /posts?author_id={id}`         |
| My Posts/Drafts      | `GET /posts?author_id=me` (JWT), `DELETE /posts/{id}`  |
| Register             | `POST /users`                                          |
| Sign In              | `POST /auth/login` (custom, not in API_SPEC, to be added) |
| Navbar/Profile Menu  | `GET /users/{id}` (self), `POST /auth/logout` (custom) |
| RelatedPosts         | `GET /posts/{id}/related`, `POST /posts/{id}/related`, `DELETE /posts/{id}/related/{related_post_id}` |
| CommentForm/List     | `POST /posts/{id}/comments`, `GET /posts/{id}/comments`|

---

## Data Input/Output Expectations
- **Forms:**
  - All forms use controlled components with validation (React Hook Form + Zod/Yup)
  - Show inline errors, disable submit on invalid
  - Password fields masked, with show/hide toggle
  - Autosave drafts for post creation/edit
- **Data Display:**
  - Use skeleton loaders while fetching
  - Show error messages on fetch/mutation failure
  - Paginated lists for posts/comments
  - Truncate long text with ellipsis, expand on click
- **User Interactions:**
  - Optimistic UI for comment/post creation/deletion
  - Confirmation modals for destructive actions
  - Accessible focus management for modals/forms

---

## UI/UX Considerations
- **Responsiveness:** Mobile-first, grid/flex layouts, test on all breakpoints
- **Loading States:** Skeletons/spinners for all async data
- **Error Handling:** User-friendly error messages, retry options
- **Accessibility:**
  - Semantic HTML, ARIA roles/labels
  - Keyboard navigation for all interactive elements
  - Sufficient color contrast, alt text for images
  - Focus ring and skip-to-content support
- **Optimistic Updates:**
  - Use React Query's mutation options for instant UI feedback
- **Theming:** (Optional) Light/dark mode toggle

---

## Routing Strategy
- **Library:** React Router v6+
- **Approach:**
  - Nested routes for post details, user profiles
  - Protected routes for create/edit post, my posts (auth required)
  - 404 fallback for unknown routes
  - URL params for resource IDs (e.g., `/posts/:id`)
  - Query params for filters, pagination (e.g., `/posts?author_id=1&limit=10`)

---

# End of Spec 