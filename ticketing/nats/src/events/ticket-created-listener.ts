import nats from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from '@igordonin-org/ticketing-common';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: nats.Message): void {
    console.log('Event data!', data);
    msg.ack();
  }
}

export { TicketCreatedListener };
