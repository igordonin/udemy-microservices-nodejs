import request from 'supertest';
import { app } from '../../app';

const createTicket = (title: string, price: number) => {
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title,
    price,
  });
};

it('can fetch a list of tickets', async () => {
  await createTicket('Concert in Seattle', 20);
  await createTicket('Concert in NY', 100);
  await createTicket('Concert in Washington', 30);

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
