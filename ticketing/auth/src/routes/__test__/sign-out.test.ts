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
