const { sequelize } = require('./models');

module.exports = async () => {
  process.env.DATABASE_URL = 'postgres://postgres:root@localhost:5433/bloggr_test';
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.NODE_ENV = 'test';

  try {
    await sequelize.authenticate();
    console.log('Global setup: Database connection established successfully.');
    await sequelize.sync({ force: true });
  } catch (err) {
    console.error('Global setup: Unable to connect to the database:', err);
    process.exit(1);
  }
}; 