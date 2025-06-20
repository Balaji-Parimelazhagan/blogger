const { Sequelize } = require('sequelize');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Please create a .env file in the project root.');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

// Import model definition functions
const defineBlogPost = require('./blogPost');
const defineTag = require('./tag');
const definePostTag = require('./postTag');
const defineRelatedPost = require('./relatedPost');
const defineUser = require('./user');
const defineComment = require('./comment');

// Initialize models
const BlogPost = defineBlogPost(sequelize);
const Tag = defineTag(sequelize);
const PostTag = definePostTag(sequelize);
const RelatedPost = defineRelatedPost(sequelize);
const User = defineUser(sequelize);
const Comment = defineComment(sequelize);

// Set up associations
BlogPost.hasMany(RelatedPost, { as: 'RelatedLinks', foreignKey: 'post_id' });
BlogPost.hasMany(RelatedPost, { as: 'RelatedTo', foreignKey: 'related_post_id' });
RelatedPost.belongsTo(BlogPost, { as: 'Related', foreignKey: 'related_post_id' });

BlogPost.belongsToMany(Tag, {
  through: PostTag,
  foreignKey: 'post_id',
  otherKey: 'tag_id',
  as: 'tags',
});
Tag.belongsToMany(BlogPost, {
  through: PostTag,
  foreignKey: 'tag_id',
  otherKey: 'post_id',
  as: 'posts',
});

// User associations
BlogPost.belongsTo(User, { as: 'author', foreignKey: 'author_id' });
User.hasMany(BlogPost, { as: 'posts', foreignKey: 'author_id' });

// Comment associations
Comment.belongsTo(User, { as: 'author', foreignKey: 'author_id' });
User.hasMany(Comment, { as: 'comments', foreignKey: 'author_id' });

Comment.belongsTo(BlogPost, { as: 'post', foreignKey: 'post_id' });
BlogPost.hasMany(Comment, { as: 'comments', foreignKey: 'post_id' });

module.exports = { sequelize, BlogPost, Tag, PostTag, RelatedPost, User, Comment }; 