import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.delete('/api/orders/:id', async (req: Request, res: Response) => {
  res.send({});
});

export { router as deleteOrderRouter };
