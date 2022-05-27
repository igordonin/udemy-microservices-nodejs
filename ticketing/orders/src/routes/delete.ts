import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@igordonin-org/ticketing-common";
import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(204).send();
  }
);

export { router as deleteOrderRouter };
