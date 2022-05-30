import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@igordonin-org/ticketing-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
