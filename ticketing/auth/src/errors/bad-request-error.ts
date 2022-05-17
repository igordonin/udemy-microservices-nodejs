import { CommonError, TicketingError } from './ticketing-error';

export class BadRequestError extends TicketingError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): CommonError[] {
    return [
      {
        message: this.message,
      },
    ];
  }
}
