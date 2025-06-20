const request = require('supertest');
const { BlogPost, User } = require('../models');
const app = require('../app');
const jwt = require('jsonwebtoken');

describe('Blog Post Edge Cases', () => {
  let token;
  let userId;
  let user;

  beforeEach(async () => {
    // Create a test user and generate token
    user = await User.create({
      name: 'Test User',
      email: `test-post-${Date.now()}@example.com`,
      password: 'Password123'
    });
    userId = user.id;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
  });

  afterEach(async () => {
    await BlogPost.destroy({ where: {}, truncate: true, cascade: true });
  });

  afterAll(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  describe('POST /api/posts', () => {
    it('returns 401 if no token provided', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ title: 'Title', content: 'Content' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for empty title', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '', content: 'Content' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for empty content', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Title', content: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for title too short', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'A', content: 'Content' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for content too long', async () => {
      const longContent = 'a'.repeat(10001);
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Title', content: longContent });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for malformed request body', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send('not-json');
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 409 or 400 for duplicate post title', async () => {
      await BlogPost.create({ 
        title: 'Unique Title', 
        content: 'Content', 
        author_id: userId 
      });
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Unique Title', content: 'Different content' });
      expect([400, 409]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for SQL injection attempt', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: "Robert'); DROP TABLE posts;--", content: 'Content' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for XSS attempt', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '<script>alert(1)</script>', content: 'Content' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for extremely long input values', async () => {
      const longTitle = 'a'.repeat(300);
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: longTitle, content: 'Content' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 401/403 for unauthorized user', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ title: 'Title', content: 'Content' });
      expect([401, 403]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('error');
    });

    it('ignores/returns 400 for forbidden fields', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Title', content: 'Content', createdAt: '2020-01-01' });
      expect([201, 400]).toContain(res.statusCode);
      if (res.statusCode === 201) {
        expect(res.body).not.toHaveProperty('createdAt', '2020-01-01');
      }
    });

    it('returns 400 for whitespace-only title/content', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '   ', content: '   ' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('creates a valid post for update/delete/view tests', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Valid Post', content: 'Valid content' });
      expect([201, 200]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('id');
    });
  });

  describe('PUT /api/posts/:id', () => {
    let post;
    beforeEach(async () => {
      post = await BlogPost.create({ 
        title: 'Update Me', 
        content: 'Content', 
        author_id: userId 
      });
    });

    it('returns 404 for update non-existent post', async () => {
      const res = await request(app)
        .put('/api/posts/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New Title' });
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 401/403 for unauthorized user', async () => {
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@example.com',
        password: 'Password123'
      });
      const otherToken = jwt.sign({ id: otherUser.id }, process.env.JWT_SECRET);
      const res = await request(app)
        .put(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'New Title' });
      expect([401, 403]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for empty/invalid fields', async () => {
      const res = await request(app)
        .put(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for XSS/SQL injection', async () => {
      const res = await request(app)
        .put(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '<script>alert(1)</script>' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('ignores/returns 400 for extra/unexpected fields', async () => {
      const res = await request(app)
        .put(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New Title', createdAt: '2020-01-01' });
      expect([200, 400]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).not.toHaveProperty('createdAt', '2020-01-01');
      }
    });
  });

  describe('DELETE /api/posts/:id', () => {
    let post;
    beforeEach(async () => {
      post = await BlogPost.create({ 
        title: 'Delete Me', 
        content: 'Content', 
        author_id: userId 
      });
    });

    it('returns 404 for delete non-existent post', async () => {
      const res = await request(app)
        .delete('/api/posts/99999')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });

    it('returns 401/403 for unauthorized user', async () => {
      const res = await request(app)
        .delete(`/api/posts/${post.id}`);
      expect([401, 403]).toContain(res.statusCode);
    });

    it('returns 404 for already deleted post', async () => {
      // Delete once
      await request(app)
        .delete(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${token}`);
      // Delete again
      const res = await request(app)
        .delete(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /posts/:id', () => {
    it('returns 404 for view non-existent post', async () => {
      const res = await request(app)
        .get('/posts/99999');
      expect(res.statusCode).toBe(404);
    });
    it('returns 400 for invalid ID format', async () => {
      const res = await request(app)
        .get('/posts/invalid-id');
      expect([400, 404]).toContain(res.statusCode);
    });
  });
}); 