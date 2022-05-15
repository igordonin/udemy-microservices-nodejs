export type CommonError = {
  message: string;
  field?: string;
};

export abstract class TicketingError extends Error {
  constructor() {
    super();

    Object.setPrototypeOf(this, TicketingError.prototype);
  }

  abstract statusCode: number;
  abstract serializeErrors(): CommonError[];
}
