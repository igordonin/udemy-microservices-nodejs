import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@igordonin-org/ticketing-common';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  body('ticketId')
    .notEmpty()
    // this tightly couples this service with tickets service implementation.
    // this is just for the course and having an example.
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('Ticket id must be provided'),
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as createOrderRouter };
