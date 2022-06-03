import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order, OrderStatus } from '../models/order';
import { Ticket, TicketDoc } from '../models/ticket';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@igordonin-org/ticketing-common';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const findTicketOrThrow = async (req: Request) => {
  const { ticketId } = req.body;

  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new NotFoundError();
  }

  return ticket;
};

const verifyTicketIsNotReserved = async (ticket: TicketDoc) => {
  const isReserved = await ticket.isReserved();

  if (isReserved) {
    throw new BadRequestError(`Ticket ${ticket.title} is already reserved`);
  }
};

const EXPIRATION_WINDOW_SECONDS = 60;

const setExpirationDate = () => {
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
  return expiration;
};

const reserveTicket = async (req: Request, ticket: TicketDoc) => {
  const expiration = setExpirationDate();

  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  });

  await order.save();
  return order;
};

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .notEmpty()
      // this tightly couples this service with tickets service implementation.
      // this is just for the course and having an example.
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await findTicketOrThrow(req);
    await verifyTicketIsNotReserved(ticket);
    const order = await reserveTicket(req, ticket);

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
