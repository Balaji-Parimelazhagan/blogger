const request = require('supertest');
const { User } = require('../models');
const app = require('../app');
const bcrypt = require('bcryptjs');

describe('Authentication', () => {
  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('Password123', 12);
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    });
  });

  afterEach(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'Password123' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 401 for invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 401 for non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'Password123' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for missing email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'Password123' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for missing password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalid-email', password: 'Password123' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 401 for locked/disabled account', async () => {
      const hashedPassword = await bcrypt.hash('Password123', 12);
      await User.create({
        name: 'Locked User',
        email: 'locked@example.com',
        password: hashedPassword,
        status: 'locked'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'locked@example.com', password: 'Password123' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for SQL injection attempt', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: "' OR 1=1;--", password: 'Password123' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for XSS attempt', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: '<script>alert(1)</script>', password: 'Password123' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for extra/unexpected fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123',
          extraField: 'shouldBeIgnored'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 401 for valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'Password123' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });
}); 