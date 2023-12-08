import HttpStatus from '@common/enums/httpStatus';
import AppError from '../appError';

import { Error } from 'mongoose';

export default class MongoValidationError extends AppError {
  statusCode = HttpStatus.BAD_REQUEST;

  constructor(private error: Error.ValidationError) {
    super('Invalid parameters');
  }

  serializeErrors() {
    const { errors } = this.error;
    return Object.keys(errors).map((path) => {
      return {
        message: errors[path].message,
        path,
      };
    });
  }
}
