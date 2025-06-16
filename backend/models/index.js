const { Sequelize } = require('sequelize');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Please create a .env file in the project root.');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

// Load models and associations
const BlogPost = require('./blogPost');
const Tag = require('./tag');
const PostTag = require('./postTag');

module.exports = { sequelize, BlogPost, Tag, PostTag }; 