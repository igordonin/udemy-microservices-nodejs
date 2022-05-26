import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@igordonin-org/ticketing-common';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

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
    const { ticketId } = req.body;

    verifyTicketIsNotReserved(req);

    const ticket = Ticket.find({ _id: ticketId });
    const order = Order.find({ ticket });

    res.send({});
  }
);

export { router as createOrderRouter };

const verifyTicketIsNotReserved = async (req: express.Request) => {
  const { ticketId } = req.body;

  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new NotFoundError();
  }

  const existingOrder = await Order.findOne({
    ticket,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  if (existingOrder) {
    throw new BadRequestError(`Ticket ${ticket.title} is already reserved`);
  }
};
