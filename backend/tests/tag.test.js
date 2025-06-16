const request = require('supertest');
const { sequelize, Tag } = require('../models');
const app = require('../app');

describe('Tag Model & Controller', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
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
      const res = await request(app)
        .post('/tags')
        .send({ name: 'API', slug: 'api' });
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('API');
    });

    it('should not create a tag with duplicate name via API', async () => {
      await Tag.create({ name: 'Dup', slug: 'dup' });
      const res = await request(app)
        .post('/tags')
        .send({ name: 'Dup', slug: 'dup2' });
      expect(res.statusCode).toBe(400);
    });

    it('should not create a tag with invalid slug', async () => {
      const res = await request(app)
        .post('/tags')
        .send({ name: 'Invalid', slug: 'invalid slug!' });
      expect(res.statusCode).toBe(400);
    });
  });
}); 