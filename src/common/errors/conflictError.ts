import HttpStatus from '@common/enums/httpStatus';
import AppError from './appError';

export default class ConflictError extends AppError {
  statusCode = HttpStatus.CONFLICT;

  constructor(message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
