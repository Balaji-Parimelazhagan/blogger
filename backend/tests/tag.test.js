const request = require('supertest');
const { Tag, User, sequelize } = require('../models');
const app = require('../app');
const jwt = require('jsonwebtoken');

describe('Tag Model & Controller', () => {
  let token;
  let user;

  beforeEach(async () => {
    // Create a test user and generate token
    user = await User.create({
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'Password123'
    });
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  });

  afterEach(async () => {
    await Tag.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await User.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  });

  afterAll(async () => {
    // await User.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  });

  describe('Tag Model', () => {
    it('should create a tag', async () => {
      const tag = await Tag.create({ name: 'Tech', slug: 'tech' });
      expect(tag).toBeDefined();
      expect(tag.name).toBe('Tech');
      expect(tag.slug).toBe('tech');
    });

    it('should not allow duplicate tag names', async () => {
      await Tag.create({ name: 'Unique', slug: 'unique' });
      await expect(Tag.create({ name: 'Unique', slug: 'unique2' })).rejects.toThrow();
    });

    it('should not allow duplicate tag slugs', async () => {
      await Tag.create({ name: 'Another', slug: 'another' });
      await expect(Tag.create({ name: 'Another2', slug: 'another' })).rejects.toThrow();
    });
  });

  describe('Tag Controller', () => {
    it('should create a tag via API', async () => {
      const unique = Date.now();
      const res = await request(app)
        .post('/api/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `API_${unique}`, slug: `api-${unique}` });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', `API_${unique}`);
    });

    it('should not create a tag with duplicate name via API', async () => {
      const unique = Date.now();
      await Tag.create({ name: `Dup_${unique}`, slug: `dup-${unique}` });
      const res = await request(app)
        .post('/api/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `Dup_${unique}`, slug: `dup2-${unique}` });
      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('error');
    });

    it('should not create a tag with invalid slug', async () => {
      const unique = Date.now();
      const res = await request(app)
        .post('/api/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `Invalid_${unique}`, slug: 'invalid slug!' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should return 401 if no token provided for create', async () => {
      const unique = `${Date.now()}_${Math.floor(Math.random()*10000)}`;
      const res = await request(app)
        .post('/api/tags')
        .send({ name: `API_${unique}`, slug: `api_${unique}` });
      expect(res.statusCode).toBe(401);
    });

    it('should list all tags', async () => {
        await Tag.create({ name: 'Tag1', slug: 'tag1' });
        await Tag.create({ name: 'Tag2', slug: 'tag2' });
        const res = await request(app).get('/api/tags');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('should get a single tag by id', async () => {
        const tag = await Tag.create({ name: 'Single Tag', slug: 'single-tag' });
        const res = await request(app).get(`/api/tags/${tag.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Single Tag');
    });

    it('should return 404 for non-existent tag', async () => {
        const res = await request(app).get('/api/tags/9999');
        expect(res.statusCode).toBe(404);
    });

    it('should delete a tag', async () => {
        const tag = await Tag.create({ name: 'To Delete', slug: 'to-delete' });
        const res = await request(app)
            .delete(`/api/tags/${tag.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(204);

        const foundTag = await Tag.findByPk(tag.id);
        expect(foundTag).toBeNull();
    });

    it('should return 401 if no token provided for delete', async () => {
        const tag = await Tag.create({ name: 'Cant Delete', slug: 'cant-delete' });
        const res = await request(app).delete(`/api/tags/${tag.id}`);
        expect(res.statusCode).toBe(401);
    });
  });
}); 