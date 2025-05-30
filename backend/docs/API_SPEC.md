# API_SPEC.md

## REST API Specification for Bloggr

**Backend Stack:** Nodejs + Sequelize ORM

---

## Table of Contents
- [Users](#users)
- [Blog Posts](#blog-posts)
- [Comments](#comments)
- [Related Posts](#related-posts)

---

## Users

### Register User
- **Endpoint:** `POST /users`
- **Description:** Register a new user.
- **Authentication:** None
- **Request Headers:**
  - `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "string",         // required
  "email": "string",        // required
  "password": "string"      // required
}
```
- **Success Response:**
  - `201 Created`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "avatar_url": null,
  "bio": null,
  "created_at": "2024-06-01T12:00:00Z"
}
```
- **Error Responses:**
  - `400 Bad Request` (validation)
  - `409 Conflict` (email already exists)
- **Security Notes:** Input validation, password hashing, rate limiting.

---

### Get User Profile
- **Endpoint:** `GET /users/{id}`
- **Description:** Get public profile of a user by ID.
- **Authentication:** None
- **Path Parameters:**
  - `id` (integer, required): User ID
- **Success Response:**
  - `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "avatar_url": null,
  "bio": null,
  "created_at": "2024-06-01T12:00:00Z"
}
```
- **Error Responses:**
  - `404 Not Found`
- **Security Notes:** Do not expose sensitive data (e.g., password hashes).

---

### Update User Profile
- **Endpoint:** `PUT /users/{id}`
- **Description:** Update user profile (self only).
- **Authentication:** JWT Required (user must match `id`)
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Path Parameters:**
  - `id` (integer, required): User ID
- **Request Body:**
```json
{
  "name": "string",         // optional
  "avatar_url": "string",  // optional
  "bio": "string"           // optional
}
```
- **Success Response:**
  - `200 OK` (updated user object)
- **Error Responses:**
  - `401 Unauthorized`
  - `403 Forbidden` (not self)
  - `404 Not Found`
- **Security Notes:** Only allow self-update, validate input.

---

## Blog Posts

### Create Blog Post
- **Endpoint:** `POST /posts`
- **Description:** Create a new blog post (draft or published).
- **Authentication:** JWT Required
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body:**
```json
{
  "title": "string",      // required
  "content": "string",    // required
  "published": true        // optional (default: false)
}
```
- **Success Response:**
  - `201 Created` (post object)
- **Error Responses:**
  - `400 Bad Request`
  - `401 Unauthorized`
- **Security Notes:** Input validation, XSS protection.

---

### List Blog Posts
- **Endpoint:** `GET /posts`
- **Description:** List published blog posts (optionally filter, paginate, sort).
- **Authentication:** None
- **Query Parameters:**
  - `author_id` (integer, optional): Filter by author
  - `published` (boolean, optional): Filter by published status
  - `limit` (integer, optional): Max results (default: 20)
  - `offset` (integer, optional): Pagination offset
  - `sortBy` (string, optional): Field to sort by (e.g., `created_at`)
  - `order` (string, optional): `asc` or `desc` (default: `desc`)
- **Success Response:**
  - `200 OK` (array of post objects)
- **Error Responses:**
  - `400 Bad Request`
- **Security Notes:** Pagination, input sanitization.

---

### Get Blog Post by ID
- **Endpoint:** `GET /posts/{id}`
- **Description:** Get a single blog post by ID (published or own draft).
- **Authentication:** JWT Optional (required for own drafts)
- **Path Parameters:**
  - `id` (integer, required): Post ID
- **Success Response:**
  - `200 OK` (post object)
- **Error Responses:**
  - `404 Not Found`
  - `403 Forbidden` (if not author and not published)
- **Security Notes:** Only allow draft access to author.

---

### Update Blog Post
- **Endpoint:** `PUT /posts/{id}`
- **Description:** Update a blog post (author only).
- **Authentication:** JWT Required (author only)
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Path Parameters:**
  - `id` (integer, required): Post ID
- **Request Body:**
```json
{
  "title": "string",      // optional
  "content": "string",    // optional
  "published": true        // optional
}
```
- **Success Response:**
  - `200 OK` (updated post object)
- **Error Responses:**
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found`
- **Security Notes:** Only allow author to update, validate input.

---

### Delete Blog Post
- **Endpoint:** `DELETE /posts/{id}`
- **Description:** Delete a blog post (author only).
- **Authentication:** JWT Required (author only)
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Path Parameters:**
  - `id` (integer, required): Post ID
- **Success Response:**
  - `204 No Content`
- **Error Responses:**
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found`
- **Security Notes:** Only allow author to delete.

---

## Comments

### Add Comment
- **Endpoint:** `POST /posts/{post_id}/comments`
- **Description:** Add a comment to a blog post.
- **Authentication:** JWT Required
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Path Parameters:**
  - `post_id` (integer, required): Blog post ID
- **Request Body:**
```json
{
  "content": "string"   // required
}
```
- **Success Response:**
  - `201 Created` (comment object)
- **Error Responses:**
  - `400 Bad Request`
  - `401 Unauthorized`
  - `404 Not Found` (post not found)
- **Security Notes:** Input validation, XSS protection.

---

### List Comments for Post
- **Endpoint:** `GET /posts/{post_id}/comments`
- **Description:** List comments for a blog post.
- **Authentication:** None
- **Path Parameters:**
  - `post_id` (integer, required): Blog post ID
- **Query Parameters:**
  - `limit` (integer, optional): Max results (default: 20)
  - `offset` (integer, optional): Pagination offset
- **Success Response:**
  - `200 OK` (array of comment objects)
- **Error Responses:**
  - `404 Not Found` (post not found)
- **Security Notes:** Pagination, input sanitization.

---

## Related Posts

### List Related Posts
- **Endpoint:** `GET /posts/{post_id}/related`
- **Description:** List related posts for a given blog post.
- **Authentication:** None
- **Path Parameters:**
  - `post_id` (integer, required): Blog post ID
- **Success Response:**
  - `200 OK` (array of related post objects)
- **Error Responses:**
  - `404 Not Found` (post not found)
- **Security Notes:** None

---

### Add Related Post
- **Endpoint:** `POST /posts/{post_id}/related`
- **Description:** Add a related post (manual relationship, author only).
- **Authentication:** JWT Required (author only)
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Path Parameters:**
  - `post_id` (integer, required): Blog post ID
- **Request Body:**
```json
{
  "related_post_id": 2   // required, integer
}
```
- **Success Response:**
  - `201 Created` (relationship object)
- **Error Responses:**
  - `400 Bad Request`
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found` (post or related post not found)
- **Security Notes:** Prevent self-relation, only allow author to add.

---

### Remove Related Post
- **Endpoint:** `DELETE /posts/{post_id}/related/{related_post_id}`
- **Description:** Remove a related post relationship (author only).
- **Authentication:** JWT Required (author only)
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Path Parameters:**
  - `post_id` (integer, required): Blog post ID
  - `related_post_id` (integer, required): Related post ID
- **Success Response:**
  - `204 No Content`
- **Error Responses:**
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found`
- **Security Notes:** Only allow author to remove.

---

# General Security Notes
- All endpoints must validate and sanitize input.
- Use JWT for authentication and role-based authorization.
- Rate limiting and brute-force protection recommended for sensitive endpoints.
- Use HTTPS in production. 