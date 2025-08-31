// backend/tests/api.test.js
const request = require('supertest');
const app = require('../server');

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'changeme';

describe('API basics', () => {
  test('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /profile returns 200 or 404 (seed state)', async () => {
    const res = await request(app).get('/profile');
    expect([200,404]).toContain(res.status);
  });
});

describe('Protected writes', () => {
  test('POST /profile requires auth', async () => {
    const res = await request(app).post('/profile').send({ name: 'Test' });
    expect(res.status).toBe(401);
  });

  test('POST /profile with auth works', async () => {
    const res = await request(app)
      .post('/profile')
      .auth(ADMIN_USER, ADMIN_PASS)
      .send({ name: 'Test User', email: 'test@example.com' });
    expect([200,201]).toContain(res.status);
  });

  test('POST /projects with auth works', async () => {
    const pr = await request(app)
      .post('/projects')
      .auth(ADMIN_USER, ADMIN_PASS)
      .send({ title: 'Test Project' });
    expect([200,201]).toContain(pr.status);
  });
});
