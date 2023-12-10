import HttpStatus from '@common/enums/httpStatus';
import AppError from '../appError';

export default class InvalidTokenError extends AppError {
  statusCode = HttpStatus.UNAUTHORIZED;

  constructor() {
    super('Invalid Token Signature');
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
