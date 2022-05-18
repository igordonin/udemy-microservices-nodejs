import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

const validateRequest = (req: Request) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
};

const router = express.Router();

router.post(
  '/api/users/sign-in',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  (req: Request, res: Response) => {
    validateRequest(req);

    res.send('hi there');
  }
);

export { router as signInRouter };
