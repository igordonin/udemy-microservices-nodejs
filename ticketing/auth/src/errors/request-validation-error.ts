import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
  // TODO Revert to private errors
  constructor(public errors: ValidationError[]) {
    super();

    // Because we're extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
