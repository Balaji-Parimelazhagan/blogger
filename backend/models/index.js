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

// Initialize models
const BlogPost = defineBlogPost(sequelize);
const Tag = defineTag(sequelize);
const PostTag = definePostTag(sequelize);
const RelatedPost = defineRelatedPost(sequelize);
const User = defineUser(sequelize);

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

module.exports = { sequelize, BlogPost, Tag, PostTag, RelatedPost, User }; 