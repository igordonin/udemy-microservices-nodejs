import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket, TicketDoc } from '../../models/ticket';

const buildTicket = async (title: string) => {
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title,
    price: 10,
  });

  await ticket.save();
  return ticket;
};

const buildOrder = async (cookie: string[], ticket: TicketDoc) => {
  return await request(app).post('/api/orders').set('Cookie', cookie).send({
    ticketId: ticket.id,
  });
};

it('returns orders from current user', async () => {
  const ticket1 = await buildTicket('Concert 1');
  const ticket2 = await buildTicket('Concert 2');
  const ticket3 = await buildTicket('Concert 3');

  const user1 = global.signin();
  const user2 = global.signin();

  const { body: order1 } = await buildOrder(user1, ticket1);
  const { body: order2 } = await buildOrder(user2, ticket2);
  const { body: order3 } = await buildOrder(user2, ticket3);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect([order2.id, order3.id]).toContain(response.body[0].id);
  expect([order2.id, order3.id]).toContain(response.body[1].id);
  expect([ticket2.id, ticket3.id]).toContain(response.body[0].ticket.id);
  expect([ticket2.id, ticket3.id]).toContain(response.body[1].ticket.id);
});
