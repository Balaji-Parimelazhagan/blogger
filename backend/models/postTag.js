const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./index');

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

module.exports = PostTag; 