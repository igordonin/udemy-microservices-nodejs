import { ValidationError } from 'express-validator';
import { CommonError, TicketingError } from './ticketing-error';

export class RequestValidationError extends TicketingError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Validation errors');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): CommonError[] {
    return this.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }));
  }
}
