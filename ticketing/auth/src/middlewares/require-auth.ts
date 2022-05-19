import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized';

// TODO Right now assuming the current-user mw runs before this one
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};
