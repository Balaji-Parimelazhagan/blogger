const request = require('supertest');
const { sequelize, BlogPost, Tag } = require('../models');
const app = require('../app');

describe('Tagging Endpoints Integration', () => {
  let post, tag1, tag2;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    post = await BlogPost.create({ title: 'Test Post', content: 'Content', published: true, author_id: 1 });
    tag1 = await Tag.create({ name: 'Node', slug: 'node' });
    tag2 = await Tag.create({ name: 'Express', slug: 'express' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should add a tag to a post', async () => {
    const res = await request(app)
      .post(`/posts/${post.id}/tags`)
      .send({ tagId: tag1.id });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Tag added to post');
  });

  it('should list tags for a post', async () => {
    // Add another tag
    await post.addTag(tag2);
    const res = await request(app)
      .get(`/posts/${post.id}/tags`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body.map(t => t.name)).toEqual(expect.arrayContaining(['Node', 'Express']));
  });

  it('should remove a tag from a post', async () => {
    const res = await request(app)
      .delete(`/posts/${post.id}/tags`)
      .send({ tagId: tag1.id });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Tag removed from post');
    // Confirm removal
    const tagsRes = await request(app).get(`/posts/${post.id}/tags`);
    expect(tagsRes.body.map(t => t.name)).not.toContain('Node');
  });
}); 