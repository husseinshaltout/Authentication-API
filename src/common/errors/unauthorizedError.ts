import HttpStatus from '@common/enums/httpStatus';
import AppError from './appError';

export default class UnauthorizedError extends AppError {
  statusCode = HttpStatus.UNAUTHORIZED;

  constructor(message: string = 'Unauthorized: Please Check your credentials') {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
