import { CommonError, TicketingError } from './ticketing-error';

export class DatabaseConnectionError extends TicketingError {
  reason = 'Error connecting to database';
  statusCode = 500;

  constructor() {
    super('Error connecting to database');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(): CommonError[] {
    return [{ message: this.reason }];
  }
}
