import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@igordonin-org/ticketing-common';
import { User } from '../models/user';

export const validateSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('Email in use');
  }

  next();
};
