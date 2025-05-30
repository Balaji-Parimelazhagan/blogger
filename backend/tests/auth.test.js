const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const { sequelize } = require('../models');
const bcrypt = require('bcrypt');

describe('POST /auth/login', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    const hashed = await bcrypt.hash('Password123', 12);
    await User.create({ name: 'Frank', email: 'frank@example.com', password: hashed });
  });
  afterAll(async () => {
    await sequelize.close();
  });

  it('returns JWT on successful login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'frank@example.com', password: 'Password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'frank@example.com', password: 'WrongPass123' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 401 for wrong email', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'notfound@example.com', password: 'Password123' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for invalid input', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'bad', password: '123' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
}); 