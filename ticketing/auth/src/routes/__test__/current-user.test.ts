import request from 'supertest';
import { app } from '../../app';

it('john is the current user', async () => {
  const email = 'john@google.com';

  await request(app)
    .post('/api/users/sign-up')
    .send({
      email,
      password: 'str0ngp@ssw',
    })
    .expect(201);

  const response = await request(app)
    .get('/api/users/current-user')
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual(email);
});
