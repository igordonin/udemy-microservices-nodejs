import request from 'supertest';
import { app } from '../../app';

it('john is the current user', async () => {
  const email = 'test@test.com';

  const cookie = await global.signup();

  const response = await request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual(email);
});

it('kathy is not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/current-user')
    .send()
    .expect(200);

  expect(response.body.currentUser).toBeNull();
});
