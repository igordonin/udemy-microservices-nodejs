import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

const createTicket = (title: string, price: number, cookie?: string[]) => {
  cookie = cookie || global.signin();

  return request(app).post('/api/tickets').set('Cookie', cookie).send({
    title,
    price,
  });
};

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'dasdasdas',
      price: 20,
    })
    .expect(404);
});

it('returns 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'dasdasdas',
      price: 20,
    })
    .expect(401);
});

it('returns 401 if the user is not the owner', async () => {
  const response = await createTicket('Concert', 200);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'New Concert',
      price: 250,
    })
    .expect(401);
});

it('returns 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await createTicket('Concert', 200, cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Concert New',
      price: -10,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();
  const response = await createTicket('Concert', 200, cookie);

  const title = 'New Concert';
  const price = 1000;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
