export type CommonError = {
  message: string;
  field?: string;
};

export abstract class TicketingError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, TicketingError.prototype);
  }

  abstract statusCode: number;
  abstract serializeErrors(): CommonError[];
}
