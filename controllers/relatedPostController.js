const RelatedPost = require('../models/relatedPost');
const BlogPost = require('../models/blogPost');

exports.listRelated = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const post = await BlogPost.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    // Find related posts (join on related_posts)
    const related = await RelatedPost.findAll({
      where: { post_id },
      include: [{ model: BlogPost, as: 'Related', foreignKey: 'related_post_id' }],
    });
    // Map to just the related BlogPost objects
    const relatedPosts = await BlogPost.findAll({
      where: {
        id: related.map(r => r.related_post_id)
      }
    });
    res.json(relatedPosts);
  } catch (err) {
    next(err);
  }
};

exports.addRelated = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const { related_post_id } = req.body;
    if (!related_post_id || isNaN(Number(related_post_id))) {
      return res.status(400).json({ error: 'related_post_id is required and must be an integer' });
    }
    if (Number(post_id) === Number(related_post_id)) {
      return res.status(400).json({ error: 'A post cannot be related to itself' });
    }
    const post = await BlogPost.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (!req.user || req.user.id !== post.author_id) {
      return res.status(403).json({ error: 'Forbidden: Only the author can add related posts' });
    }
    const relatedPost = await BlogPost.findByPk(related_post_id);
    if (!relatedPost) {
      return res.status(404).json({ error: 'Related post not found' });
    }
    // Prevent duplicate relation
    const exists = await RelatedPost.findOne({ where: { post_id, related_post_id } });
    if (exists) {
      return res.status(400).json({ error: 'This relation already exists' });
    }
    const relation = await RelatedPost.create({ post_id, related_post_id });
    res.status(201).json(relation);
  } catch (err) {
    next(err);
  }
}; 