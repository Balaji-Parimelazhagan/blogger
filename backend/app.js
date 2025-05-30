require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const usersRouter = require('./routes/users');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');

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
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/posts', postsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app; 