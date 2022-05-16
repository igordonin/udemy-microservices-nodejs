import { CommonError, TicketingError } from './ticketing-error';

export class NotFoundError extends TicketingError {
  constructor() {
    super('Route not found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  statusCode = 404;

  serializeErrors(): CommonError[] {
    return [{ message: 'Not found' }];
  }
}
