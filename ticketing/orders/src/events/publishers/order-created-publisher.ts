import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from '@igordonin-org/ticketing-common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
