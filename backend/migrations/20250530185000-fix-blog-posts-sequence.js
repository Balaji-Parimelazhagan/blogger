"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // For PostgreSQL: reset the sequence to the max id in blog_posts
    await queryInterface.sequelize.query(
      `SELECT setval('blog_posts_id_seq', (SELECT COALESCE(MAX(id), 1) FROM blog_posts));`
    );
  },
  down: async (queryInterface, Sequelize) => {
    // No-op
  },
}; 