# Bloggr

A modern blogging platform with a Node.js/Express/Sequelize (PostgreSQL) backend and a React/TypeScript frontend.

## Project Structure

- `backend/` — Node.js/Express API, Sequelize models, migrations, controllers, routes, etc.
- `frontend/` — React + TypeScript app (Vite), custom CSS, assets, etc.

## Features
- RESTful API for users, posts, comments, and related posts
- JWT authentication
- Input validation and error handling
- Secure password hashing
- Rate limiting for sensitive endpoints
- Comprehensive unit tests

## Tech Stack
- Node.js
- Express.js
- Sequelize (PostgreSQL)
- bcrypt
- express-validator
- Jest (testing)

## Getting Started

### 1. Clone the repository
```bash
# (Assuming you are in the project root)
git clone <repo-url> .
cd blogger
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root with the following variables:
```
DATABASE_URL=postgres://user:password@localhost:5432/bloggr
JWT_SECRET=your_jwt_secret
BCRYPT_SALT_ROUNDS=12
PORT=3000
```

### 4. Database Setup
```bash
npx sequelize-cli db:migrate
```

### 5. Run the development server
```bash
npm run dev
```

### 6. Run tests
```bash
npm test
```

## Project Structure
```
blogger/
├── controllers/
├── middleware/
├── models/
├── routes/
├── validators/
├── tests/
├── app.js
├── server.js
├── .env
├── README.md
└── ...
```

## Contributing
- Follow the coding standards and commit conventions in `.cursor/rules/general_rules.mdc`.
- All API inputs must be validated and sanitized.
- Write unit tests for all new logic.

---

For more details, see [docs/API_SPEC.md](docs/API_SPEC.md) and [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md). 