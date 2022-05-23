import { NotFoundError } from '@igordonin-org/ticketing-common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  let ticket;
  try {
    console.log(req.params.id);
    ticket = await Ticket.findById(req.params.id);
  } catch (err) {
    console.log(err);
  }

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as findOneTicketRouter };
