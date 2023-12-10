import { Request, Response, NextFunction } from 'express';

import authService from '../auth.service';

import catchAsync from '@common/middlewares/catchAsync';

import UnauthenticatedError from '@common/errors/unauthenticatedError';

const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      throw new UnauthenticatedError('You are unauthenticated');
    }

    const decoded = authService.protect(token);

    req.body = decoded;

    next();
  }
);

export default protect;
