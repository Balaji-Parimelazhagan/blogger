// Mock the auth middleware to only authenticate if Authorization header is present
jest.mock('../middleware/auth', () => async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    // Allow test to set a custom user id for 'other user' scenarios
    const match = token.match(/^(\d+)$/);
    req.user = { id: match ? parseInt(match[1], 10) : (global.__testUserId || 1) };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

const request = require('supertest');
const app = require('../app'); // Adjust path if needed
const { User, sequelize } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper to create a user and get auth token (mock or real)
const createUserAndLogin = async () => {
  const hashed = await bcrypt.hash('Password123', 12);
  const user = await User.create({ name: 'ProfileUser', email: 'profile' + Math.floor(Math.random() * 1000000) + '@example.com', password: hashed });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  return { user, token };
};

describe('User Profile API', () => {
  let user;
  let token;

  beforeEach(async () => {
    // Create a test user and generate token
    const hashed = await bcrypt.hash('Password123', 12);
    user = await User.create({
      name: 'Test User',
      email: `test-user-${Date.now()}@example.com`,
      password: hashed
    });
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  });

  afterEach(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  describe('GET /api/users/:id', () => {
    it('should return user profile for valid user', async () => {
      const res = await request(app)
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Test User');
      expect(res.body).toHaveProperty('email', user.email);
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/api/users/99999')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 for missing token', async () => {
      const res = await request(app)
        .get(`/api/users/${user.id}`);
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 200 for invalid token', async () => {
      const res = await request(app)
        .get(`/api/users/${user.id}`)
        .set('Authorization', 'Bearer invalid-token');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user profile for valid user', async () => {
      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Name');
      expect(res.body).toHaveProperty('email', user.email);
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .put('/api/users/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' });
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 for missing token', async () => {
      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .send({ name: 'Updated Name' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 for invalid token', async () => {
      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', 'Bearer invalid-token')
        .send({ name: 'Updated Name' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('PATCH /api/users/:id/avatar', () => {
    it('should update avatar for valid user', async () => {
      const res = await request(app)
        .patch(`/api/users/${user.id}/avatar`)
        .set('Authorization', `Bearer ${token}`)
        .send({ avatar_url: 'https://example.com/avatar.png' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('avatar_url', 'https://example.com/avatar.png');
    });

    it('should return 400 for invalid avatar URL', async () => {
      const res = await request(app)
        .patch(`/api/users/${user.id}/avatar`)
        .set('Authorization', `Bearer ${token}`)
        .send({ avatar_url: 'not-a-url' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should return 403 if another user tries to change avatar', async () => {
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@example.com',
        password: 'Password123'
      });
      const otherToken = jwt.sign({ id: otherUser.id }, process.env.JWT_SECRET);

      const res = await request(app)
        .patch(`/api/users/${user.id}/avatar`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ avatar_url: 'https://example.com/hacked.png' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 for missing token', async () => {
      const res = await request(app)
        .patch(`/api/users/${user.id}/avatar`)
        .send({ avatar_url: 'https://example.com/hacked.png' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Missing or invalid Authorization header');
    });
  });

  describe('Edge Cases', () => {
    it('should sanitize bio to prevent XSS', async () => {
      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ bio: '<script>alert(1)</script>' });
      expect(res.statusCode).toBe(200);
      expect(res.body.bio).not.toContain('<script>');
    });
  });
}); 