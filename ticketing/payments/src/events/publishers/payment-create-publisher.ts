import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from '@igordonin-org/ticketing-common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
