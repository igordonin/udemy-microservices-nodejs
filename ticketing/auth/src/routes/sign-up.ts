import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User, UserDocument } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';
import { addJwtToSession } from '../helpers/jwt-helper';
import { validateSignUp } from '../middlewares/validate-sign-up';

const buildAndSaveUser = async (req: Request): Promise<UserDocument> => {
  const { email, password } = req.body;

  const user = User.build({ email, password });
  await user.save();

  return user;
};

const router = express.Router();

router.post(
  '/api/users/sign-up',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters!'),
  ],
  validateRequest,
  validateSignUp,
  async (req: Request, res: Response) => {
    const user = await buildAndSaveUser(req);

    addJwtToSession(req, user);

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
