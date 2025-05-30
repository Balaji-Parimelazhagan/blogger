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