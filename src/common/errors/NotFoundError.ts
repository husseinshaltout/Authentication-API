import HttpStatus from '@common/enums/httpStatus';
import AppError from './appError';

export default class NotFoundError extends AppError {
  statusCode = HttpStatus.NOT_FOUND;

  constructor(message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
