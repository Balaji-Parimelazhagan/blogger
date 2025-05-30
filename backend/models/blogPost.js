const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./index');
const RelatedPost = require('./relatedPost');

class BlogPost extends Model {}

BlogPost.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'BlogPost',
    tableName: 'blog_posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

BlogPost.hasMany(RelatedPost, { as: 'RelatedLinks', foreignKey: 'post_id' });
BlogPost.hasMany(RelatedPost, { as: 'RelatedTo', foreignKey: 'related_post_id' });
RelatedPost.belongsTo(BlogPost, { as: 'Related', foreignKey: 'related_post_id' });

module.exports = BlogPost; 