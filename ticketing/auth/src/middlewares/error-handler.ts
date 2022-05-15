import { Request, Response, NextFunction } from 'express';
import { TicketingError } from '../errors/ticketing-error';

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof TicketingError) {
    const errors = error.serializeErrors();
    return response.status(error.statusCode).send({ errors });
  }

  response.status(500).send({
    errors: [{ message: error.message }],
  });
};
