const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./index');
const BlogPost = require('./blogPost');

class RelatedPost extends Model {}

RelatedPost.init(
  {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'blog_posts',
        key: 'id',
      },
    },
    related_post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'blog_posts',
        key: 'id',
      },
      validate: {
        notSelf(value) {
          if (value === this.post_id) {
            throw new Error('A post cannot be related to itself');
          }
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'RelatedPost',
    tableName: 'related_posts',
    timestamps: false,
  }
);

module.exports = RelatedPost; 