import request from 'supertest';
import { app } from '../../app';

it('john is not a client yet', async () => {
  return request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'john@google.com',
      password: 'str0ngp@ssw',
    })
    .expect(400);
});

it('michael provided an incorrect password', async () => {
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'michael@google.com',
      password: 'str0ngp@ssw',
    })
    .expect(201);

  return request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'john@google.com',
      password: 'differentP@ss',
    })
    .expect(400);
});

it('charlise successfuly signs in', async () => {
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'charlise@google.com',
      password: 'str0ngp@ssw',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'charlise@google.com',
      password: 'str0ngp@ssw',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
