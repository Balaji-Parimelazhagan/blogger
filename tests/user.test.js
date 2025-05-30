const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const { sequelize } = require('../models');

describe('POST /users', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });
  afterEach(async () => {
    await User.destroy({ where: {} });
  });
  afterAll(async () => {
    await sequelize.close();
  });

  it('registers a new user successfully', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'Password123' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', 'alice@example.com');
    expect(res.body).not.toHaveProperty('password');
  });

  it('returns 409 if email already exists', async () => {
    await User.create({ name: 'Bob', email: 'bob@example.com', password: 'hashed' });
    const res = await request(app)
      .post('/users')
      .send({ name: 'Bob', email: 'bob@example.com', password: 'Password123' });
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for invalid input', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: '', email: 'not-an-email', password: '123' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('returns 429 if rate limit exceeded', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/users')
        .send({ name: 'Test', email: `test${i}@example.com`, password: 'Password123' });
    }
    const res = await request(app)
      .post('/users')
      .send({ name: 'Test', email: 'test6@example.com', password: 'Password123' });
    expect(res.statusCode).toBe(429);
    expect(res.body).toHaveProperty('error');
  });
}); 