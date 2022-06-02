import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  Subjects,
} from '@igordonin-org/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Order, OrderStatus } from '../../models/order';
import { paymentsServiceGroupName } from './payments-service-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = paymentsServiceGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
