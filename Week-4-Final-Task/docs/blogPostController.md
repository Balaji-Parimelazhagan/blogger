# API Documentation: BlogPost Controller

## 1. OVERVIEW SECTION

### Purpose and Responsibility

This module is an Express.js controller responsible for managing all aspects of blog posts within the application. It serves as the primary interface for any blog post-related actions.

### Key Features and Capabilities

*   **Full CRUD Operations**: Create, Read, Update, and Delete (CRUD) functionality for blog posts.
*   **Tag Management**: Associate tags with posts, list a post's tags, and remove tags.
*   **Data Validation**: Enforces strict input validation for all create and update operations to ensure data integrity.
*   **Security**: Implements authorization to ensure users can only modify their own posts and sanitizes content to prevent XSS attacks.
*   **Pagination and Filtering**: Provides robust options for listing and filtering posts based on author, publication status, and sorting.
*   **Notifications**: Integrates with a notification system (`BlogEventManager`) to publish events when posts are created or updated.

### Usage Patterns

This controller is designed to be used as middleware in an Express route definition file. Each exported function handles a specific API endpoint.

**Example Route Definition:**

```javascript
// In routes/posts.js
const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const authMiddleware = require('../middleware/auth');

// POST /api/posts - Create a new post
router.post('/', authMiddleware, blogPostController.createPost);

// GET /api/posts/:id - Get a single post
router.get('/:id', blogPostController.getPost);

// PUT /api/posts/:id - Update a post
router.put('/:id', authMiddleware, blogPostController.updatePost);

// DELETE /api/posts/:id - Delete a post
router.delete('/:id', authMiddleware, blogPostController.deletePost);
```

### Dependencies and Requirements

*   **Models**: `BlogPost`, `Tag`, `User` (from Sequelize).
*   **Middleware**: `express-validator` for validation, and a custom `auth` middleware that attaches a `user` object to the `req`.
*   **Libraries**: `isomorphic-dompurify` for sanitizing HTML content.
*   **Internal Modules**: The application's notification system (`BlogEventManager`, `eventTypes`).

---

## 2. METHOD DOCUMENTATION

### `createPost(req, res, next)`

*   **Purpose**: Creates a new blog post.
*   **Parameters**:
    *   `req` (Object): The Express request object.
        *   `req.user`: (Object) The authenticated user object, required.
        *   `req.body`: (Object)
            *   `title` (String): The title of the post (2-200 characters). Required.
            *   `content` (String): The body of the post (1-10000 characters). Required.
            *   `published` (Boolean): Whether the post should be publicly visible. Defaults to `false`. Optional.
            *   `tagIds` (Array<Number>): An array of tag IDs to associate with the post. Optional.
*   **Returns**:
    *   `201 Created`: On success, returns the newly created post object.
    *   `400 Bad Request`: If validation fails (e.g., missing title, invalid tag IDs).
    *   `401 Unauthorized`: If the user is not authenticated.
    *   `409 Conflict`: If the user already has a post with the same title.
*   **Usage Example**:
    ```javascript
    // POST /api/posts
    // Body:
    {
      "title": "My First Post",
      "content": "<p>This is the content of my post.</p>",
      "published": true,
      "tagIds": [1, 5]
    }
    ```

### `listPosts(req, res, next)`

*   **Purpose**: Retrieves a list of blog posts based on query parameters.
*   **Parameters**:
    *   `req` (Object): The Express request object.
        *   `req.query`: (Object)
            *   `author_id` (Number): Filter posts by author ID.
            *   `published` (Boolean): Filter by publication status. Defaults to `true`.
            *   `limit` (Number): Number of posts to return. Defaults to 20, max 100.
            *   `offset` (Number): Number of posts to skip. Defaults to 0.
            *   `sortBy` (String): Field to sort by. Defaults to `created_at`.
            *   `order` (String): Sort order ('ASC' or 'DESC'). Defaults to `DESC`.
*   **Returns**:
    *   `200 OK`: Returns an array of post objects.
*   **Usage Example**:
    ```javascript
    // GET /api/posts?author_id=1&limit=10&order=ASC
    ```

### `getPost(req, res, next)`

*   **Purpose**: Retrieves a single blog post by its ID.
*   **Parameters**:
    *   `req` (Object): The Express request object.
        *   `req.params.id` (Number): The ID of the post to retrieve.
*   **Returns**:
    *   `200 OK`: Returns the requested post object.
    *   `400 Bad Request`: If the provided ID is not a valid number.
    *   `404 Not Found`: If no post with the given ID exists.

### `updatePost(req, res, next)`

*   **Purpose**: Updates an existing blog post. The user must be the author of the post.
*   **Parameters**:
    *   `req` (Object): The Express request object.
        *   `req.user`: (Object) The authenticated user object, required.
        *   `req.params.id` (Number): The ID of the post to update.
        *   `req.body`: (Object) Contains any of the fields from `createPost` to be updated. All are optional.
*   **Returns**:
    *   `200 OK`: On success, returns the updated post object.
    *   `400 Bad Request`: If validation fails.
    *   `401 Unauthorized`: If the user is not authenticated.
    *   `403 Forbidden`: If the user is not the author of the post.
    *   `404 Not Found`: If the post does not exist.
*   **Usage Example**:
    ```javascript
    // PUT /api/posts/123
    // Body:
    {
      "published": false,
      "tagIds": [1, 8, 12]
    }
    ```

### `deletePost(req, res, next)`

*   **Purpose**: Deletes a blog post. The user must be the author.
*   **Parameters**:
    *   `req` (Object): The Express request object.
        *   `req.user`: (Object) The authenticated user object, required.
        *   `req.params.id` (Number): The ID of the post to delete.
*   **Returns**:
    *   `204 No Content`: On success.
    *   `401 Unauthorized`: If the user is not authenticated.
    *   `403 Forbidden`: If the user is not the author of the post.
    *   `404 Not Found`: If the post does not exist.

---

## 3. EXAMPLES SECTION

### Basic Usage with cURL

**Create a new post:**
```bash
curl -X POST http://localhost:3000/api/posts \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_jwt_token>" \
-d '{
  "title": "API Documentation",
  "content": "<h1>Hello World</h1>",
  "published": true,
  "tagIds": [2]
}'
```

**Get a single post:**
```bash
curl http://localhost:3000/api/posts/1
```

**Update a post's title:**
```bash
curl -X PUT http://localhost:3000/api/posts/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_jwt_token>" \
-d '{"title": "An Updated Title"}'
```

**Delete a post:**
```bash
curl -X DELETE http://localhost:3000/api/posts/1 \
-H "Authorization: Bearer <your_jwt_token>"
```

---

## 4. API REFERENCE

### Method Signatures (Express Middleware)

```javascript
// exports.createPost = async (req, res, next) => { ... };
// exports.listPosts = async (req, res, next) => { ... };
// exports.getPost = async (req, res, next) => { ... };
// exports.updatePost = async (req, res, next) => { ... };
// exports.deletePost = async (req, res, next) => { ... };
// exports.listTagsForPost = async (req, res, next) => { ... };
// exports.addTagToPost = async (req, res, next) => { ... };
// exports.removeTagFromPost = async (req, res, next) => { ... };
```

### Type Definitions (for Request Bodies)

**Create Post Body:**
```typescript
interface CreatePostBody {
  title: string;
  content: string;
  published?: boolean;
  tagIds?: number[];
}
```

**Update Post Body:**
```typescript
interface UpdatePostBody {
  title?: string;
  content?: string;
  published?: boolean;
  tagIds?: number[];
}
```

### Events Emitted

The controller emits events via the `BlogEventManager`.

*   **`POST_CREATED`**: Fired when a new post is successfully created.
    *   **Payload**: `{ postId, title, authorId, status: 'created' }`
*   **`POST_UPDATED`**: Fired when a post is successfully updated.
    *   **Payload**: `{ postId, title, authorId, status: 'updated' }`
``` 