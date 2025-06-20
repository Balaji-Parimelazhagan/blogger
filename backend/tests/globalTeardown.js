const { sequelize } = require('./models');

module.exports = async () => {
  try {
    await sequelize.close();
    console.log('Global teardown: Database connection closed.');
  } catch (err) {
    console.error('Global teardown: Error closing the database connection:', err);
    process.exit(1);
  }
}; 