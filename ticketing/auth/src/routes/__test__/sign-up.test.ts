import request from 'supertest';
import { app } from '../../app';

it('john signs up to the application', async () => {
  return request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'john@google.com',
      password: 'str0ngp@ssw',
    })
    .expect(201);
});

it('jeff signs up to the application using an invalid email', async () => {
  return request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'jeff_microsoft.com',
      password: 'str0ngp@ssw',
    })
    .expect(400);
});

it('kathy signs up to the application using an invalid password', async () => {
  return request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'kathy@spotify.com',
      password: 'str',
    })
    .expect(400);
});

it('michael signs up to the application using missing credentials', async () => {
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'michael@tesla.com',
      password: '',
    })
    .expect(400);

  return request(app)
    .post('/api/users/sign-up')
    .send({
      email: '',
      password: 'str0ngp@ssw',
    })
    .expect(400);
});

it('kelly is already an user and tries to sign up again', async () => {
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'kelly@netflix.com',
      password: 'str0ngp@ssw',
    })
    .expect(201);

  return request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'kelly@netflix.com',
      password: 'str0ngp@ssw',
    })
    .expect(400);
});

it('ron receives a cookie for signing up', async () => {
  const response = await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'michael@tesla.com',
      password: 'str0ngp@ssw',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
