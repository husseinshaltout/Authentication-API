import HttpStatus from '@common/enums/httpStatus';
import AppError from './appError';

export default class BadRequestError extends AppError {
  statusCode = HttpStatus.BAD_REQUEST;

  constructor(message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
