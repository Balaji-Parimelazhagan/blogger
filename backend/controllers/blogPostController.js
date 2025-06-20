const { BlogPost, Tag, User } = require('../models');
const { validationResult } = require('express-validator');
const DOMPurify = require('isomorphic-dompurify');
const BlogEventManager = require('../notifications/blogEventManager');
const InAppNotificationObserver = require('../notifications/inAppNotificationObserver');
const { createBlogEvent } = require('../notifications/eventTypes');

// Initialize event manager and attach observer (in a real app, this should be done once globally)
const eventManager = new BlogEventManager();
eventManager.attach(new InAppNotificationObserver());

exports.createPost = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { title, content } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length < 2 || title.length > 200) {
      return res.status(400).json({ error: 'Title must be 2-200 chars' });
    }
    if (!content || typeof content !== 'string' || content.trim().length < 1 || content.length > 10000) {
      return res.status(400).json({ error: 'Content must be 1-10000 chars' });
    }
    const suspicious = /('|--|;|<script>)/i;
    if (suspicious.test(title) || suspicious.test(content)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    // Check for duplicate title for this user
    const existing = await BlogPost.findOne({ where: { title, author_id: req.user.id } });
    if (existing) {
      return res.status(409).json({ error: 'Post title already exists' });
    }
    // Sanitize content to prevent XSS
    const cleanContent = DOMPurify.sanitize(content);
    const post = await BlogPost.create({
      title,
      content: cleanContent,
      published: req.body.published === true,
      author_id: req.user.id,
    });

    // Handle tags if provided
    if (Array.isArray(req.body.tagIds) && req.body.tagIds.length > 0) {
      // Remove duplicates
      const uniqueTagIds = [...new Set(req.body.tagIds)];
      // Ensure all tags exist
      const tags = await Tag.findAll({ where: { id: uniqueTagIds } });
      if (tags.length !== uniqueTagIds.length) {
        return res.status(400).json({ error: 'One or more tags do not exist' });
      }
      await post.setTags(tags);
    }

    // Notify observers of new post event
    const event = createBlogEvent(
      'POST_CREATED',
      {
        postId: post.id,
        title: post.title,
        authorId: req.user.id,
        status: 'created'
      },
      req.user.id
    );
    eventManager.notify(event);

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.listPosts = async (req, res, next) => {
  try {
    const {
      author_id,
      published,
      limit = 20,
      offset = 0,
      sortBy = 'created_at',
      order = 'desc',
    } = req.query;

    const where = {};
    if (author_id) where.author_id = author_id;
    if (published !== undefined) where.published = published === 'true';
    else where.published = true; // default: only published

    const posts = await BlogPost.findAll({
      where,
      limit: Math.min(Number(limit), 100),
      offset: Number(offset),
      order: [[sortBy, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']],
    });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId) || postId < 1) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    const post = await BlogPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId) || postId < 1) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const post = await BlogPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (post.author_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { title, content, published, tagIds } = req.body;
    if (title !== undefined && (typeof title !== 'string' || title.trim().length < 2 || title.length > 200)) {
      return res.status(400).json({ error: 'Title must be 2-200 chars' });
    }
    if (content !== undefined && (typeof content !== 'string' || content.trim().length < 1 || content.length > 10000)) {
      return res.status(400).json({ error: 'Content must be 1-10000 chars' });
    }
    if (title !== undefined && title.trim().length === 0) {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    if (content !== undefined && content.trim().length === 0) {
      return res.status(400).json({ error: 'Content must be a non-empty string' });
    }
    const suspicious = /('|--|;|<script>)/i;
    if ((title && suspicious.test(title)) || (content && suspicious.test(content))) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (published !== undefined) post.published = published;
    await post.save();

    // Handle tags if provided
    if (Array.isArray(tagIds)) {
      // Remove duplicates
      const uniqueTagIds = [...new Set(tagIds)];
      // Ensure all tags exist
      const tags = await Tag.findAll({ where: { id: uniqueTagIds } });
      if (tags.length !== uniqueTagIds.length) {
        return res.status(400).json({ error: 'One or more tags do not exist' });
      }
      await post.setTags(tags);
    }

    // Notify observers of post update event
    const event = createBlogEvent(
      'POST_UPDATED',
      {
        postId: post.id,
        title: post.title,
        authorId: req.user.id,
        status: 'updated'
      },
      req.user.id
    );
    eventManager.notify(event);

    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId) || postId < 1) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const post = await BlogPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (post.author_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await post.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

/**
 * List tags for a post
 */
exports.listTagsForPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id, {
      include: [{ model: Tag, as: 'tags' }],
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post.tags);
  } catch (err) {
    next(err);
  }
};

/**
 * Add a tag to a post
 */
exports.addTagToPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const { tagId } = req.body;
    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    await post.addTag(tag);
    res.status(200).json({ message: 'Tag added to post' });
  } catch (err) {
    next(err);
  }
};

/**
 * Remove a tag from a post
 */
exports.removeTagFromPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const { tagId } = req.body;
    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    await post.removeTag(tag);
    res.status(200).json({ message: 'Tag removed from post' });
  } catch (err) {
    next(err);
  }
}; 