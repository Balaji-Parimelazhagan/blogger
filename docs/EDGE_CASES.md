# Edge Case Documentation

## User Registration
| Edge Case                        | Test File        | Handling Code         | Notes                        |
|----------------------------------|------------------|-----------------------|------------------------------|
| Empty email                      | user.test.js     | userController.js     | Returns 400                  |
| Invalid email format             | user.test.js     | userController.js     | Returns 400                  |
| Password too short/long          | user.test.js     | userController.js     | Returns 400                  |
| Email already registered         | user.test.js     | userController.js     | Returns 409                  |
| Username already taken           | user.test.js     | userController.js     | Returns 409                  |
| Missing required fields          | user.test.js     | userController.js     | Returns 400                  |
| SQL injection attempt in fields  | user.test.js     | userController.js     | Input sanitized, returns 400 |
| XSS attempt in fields            | user.test.js     | userController.js     | Input sanitized, returns 400 |
| Extremely long input values      | user.test.js     | userController.js     | Returns 400                  |
| Registration with extra fields   | user.test.js     | userController.js     | Ignores extra fields         |
| Whitespace-only fields           | user.test.js     | userController.js     | Returns 400                  |

## User Login
| Edge Case                        | Test File        | Handling Code         | Notes                        |
|----------------------------------|------------------|-----------------------|------------------------------|
| Empty email or password          | auth.test.js     | authController.js     | Returns 400                  |
| Invalid email format             | auth.test.js     | authController.js     | Returns 400                  |
| Non-existent email               | auth.test.js     | authController.js     | Returns 401                  |
| Wrong password                   | auth.test.js     | authController.js     | Returns 401                  |
| Account locked/disabled          | auth.test.js     | authController.js     | Returns 403                  |
| SQL injection attempt            | auth.test.js     | authController.js     | Input sanitized, returns 400 |
| XSS attempt                      | auth.test.js     | authController.js     | Input sanitized, returns 400 |
| Login with extra fields          | auth.test.js     | authController.js     | Ignores extra fields         |
| Whitespace-only fields           | auth.test.js     | authController.js     | Returns 400                  |
| Case-variant email               | auth.test.js     | authController.js     | Email normalized             |

## Blog Posts
| Edge Case                              | Test File                | Handling Code           | Notes                        |
|----------------------------------------|--------------------------|-------------------------|------------------------------|
| Empty title or content                 | post.test.js             | blogPostController.js   | Returns 400                  |
| Title/content too short or too long    | post.test.js             | blogPostController.js   | Returns 400                  |
| Missing required fields                | post.test.js             | blogPostController.js   | Returns 400                  |
| Invalid/malformed request body         | post.test.js             | blogPostController.js   | Returns 400                  |
| Duplicate post title (if not allowed)  | post.test.js             | blogPostController.js   | Returns 409 or 400           |
| SQL injection attempt in fields        | post.test.js             | blogPostController.js   | Input sanitized, returns 400 |
| XSS attempt in fields                  | post.test.js             | blogPostController.js   | Input sanitized, returns 400 |
| Extremely long input values            | post.test.js             | blogPostController.js   | Returns 400                  |
| Unauthorized user tries to create      | post.test.js             | blogPostController.js   | Returns 401/403              |
| User tries to set forbidden fields     | post.test.js             | blogPostController.js   | Ignores/returns 400           |
| Whitespace-only title/content          | post.test.js             | blogPostController.js   | Returns 400                  |
| Update non-existent post               | post.test.js             | blogPostController.js   | Returns 404                  |
| Unauthorized user tries to update      | post.test.js             | blogPostController.js   | Returns 401/403              |
| Update with empty/invalid fields       | post.test.js             | blogPostController.js   | Returns 400                  |
| Update with XSS/SQL injection          | post.test.js             | blogPostController.js   | Input sanitized, returns 400 |
| Update with extra/unexpected fields    | post.test.js             | blogPostController.js   | Ignores/returns 400           |
| Delete non-existent post               | post.test.js             | blogPostController.js   | Returns 404                  |
| Unauthorized user tries to delete      | post.test.js             | blogPostController.js   | Returns 401/403              |
| Delete already deleted post            | post.test.js             | blogPostController.js   | Returns 404                  |
| View non-existent post                 | post.test.js             | blogPostController.js   | Returns 404                  |
| View post with invalid ID format       | post.test.js             | blogPostController.js   | Returns 400                  | 