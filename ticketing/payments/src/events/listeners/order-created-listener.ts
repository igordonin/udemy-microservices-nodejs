import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@igordonin-org/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { paymentsServiceGroupName } from './payments-service-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = paymentsServiceGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      version: data.version,
      status: data.status,
      userId: data.userId,
    });

    await order.save();

    msg.ack();
  }
}
