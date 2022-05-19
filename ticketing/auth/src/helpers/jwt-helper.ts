import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { UserDocument } from '../models/user';

export const addJwtToSession = (req: Request, user: UserDocument) => {
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: userJwt,
  };
};
