import {
  ExpirationCompleteEvent,
  Listener,
  NotFoundError,
  Subjects,
} from '@igordonin-org/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Order, OrderStatus } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { ordersServiceGroupName } from './orders-service-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  queueGroupName: string = ordersServiceGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.status !== OrderStatus.Complete) {
      order.set({
        status: OrderStatus.Cancelled,
      });
      await order.save();

      await new OrderCancelledPublisher(this.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
        },
      });
    }

    msg.ack();
  }
}
