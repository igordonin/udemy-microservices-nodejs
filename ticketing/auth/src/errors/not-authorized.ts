import { CommonError, TicketingError } from './ticketing-error';

export class NotAuthorizedError extends TicketingError {
  reason = 'Not Authorized';
  statusCode = 401;

  constructor() {
    super('Error connecting to database');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): CommonError[] {
    return [{ message: this.reason }];
  }
}
