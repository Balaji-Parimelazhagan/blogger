const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class PostTag extends Model {}
  PostTag.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'blog_posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'tags',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'PostTag',
      tableName: 'post_tags',
      timestamps: false,
    }
  );
  return PostTag;
}; 