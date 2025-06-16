# Blog Post Tagging System – Task List

## 1. Database & Model Layer
- [x] Create Tag Model
  - [x] Define `Tag` model (id, name, slug, created_at)
- [x] Create PostTag Join Table
  - [x] Define `PostTag` model (post_id, tag_id)
- [x] Add Associations
  - [x] Associate `BlogPost` with `Tag` (many-to-many)
  - [x] Update model index files

## 2. Migration Scripts
- [x] Create Migration for Tags Table
- [x] Create Migration for PostTags Table

## 3. Controller Layer
- [x] Create Tag Controller
  - [x] CRUD: createTag, listTags, getTag, deleteTag
- [x] Add Tagging Endpoints to BlogPost Controller
  - [x] Add tags to post
  - [x] Remove tag from post
  - [x] List tags for a post

## 4. Routes
- [x] Create Tag Routes
  - [x] `/tags` (GET, POST)
  - [x] `/tags/:id` (GET, DELETE)
- [x] Add Post-Tag Routes
  - [x] `/posts/:post_id/tags` (GET, POST, DELETE)

## 5. Validation
- [x] Create Tag Validator
  - [x] Validate tag name (required, unique, length)
  - [x] Validate tag slug (unique, format)
- [x] Validate Tagging Requests
  - [x] Ensure tags exist before adding to post

## 6. Integration & Business Logic
- [x] Integrate Tagging in Post Creation/Update
  - [x] Allow tags to be set when creating/updating a post
- [x] Prevent Duplicate Tags on a Post

## 7. Testing
- [x] Unit Tests for Tag Model
- [x] Unit Tests for Tag Controller
- [ ] Integration Tests for Tagging Endpoints (skipped)
- [ ] Test Tagging in Post Creation/Update (skipped)

## 8. Documentation
- [x] Update API Docs (Swagger/OpenAPI)
- [ ] Add Usage Examples 