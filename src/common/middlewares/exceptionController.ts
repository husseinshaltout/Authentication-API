import { Request, Response, NextFunction } from 'express';
import AppError from '@common/errors/appError';
import { Error } from 'mongoose';
import { MongoError } from 'mongodb';
import MongoValidationError from '@common/errors/exceptionErrors/mongoValidationError';
import MongoDuplicateError from '@common/errors/exceptionErrors/mongoDuplicateError';
import config from '@config';
import logger from '@loaders/logger';

const sendErrorDev = (err: AppError | Error, res: Response) => {
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  return res.status(err.statusCode).send({
    message: err.message,
    errors: err.serializeErrors(),
  });
};

const castToAppError = (err: any) => {
  if (err instanceof AppError) return err;

  if (err instanceof Error.ValidationError)
    return new MongoValidationError(err);

  if (err instanceof MongoError && err.code === 11000)
    return new MongoDuplicateError(err);

  return err;
};

const exceptionsController = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (config.NODE_ENV === 'development') {
    logger.error(err);
    return sendErrorDev(err, res);
  }

  err = castToAppError(err);
  if (err instanceof AppError) return sendErrorProd(err, res);

  logger.error(err);

  res.status(500).send({
    message: 'Something went Wrong!',
    errors: [{ message: 'Internal Server Error' }],
  });
};

export default exceptionsController;
