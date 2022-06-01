import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { ExpirationCompleteEvent } from '@igordonin-org/ticketing-common';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Order, OrderStatus } from '../../../models/order';

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.AwaitingPayment,
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();

  // create a fake data event
  const data: ExpirationCompleteEvent['data'] = { orderId: order.id };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled and emits an order updated event', async () => {
  const { listener, order, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { data, listener, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
