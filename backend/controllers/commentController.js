const Comment = require('../models/comment');
const BlogPost = require('../models/blogPost');
const { validationResult } = require('express-validator');
const DOMPurify = require('isomorphic-dompurify');
const BlogEventManager = require('../notifications/blogEventManager');
const InAppNotificationObserver = require('../notifications/inAppNotificationObserver');
const { createBlogEvent } = require('../notifications/eventTypes');

// Initialize event manager and attach observer (in a real app, this should be done once globally)
const eventManager = new BlogEventManager();
eventManager.attach(new InAppNotificationObserver());

exports.addComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { content } = req.body;
    const post = await BlogPost.findByPk(req.params.post_id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const cleanContent = DOMPurify.sanitize(content);
    const comment = await Comment.create({
      post_id: post.id,
      author_id: req.user.id,
      content: cleanContent,
    });

    // Notify observers of new comment event
    const event = createBlogEvent(
      'NEW_COMMENT',
      {
        postId: post.id,
        commentId: comment.id,
        content: cleanContent,
        authorId: req.user.id
      },
      req.user.id
    );
    eventManager.notify(event);

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

exports.listComments = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    const post = await BlogPost.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const comments = await Comment.findAll({
      where: { post_id },
      limit: Math.min(Number(limit), 100),
      offset: Number(offset),
      order: [['created_at', 'ASC']],
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
}; 