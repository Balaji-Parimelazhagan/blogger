const request = require('supertest');
const { BlogPost, User, Comment } = require('../models');
const app = require('../app');
const jwt = require('jsonwebtoken');

describe('Comment API Endpoints', () => {
  let token;
  let user;
  let post;

  beforeAll(async () => {
    // Clean up database before all tests
    await User.destroy({ where: {}, truncate: true, cascade: true });
    await BlogPost.destroy({ where: {}, truncate: true, cascade: true });
  });

  beforeEach(async () => {
    // Create a test user and post for each test
    user = await User.create({
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'Password123',
    });
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    post = await BlogPost.create({
      title: 'Test Post',
      content: 'This is a test post.',
      author_id: user.id,
    });
  });

  afterEach(async () => {
    // Clean up database after each test
    await Comment.destroy({ where: {}, truncate: true, cascade: true });
    await BlogPost.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  describe('POST /api/posts/:post_id/comments', () => {
    it('should create a new comment on a post', async () => {
      const res = await request(app)
        .post(`/api/posts/${post.id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'This is a great post!' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.content).toBe('This is a great post!');
      expect(res.body.author_id).toBe(user.id);
    });

    it('should return 401 if user is not authenticated', async () => {
      const res = await request(app)
        .post(`/api/posts/${post.id}/comments`)
        .send({ content: 'Trying to comment without logging in' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Missing or invalid Authorization header');
    });

    it('should return 404 if post is not found', async () => {
      const nonExistentPostId = 99999;
      const res = await request(app)
        .post(`/api/posts/${nonExistentPostId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'A comment on a non-existent post' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Post not found');
    });

    it('should return 400 if comment content is empty', async () => {
      const res = await request(app)
        .post(`/api/posts/${post.id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should sanitize XSS content from comment', async () => {
        const xssContent = '<script>alert("xss")</script>Some safe text.';
        const sanitizedContent = 'Some safe text.';
        const res = await request(app)
          .post(`/api/posts/${post.id}/comments`)
          .set('Authorization', `Bearer ${token}`)
          .send({ content: xssContent });

        expect(res.statusCode).toBe(201);
        expect(res.body.content).toBe(sanitizedContent);
      });
  });

  describe('GET /api/posts/:post_id/comments', () => {
    beforeEach(async () => {
        // Create some comments for the post
        await Comment.bulkCreate([
            { post_id: post.id, author_id: user.id, content: 'First comment' },
            { post_id: post.id, author_id: user.id, content: 'Second comment' },
        ]);
    });

    it('should list all comments for a specific post', async () => {
      const res = await request(app)
        .get(`/api/posts/${post.id}/comments`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(2);
      expect(res.body[0].content).toBe('First comment');
    });

    it('should return 404 if post is not found', async () => {
        const nonExistentPostId = 99999;
        const res = await request(app)
          .get(`/api/posts/${nonExistentPostId}/comments`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'Post not found');
    });

    it('should return an empty array if post has no comments', async () => {
        const newPost = await BlogPost.create({
            title: 'Post with no comments',
            content: 'Content here',
            author_id: user.id
        });

        const res = await request(app)
          .get(`/api/posts/${newPost.id}/comments`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(0);
    });

    it('should handle pagination with limit and offset', async () => {
        const res = await request(app)
          .get(`/api/posts/${post.id}/comments?limit=1&offset=1`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(1);
        expect(res.body[0].content).toBe('Second comment');
    });
  });
}); 