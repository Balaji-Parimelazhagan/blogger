# Bloggr Test Execution Report

## Summary Table

| Test ID   | Title                                 | Status   | Notes                                                                                 |
|-----------|---------------------------------------|----------|---------------------------------------------------------------------------------------|
| TC-001    | User Registration                     | Pass     | Valid registration, duplicate, and invalid input all handled as expected. User present in DB. |
| TC-002    | Get User Profile                      | Pass     | Valid user returns 200, non-existent user returns 404. No sensitive data exposed.      |
| TC-003    | Update User Profile                   | Fail     | All attempts return 401 Unauthorized (JWT sent as body param, not header). API expects 'Authorization' header. |
| TC-010    | Create Blog Post                      | Pass     | Authenticated user can create post. Post present in DB.                               |
| TC-011    | List Blog Posts                       | Pass     | 200 OK, posts returned as expected.                                                   |
| TC-012    | Get Blog Post by ID                   | Pass     | 200 OK for valid, 404 for non-existent.                                               |
| TC-013    | Update Blog Post                      | Fail     | 401 Unauthorized (JWT sent as body param, not header). API expects 'Authorization' header. |
| TC-014    | Delete Blog Post                      | Fail     | 401 Unauthorized (JWT sent as body param, not header). API expects 'Authorization' header. |
| TC-020    | Add Comment                           | Partial  | 500 Internal Server Error for valid input, 400 for missing content, 404 for invalid post. No comment created in DB. |
| TC-021    | List Comments for Post                | Pass     | 200 OK for valid, 404 for non-existent post.                                          |
| TC-030    | Related Posts Integrity               | Pass     | DB constraint prevents self-relation as expected.                                     |

---

## Key Findings

- **Authentication Header Issue:** Authenticated endpoints expect the JWT in the 'Authorization: Bearer <token>' header. Current test method sends it as a body param, resulting in 401 errors for update/delete endpoints.
- **Data Integrity:** User registration, blog post creation, and related post constraints work as expected. No unauthorized data exposure.
- **Comment Endpoint:** Adding a comment returns a 500 error for valid input, 400 for missing content, and 404 for invalid post. No comment is created in the DB.
- **Database State:** User and blog post objects are present and correct in the database. Related posts self-reference is prevented at the DB level.

---

## Next Steps

- Update test automation to send JWT in the 'Authorization' header for all authenticated endpoints.
- Investigate and fix the 500 Internal Server Error on comment creation.
- Expand negative/edge case testing as needed.
- Continue to update this report as new features or fixes are deployed. 