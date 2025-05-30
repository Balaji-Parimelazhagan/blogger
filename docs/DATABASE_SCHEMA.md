# DATABASE_SCHEMA.md

## Database Schema for Bloggr

This schema is designed for a modern blogging platform, based on the high-level data models and business rules described in the project PRD. The schema is normalized (3NF), with clear relationships and constraints. SQL DDL is provided for PostgreSQL.

---

## Table: users
| Column      | Data Type        | Constraints                                 |
|-------------|------------------|---------------------------------------------|
| id          | SERIAL           | PRIMARY KEY                                 |
| name        | VARCHAR(100)     | NOT NULL                                    |
| email       | VARCHAR(255)     | NOT NULL, UNIQUE                            |
| avatar_url  | VARCHAR(255)     |                                             |
| bio         | TEXT             |                                             |
| created_at  | TIMESTAMP        | NOT NULL, DEFAULT CURRENT_TIMESTAMP         |
| updated_at  | TIMESTAMP        | NOT NULL, DEFAULT CURRENT_TIMESTAMP         |

**Relationships:**
- One-to-many with `blog_posts` (author_id)
- One-to-many with `comments` (author_id)

---

## Table: blog_posts
| Column      | Data Type        | Constraints                                 |
|-------------|------------------|---------------------------------------------|
| id          | SERIAL           | PRIMARY KEY                                 |
| title       | VARCHAR(200)     | NOT NULL                                    |
| content     | TEXT             | NOT NULL                                    |
| author_id   | INTEGER          | NOT NULL, FOREIGN KEY REFERENCES users(id)   |
| published   | BOOLEAN          | NOT NULL, DEFAULT FALSE                     |
| created_at  | TIMESTAMP        | NOT NULL, DEFAULT CURRENT_TIMESTAMP         |
| updated_at  | TIMESTAMP        | NOT NULL, DEFAULT CURRENT_TIMESTAMP         |

**Indexes:**
- INDEX on `author_id`
- INDEX on `published`
- INDEX on `created_at`

**Relationships:**
- Many-to-one with `users` (author_id)
- One-to-many with `comments` (id → post_id)
- Many-to-many with `blog_posts` via `related_posts`

---

## Table: comments
| Column      | Data Type        | Constraints                                 |
|-------------|------------------|---------------------------------------------|
| id          | SERIAL           | PRIMARY KEY                                 |
| post_id     | INTEGER          | NOT NULL, FOREIGN KEY REFERENCES blog_posts(id) |
| author_id   | INTEGER          | NOT NULL, FOREIGN KEY REFERENCES users(id)   |
| content     | TEXT             | NOT NULL                                    |
| created_at  | TIMESTAMP        | NOT NULL, DEFAULT CURRENT_TIMESTAMP         |

**Indexes:**
- INDEX on `post_id`
- INDEX on `author_id`

**Relationships:**
- Many-to-one with `blog_posts` (post_id)
- Many-to-one with `users` (author_id)

---

## Table: related_posts
| Column          | Data Type        | Constraints                                 |
|-----------------|------------------|---------------------------------------------|
| post_id         | INTEGER          | NOT NULL, FOREIGN KEY REFERENCES blog_posts(id) |
| related_post_id | INTEGER          | NOT NULL, FOREIGN KEY REFERENCES blog_posts(id) |

**Constraints:**
- PRIMARY KEY (post_id, related_post_id)
- Prevent self-relation: CHECK (post_id <> related_post_id)

**Indexes:**
- INDEX on `post_id`
- INDEX on `related_post_id`

**Relationships:**
- Many-to-many between `blog_posts` (self-referencing)

---

# SQL DDL (PostgreSQL)

```sql
-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar_url VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- BLOG_POSTS
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL REFERENCES users(id),
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at);

-- COMMENTS
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES blog_posts(id),
    author_id INTEGER NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);

-- RELATED_POSTS
CREATE TABLE related_posts (
    post_id INTEGER NOT NULL REFERENCES blog_posts(id),
    related_post_id INTEGER NOT NULL REFERENCES blog_posts(id),
    PRIMARY KEY (post_id, related_post_id),
    CHECK (post_id <> related_post_id)
);
CREATE INDEX idx_related_posts_post_id ON related_posts(post_id);
CREATE INDEX idx_related_posts_related_post_id ON related_posts(related_post_id);
```

---

# Notes
- All `created_at` and `updated_at` fields use `CURRENT_TIMESTAMP` for default values.
- Foreign keys are set to `ON DELETE CASCADE` or `ON DELETE SET NULL` as needed in production for referential integrity (not shown here for brevity).
- Indexes are added for fields likely to be queried frequently (e.g., author, published status, creation date).
- The `related_posts` table enables many-to-many self-referencing relationships for related content.
- Additional tables (e.g., for notifications, tags, categories) can be added as the platform evolves. 