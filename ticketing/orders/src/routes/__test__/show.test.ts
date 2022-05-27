import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket, TicketDoc } from "../../models/ticket";

const buildTicket = async (title: string) => {
  const ticket = await Ticket.build({
    title,
    price: 10,
  });

  await ticket.save();
  return ticket;
};

const buildOrder = async (cookie: string[], ticket: TicketDoc) => {
  return await request(app).post("/api/orders").set("Cookie", cookie).send({
    ticketId: ticket.id,
  });
};

it("returns an error if order does not exist", async () => {
  const id = new mongoose.Types.ObjectId();

  await request(app)
    .get(`/api/orders/${id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(404);
});

it("returns order from current user", async () => {
  const ticket1 = await buildTicket("Concert 1");
  const ticket2 = await buildTicket("Concert 2");

  const user1 = global.signin();
  const user2 = global.signin();

  const { body: order1 } = await buildOrder(user1, ticket1);
  const { body: order2 } = await buildOrder(user2, ticket2);

  const response = await request(app)
    .get(`/api/orders/${order2.id}`)
    .set("Cookie", user2)
    .send()
    .expect(200);

  expect(response.body.id).toEqual(order2.id);
});

it("not authorized for order from another user", async () => {
  const ticket1 = await buildTicket("Concert 1");
  const ticket2 = await buildTicket("Concert 2");

  const user1 = global.signin();
  const user2 = global.signin();

  const { body: order1 } = await buildOrder(user1, ticket1);
  const { body: order2 } = await buildOrder(user2, ticket2);

  await request(app)
    .get(`/api/orders/${order2.id}`)
    .set("Cookie", user1)
    .send()
    .expect(401);
});
