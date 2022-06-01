import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@igordonin-org/ticketing-common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
