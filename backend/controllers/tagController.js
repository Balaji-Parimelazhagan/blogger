const { Tag, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { BlogPost } = require('../models');

exports.createTag = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array().map(err => err.msg).join(', ') });
    }

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { name, slug } = req.body;

    // Check for existing tag
    const existingTag = await Tag.findOne({
      where: {
        [Op.or]: [{ name }, { slug }]
      }
    });

    if (existingTag) {
      return res.status(409).json({ error: 'Tag name or slug must be unique' });
    }

    const tag = await Tag.create({ name, slug });
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.listTags = async (req, res, next) => {
  try {
    const tags = await Tag.findAll();
    res.json(tags);
  } catch (err) {
    next(err);
  }
};

exports.getTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    res.json(tag);
  } catch (err) {
    next(err);
  }
};

exports.deleteTag = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    await tag.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.addTagToPost = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { postId, tagId } = req.params;

    const post = await BlogPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to modify this post' });
    }

    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    await post.addTag(tag);
    res.status(200).json({ message: 'Tag added to post' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 