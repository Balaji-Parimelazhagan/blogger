const { Post, User } = require('../models');
const DOMPurify = require('isomorphic-dompurify');

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Check for SQL injection/XSS patterns
    const suspicious = /('|--|;|<script>)/i;
    if (suspicious.test(title)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const post = await Post.create({
      title: DOMPurify.sanitize(title),
      content: DOMPurify.sanitize(content),
      authorId: req.user.id
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Check for SQL injection/XSS patterns
    const suspicious = /('|--|;|<script>)/i;
    if (title && suspicious.test(title)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const updateFields = {};
    if (title) updateFields.title = DOMPurify.sanitize(title);
    if (content) updateFields.content = DOMPurify.sanitize(content);

    await post.update(updateFields);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await post.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }

    const post = await Post.findByPk(id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 