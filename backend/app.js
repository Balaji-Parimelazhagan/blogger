require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const usersRouter = require('./routes/users');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
let swaggerDocument;
if (process.env.NODE_ENV !== 'test') {
  swaggerDocument = YAML.load('./swagger.yaml');
}
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');
const tagsRouter = require('./routes/tags');

// Middleware
app.use(express.json());

// CORS setup for frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Routes
// TODO: Add user, post, comment, related routes
// Example: app.use('/users', require('./routes/users'));
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/tags', tagsRouter);
if (process.env.NODE_ENV !== 'test') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ errors: ['Not Found'] });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.errors && Array.isArray(err.errors)) {
    // express-validator or similar
    return res.status(err.status || 400).json({ error: err.errors[0].message || err.errors[0] });
  }
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: err.errors[0].message });
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app; 