const { sequelize } = require('../models');

beforeAll(async () => {
  // Set test environment variables
  process.env.DATABASE_URL = 'postgres://postgres:root@localhost:5433/bloggr_test';
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.NODE_ENV = 'test';

  try {
    // Test database connection
    await sequelize.authenticate();
    // Sync database before all tests
    await sequelize.sync({ force: true });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
});

afterAll(async () => {
  // Close database connection after all tests
  await sequelize.close();
});