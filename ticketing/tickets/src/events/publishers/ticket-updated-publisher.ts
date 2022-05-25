import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@igordonin-org/ticketing-common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
