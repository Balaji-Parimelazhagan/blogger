"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("related_posts", {
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "blog_posts",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      related_post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "blog_posts",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });
    await queryInterface.addConstraint("related_posts", {
      fields: ["post_id", "related_post_id"],
      type: "primary key",
      name: "pk_related_posts"
    });
    await queryInterface.addConstraint("related_posts", {
      fields: ["post_id", "related_post_id"],
      type: "check",
      where: {
        post_id: { [Sequelize.Op.ne]: Sequelize.col('related_post_id') }
      },
      name: "chk_no_self_relation"
    });
    await queryInterface.addIndex("related_posts", ["post_id"], { name: "idx_related_posts_post_id" });
    await queryInterface.addIndex("related_posts", ["related_post_id"], { name: "idx_related_posts_related_post_id" });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("related_posts");
  },
}; 