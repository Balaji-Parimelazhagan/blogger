// Mock the auth middleware to only authenticate if Authorization header is present
jest.mock('../middleware/auth', () => (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    // Allow test to set a custom user id for 'other user' scenarios
    const match = authHeader.match(/Bearer (\d+)/);
    req.user = { id: match ? parseInt(match[1], 10) : (global.__testUserId || 1) };
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

const request = require('supertest');
const app = require('../app'); // Adjust path if needed
const { sequelize, User } = require('../models');

// Helper to create a user and get auth token (mock or real)
async function createUserAndLogin(overrides = {}) {
  const user = await User.create({
    name: 'Test User',
    email: `testuser${Date.now()}@example.com`,
    password: 'Password123!',
    bio: 'Test bio',
    avatar_url: null,
    ...overrides,
  });
  // Simulate login and return token (replace with your auth logic)
  const token = 'mocked-jwt-token';
  return { user, token };
}

describe('User Profile API', () => {
  let user, token;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    ({ user, token } = await createUserAndLogin());
    global.__testUserId = user.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/users/:id', () => {
    it('should return user profile for valid user', async () => {
      const res = await request(app)
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', user.id);
      expect(res.body).toHaveProperty('name', user.name);
      expect(res.body).toHaveProperty('email', user.email);
      expect(res.body).toHaveProperty('bio', user.bio);
    });
    it('should return 404 if user not found', async () => {
      const res = await request(app)
        .get('/api/users/99999')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .get(`/api/users/${user.id}`);
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user profile', async () => {
      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name', bio: 'Updated bio' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Name');
      expect(res.body).toHaveProperty('bio', 'Updated bio');
    });
    it('should not allow updating email', async () => {
      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'newemail@example.com' });
      expect(res.statusCode).toBe(400);
    });
    it('should return 400 for invalid data', async () => {
      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '' });
      expect(res.statusCode).toBe(400);
    });
    it('should return 403 if another user tries to update', async () => {
      const { user: otherUser } = await createUserAndLogin({ email: 'other@example.com' });
      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${otherUser.id}`)
        .send({ name: 'Hacker' });
      expect(res.statusCode).toBe(403);
    });
    it('should return 404 if user not found', async () => {
      const res = await request(app)
        .put('/api/users/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'No User' });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/users/:id/avatar', () => {
    it('should update avatar_url with a valid URL', async () => {
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
    });
    it('should return 403 if another user tries to change avatar', async () => {
      const { user: otherUser } = await createUserAndLogin({ email: 'avatarhacker@example.com' });
      const res = await request(app)
        .patch(`/api/users/${user.id}/avatar`)
        .set('Authorization', `Bearer ${otherUser.id}`)
        .send({ avatar_url: 'https://example.com/hacker.png' });
      expect(res.statusCode).toBe(403);
    });
    it('should return 404 if user not found', async () => {
      const res = await request(app)
        .patch('/api/users/99999/avatar')
        .set('Authorization', `Bearer ${token}`)
        .send({ avatar_url: 'https://example.com/avatar.png' });
      expect(res.statusCode).toBe(404);
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
    // Add more edge case tests as needed
  });
}); 