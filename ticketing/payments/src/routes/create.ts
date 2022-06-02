import {
  BadRequestError,
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@igordonin-org/ticketing-common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order, OrderStatus } from '../models/order';
import { Payment } from '../models/payment';
import { stripe } from '../stripe';

const router = express.Router();

router.post(
  '/api/payments',
  currentUser,
  requireAuth,
  [body('token').notEmpty(), body('orderId').notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError(`Order ${order.id} had been cancelled.`);
    }

    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError(`Order ${order.id} has been paid for already.`);
    }

    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: 'jibberish',
    });
    await payment.save();

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
