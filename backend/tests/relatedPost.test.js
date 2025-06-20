const request = require('supertest');
const { BlogPost, User, RelatedPost } = require('../models');
const app = require('../app');
const jwt = require('jsonwebtoken');

describe('Related Post API Endpoints', () => {
  let token;
  let user;
  let post1;
  let post2;

  beforeEach(async () => {
    user = await User.create({
      name: 'Test User',
      email: `test-related-${Date.now()}@example.com`,
      password: 'Password123',
    });
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    post1 = await BlogPost.create({
      title: 'Main Post',
      content: 'Content for the main post.',
      author_id: user.id,
    });

    post2 = await BlogPost.create({
      title: 'Related Post',
      content: 'Content for the related post.',
      author_id: user.id,
    });
  });

  afterEach(async () => {
    await RelatedPost.destroy({ where: {} });
    await BlogPost.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe('POST /api/posts/:post_id/related', () => {
    it('should add a related post', async () => {
      const res = await request(app)
        .post(`/api/posts/${post1.id}/related`)
        .set('Authorization', `Bearer ${token}`)
        .send({ related_post_id: post2.id });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('post_id', post1.id);
      expect(res.body).toHaveProperty('related_post_id', post2.id);
    });

    it('should return 401 for unauthenticated user', async () => {
        const res = await request(app)
          .post(`/api/posts/${post1.id}/related`)
          .send({ related_post_id: post2.id });
        expect(res.statusCode).toBe(401);
    });

    it('should return 403 for non-author', async () => {
        const otherUser = await User.create({ name: 'Other', email: `other-${Date.now()}@example.com`, password: 'pw' });
        const otherToken = jwt.sign({ id: otherUser.id }, process.env.JWT_SECRET);
        const res = await request(app)
            .post(`/api/posts/${post1.id}/related`)
            .set('Authorization', `Bearer ${otherToken}`)
            .send({ related_post_id: post2.id });
        expect(res.statusCode).toBe(403);
    });

    it('should return 400 for relating a post to itself', async () => {
        const res = await request(app)
            .post(`/api/posts/${post1.id}/related`)
            .set('Authorization', `Bearer ${token}`)
            .send({ related_post_id: post1.id });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'A post cannot be related to itself');
    });
  });

  describe('GET /api/posts/:post_id/related', () => {
    it('should list related posts', async () => {
        await RelatedPost.create({ post_id: post1.id, related_post_id: post2.id });
        const res = await request(app).get(`/api/posts/${post1.id}/related`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(1);
        expect(res.body[0].id).toBe(post2.id);
    });
  });

  describe('DELETE /api/posts/:post_id/related/:related_post_id', () => {
    it('should remove a related post', async () => {
        await RelatedPost.create({ post_id: post1.id, related_post_id: post2.id });
        const res = await request(app)
            .delete(`/api/posts/${post1.id}/related/${post2.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(204);
        
        const relation = await RelatedPost.findOne({ where: { post_id: post1.id, related_post_id: post2.id }});
        expect(relation).toBeNull();
    });
  });
}); 