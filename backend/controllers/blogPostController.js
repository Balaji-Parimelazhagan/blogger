const BlogPost = require('../models/blogPost');
const { validationResult } = require('express-validator');
const DOMPurify = require('isomorphic-dompurify');
const User = require('../models/user');
const BlogEventManager = require('../notifications/blogEventManager');
const InAppNotificationObserver = require('../notifications/inAppNotificationObserver');
const { createBlogEvent } = require('../notifications/eventTypes');
const Tag = require('../models/tag');

// Initialize event manager and attach observer (in a real app, this should be done once globally)
const eventManager = new BlogEventManager();
eventManager.attach(new InAppNotificationObserver());

exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, content, published, tagIds } = req.body;
    // Sanitize content to prevent XSS
    const cleanContent = DOMPurify.sanitize(content);
    const post = await BlogPost.create({
      title,
      content: cleanContent,
      published: published === true,
      author_id: req.user.id,
    });

    // Handle tags if provided
    if (Array.isArray(tagIds) && tagIds.length > 0) {
      // Remove duplicates
      const uniqueTagIds = [...new Set(tagIds)];
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

exports.getPostById = async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    // If not published, only author can view
    if (!post.published) {
      if (!req.user || req.user.id !== post.author_id) {
        return res.status(403).json({ error: 'Forbidden: Not allowed to view this draft' });
      }
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (!req.user || req.user.id !== post.author_id) {
      return res.status(403).json({ error: 'Forbidden: Only the author can update this post' });
    }
    const { title, content, published, tagIds } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = DOMPurify.sanitize(content);
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
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (!req.user || req.user.id !== post.author_id) {
      return res.status(403).json({ error: 'Forbidden: Only the author can delete this post' });
    }
    await post.destroy();
    res.status(204).send();
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