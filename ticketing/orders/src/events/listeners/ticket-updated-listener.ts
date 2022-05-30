import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from '@igordonin-org/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { ordersServiceGroupName } from './orders-service-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

  queueGroupName: string = ordersServiceGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price } = data;

    const ticket = await Ticket.findCurrent(data);

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
