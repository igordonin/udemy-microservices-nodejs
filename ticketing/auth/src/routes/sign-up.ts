import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { User, UserDocument } from '../models/user';

const validateRequest = (req: Request) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
};

const validateUserDoesNotExist = async (req: Request) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('Email in use');
  }
};

const buildAndSaveUser = async (req: Request): Promise<UserDocument> => {
  const { email, password } = req.body;

  const user = User.build({ email, password });
  await user.save();

  return user;
};

const addJwtToSession = (req: Request, user: UserDocument) => {
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
  async (req: Request, res: Response) => {
    validateRequest(req);
    validateUserDoesNotExist(req);

    const user = await buildAndSaveUser(req);

    addJwtToSession(req, user);

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
